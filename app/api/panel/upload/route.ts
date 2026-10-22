import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { assertStaff } from "@/lib/dal";

/**
 * Subida de fotos DIRECTA del navegador a Vercel Blob (sin pasar el archivo
 * por la función → sin límite de 4,5 MB). Este endpoint solo firma el permiso
 * de subida, y solo para staff logueado. Tipos y tamaño acotados.
 */
export const runtime = "nodejs";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        await assertStaff();
        if (!["productos/", "contenido/", "newsletter/"].some((c) => pathname.startsWith(c))) {
          throw new Error("Carpeta no permitida");
        }
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
          maximumSizeInBytes: 15 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      // El registro en la base lo hace la Server Action agregarImagen (con auditoría).
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(json);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
