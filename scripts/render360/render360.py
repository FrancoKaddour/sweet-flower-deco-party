"""
Vuelta 360° de un exhibidor para la web (Sweet Flowers).

Uso (lo llama render-todos.bat; también se puede a mano):
  blender.exe -b "Luna_Nova.blend" -P render360.py -- "C:\\salida\\luna-nova"

Qué hace, sin tocar el .blend original (no guarda nada):
  · Junta todo lo visible del archivo bajo un "eje" en el centro del objeto y
    lo gira 360° en 96 cuadros (000.png … 095.png).
  · Cámara propia, IGUAL para todos los exhibidores: 3/4 desde arriba, con el
    objeto entero y aire alrededor (así todos se ven del mismo tamaño y ángulo).
  · Piso "atrapa-sombras": el fondo sale transparente pero con la sombra real
    al piso; después se pone sobre el color de la web.
  · Usa las luces y materiales de Tobías si el archivo los tiene; si no tiene
    luces, arma una iluminación de estudio suave.
  · Cycles en la placa de video (CUDA/OptiX), con denoise.
"""
import math
import sys

import bpy
from mathutils import Vector

# ----------------------------------------------------------------- ajustes
CUADROS = 96
ANCHO, ALTO = 1600, 1500
MUESTRAS = 96            # con denoise alcanza; subir a 192 si se ve granulado
ELEVACION_GRADOS = 22    # qué tan "desde arriba" mira la cámara
LENTE_MM = 60
AIRE = 1.35              # margen alrededor del objeto (1 = justo)

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
salida = argv[0] if argv else "//render360"

scene = bpy.context.scene

# ----------------------------------------------------------------- GPU
def usar_gpu():
    prefs = bpy.context.preferences.addons["cycles"].preferences
    for tipo in ("OPTIX", "CUDA"):
        try:
            prefs.compute_device_type = tipo
            prefs.get_devices()
            gpus = [d for d in prefs.devices if d.type == tipo]
            if gpus:
                for d in prefs.devices:
                    d.use = d.type == tipo
                print(f"[render360] GPU: {tipo} -> {[d.name for d in gpus]}")
                return True
        except Exception as e:  # tipo no disponible en esta compu
            print(f"[render360] {tipo} no disponible: {e}")
    print("[render360] OJO: no se encontró GPU, va a renderizar con el procesador (lento).")
    return False

scene.render.engine = "CYCLES"
scene.cycles.device = "GPU" if usar_gpu() else "CPU"
scene.cycles.samples = MUESTRAS
scene.cycles.use_denoising = True
try:
    scene.cycles.denoiser = "OPENIMAGEDENOISE"
except Exception:
    pass
scene.render.resolution_x = ANCHO
scene.render.resolution_y = ALTO
scene.render.resolution_percentage = 100
scene.render.film_transparent = True
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"
scene.render.image_settings.color_depth = "8"
try:
    scene.view_settings.view_transform = "AgX"
except Exception:
    scene.view_settings.view_transform = "Filmic"
scene.view_settings.look = "None"

# ----------------------------------------------------------------- qué gira
def visible(o):
    return o.visible_get() and not o.hide_render

modelos = [o for o in scene.objects if o.type in {"MESH", "CURVE", "SURFACE", "META", "FONT"} and visible(o)]
# Fuera pisos/fondos que haya dejado el render original (planos enormes y chatos).
def es_piso(o):
    dims = o.dimensions
    return o.type == "MESH" and len(o.data.vertices) <= 8 and dims.z < 0.001 and max(dims.x, dims.y) > 0

pisos_viejos = [o for o in modelos if es_piso(o)]
for o in pisos_viejos:
    o.hide_render = True
modelos = [o for o in modelos if o not in pisos_viejos]
if not modelos:
    raise SystemExit("[render360] No encontré objetos para renderizar.")

# Caja que envuelve todo
pts = [o.matrix_world @ Vector(c) for o in modelos for c in o.bound_box]
mn = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
mx = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
centro = (mn + mx) / 2
tam = mx - mn
radio = max(tam.x, tam.y, tam.z) * 0.5 * math.sqrt(2)  # gira: cubre la diagonal
piso_z = mn.z
print(f"[render360] {len(modelos)} objetos · tamaño {tam.x:.2f} × {tam.y:.2f} × {tam.z:.2f}")

# Eje de giro en el centro, a la altura del piso
eje = bpy.data.objects.new("eje360", None)
scene.collection.objects.link(eje)
eje.location = Vector((centro.x, centro.y, piso_z))
bpy.context.view_layer.update()

raices = [o for o in modelos if o.parent is None or o.parent not in modelos]
for o in raices:
    mw = o.matrix_world.copy()
    o.parent = eje
    o.matrix_world = mw

scene.frame_start = 0
scene.frame_end = CUADROS - 1
eje.rotation_euler = (0, 0, 0)
eje.keyframe_insert("rotation_euler", index=2, frame=0)
# El cuadro 96 sería igual al 0: la vuelta cierra perfecta en loop.
eje.rotation_euler = (0, 0, math.radians(360))
eje.keyframe_insert("rotation_euler", index=2, frame=CUADROS)
for fc in eje.animation_data.action.fcurves:
    for k in fc.keyframe_points:
        k.interpolation = "LINEAR"

# ----------------------------------------------------------------- piso con sombra
bpy.ops.mesh.primitive_plane_add(size=max(tam.x, tam.y) * 12, location=(centro.x, centro.y, piso_z))
piso = bpy.context.active_object
piso.name = "piso360"
piso.is_shadow_catcher = True

# ----------------------------------------------------------------- cámara
cam_data = bpy.data.cameras.new("cam360")
cam_data.lens = LENTE_MM
cam = bpy.data.objects.new("cam360", cam_data)
scene.collection.objects.link(cam)
scene.camera = cam

objetivo = Vector((centro.x, centro.y, piso_z + tam.z * 0.5))
# Distancia para que el objeto (girando) entre entero con aire, en el lado más corto del cuadro
sensor = cam_data.sensor_width
fov_h = 2 * math.atan(sensor / (2 * LENTE_MM))
fov_v = 2 * math.atan((sensor * ALTO / ANCHO) / (2 * LENTE_MM))
fov = min(fov_h, fov_v)
alto_vis = max(radio, tam.z * 0.5 + radio * math.sin(math.radians(ELEVACION_GRADOS)))
dist = (alto_vis * AIRE) / math.tan(fov / 2)
el = math.radians(ELEVACION_GRADOS)
az = math.radians(-35)  # un poco de costado
cam.location = objetivo + Vector((math.cos(el) * math.sin(az), -math.cos(el) * math.cos(az), math.sin(el))) * dist
cam.rotation_euler = (objetivo - cam.location).to_track_quat("-Z", "Y").to_euler()
cam_data.clip_end = dist * 10

# ----------------------------------------------------------------- luces
luces = [o for o in scene.objects if o.type == "LIGHT" and visible(o)]
mundo = scene.world or bpy.data.worlds.new("mundo360")
scene.world = mundo
mundo.use_nodes = True
fondo = mundo.node_tree.nodes.get("Background")
if not luces:
    print("[render360] El archivo no tiene luces: armo un estudio.")
    if fondo:
        fondo.inputs[0].default_value = (0.96, 0.95, 0.94, 1)
        fondo.inputs[1].default_value = 0.6
    def luz(nombre, energia, tam_luz, pos):
        d = bpy.data.lights.new(nombre, "AREA")
        d.energy = energia
        d.size = tam_luz
        o = bpy.data.objects.new(nombre, d)
        scene.collection.objects.link(o)
        o.location = objetivo + Vector(pos) * dist * 0.6
        o.rotation_euler = (objetivo - o.location).to_track_quat("-Z", "Y").to_euler()
        return o
    escala = max(dist * dist * 40, 50)
    luz("clave", escala * 1.0, dist * 0.5, (-0.8, -0.9, 1.1))
    luz("relleno", escala * 0.35, dist * 0.8, (1.0, -0.6, 0.5))
    luz("contra", escala * 0.5, dist * 0.4, (0.2, 1.0, 1.0))
else:
    print(f"[render360] Uso las {len(luces)} luces del archivo.")

# ----------------------------------------------------------------- render
scene.render.filepath = salida.rstrip("\\/") + "/###"
print(f"[render360] Renderizando {CUADROS} cuadros en: {salida}")
bpy.ops.render.render(animation=True)
print("[render360] Listo.")
