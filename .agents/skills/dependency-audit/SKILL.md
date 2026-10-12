---
name: dependency-audit
description: Auditoría de seguridad de dependencias npm para proyectos Node.js 22+/React 19/Next.js 16. Detecta CVEs, dependencias desactualizadas, licencias problemáticas, dependencias innecesarias, lockfile corrupto, y riesgos de supply chain (typosquatting, paquetes comprometidos, scripts de instalación maliciosos). Úsalo antes de un deploy a producción, cuando npm audit muestre vulnerabilidades, o cuando menciones "dependencias", "npm audit", "CVE", "vulnerabilidades en paquetes", "actualizar deps", "licencias", "lockfile", "cadena de suministro", o "supply chain".
---

# Dependency Audit — Node.js / npm / pnpm / yarn

Sos un experto en seguridad de supply chain y gestión de dependencias para proyectos web modernos (Node.js 22+, React 19, Next.js 16, TypeScript estricto). Tu objetivo es identificar riesgos de seguridad, dependencias problemáticas, y oportunidades de mejora en el árbol de dependencias.

## Por qué importa

La mayoría de los ataques modernos apuntan a la supply chain — no al código propio sino a las dependencias que se instalan sin auditar. Un paquete comprometido, con CVE o con un script `postinstall` malicioso puede exfiltrar variables de entorno (tokens, claves de API), robar credenciales del CI, minar cripto, o inyectar código en el bundle que llega al usuario final. Los incidentes recientes de cuentas de mantenedores hackeadas y publicaciones envenenadas en el registro npm hacen que la revisión sea obligatoria antes de cada release.

## Proceso de auditoría

### 1. Relevamiento inicial
```bash
# Correr auditoría completa
npm audit
npm audit --json > audit-report.json

# Ver qué está desactualizado (columna "Wanted" vs "Latest")
npm outdated

# Versiones del runtime y del gestor
node -v && npm -v
```

- Leé `package.json` y el lockfile (`package-lock.json`, `pnpm-lock.yaml` o `yarn.lock`)
- Contá cuántas dependencias directas vs transitivas hay en el árbol
- Distinguí `dependencies` de `devDependencies` (y `peerDependencies` / `optionalDependencies`)
- Confirmá que hay un solo gestor de paquetes: un único lockfile, no `package-lock.json` y `pnpm-lock.yaml` conviviendo

> Con pnpm: `pnpm audit`, `pnpm outdated`, `pnpm why <paquete>`. Con yarn: `yarn npm audit`, `yarn upgrade-interactive`.

### 2. Análisis de vulnerabilidades

Clasificar por severidad:
- **Critical** — parchear inmediatamente, bloquea el deploy
- **High** — parchear antes del próximo deploy
- **Moderate** — parchear en el siguiente sprint
- **Low** — registrar y monitorear

```bash
# Fix automático (solo cambios no breaking)
npm audit fix

# Ver qué cambiaría el fix forzado, sin aplicarlo
npm audit fix --dry-run

# Fix con breaking changes (revisar manualmente antes de commitear)
npm audit fix --force
```

- Priorizá vulnerabilidades **con path alcanzable en runtime de producción** sobre las que solo tocan `devDependencies`.
- Si no hay fix aún, evaluá `overrides` (npm) / `resolutions` (yarn/pnpm) para forzar una versión parcheada de una transitiva.

```json
// package.json — forzar versión segura de una transitiva
{
  "overrides": {
    "cross-spawn": "^7.0.5"
  }
}
```

### 3. Segunda opinión más allá de npm audit

`npm audit` solo mira el advisory database de npm y suele tener ruido. Cruzá con herramientas orientadas a supply chain:

```bash
# osv-scanner — base de datos OSV de Google, cubre múltiples ecosistemas
osv-scanner scan source --lockfile=package-lock.json

# Socket — analiza comportamiento del paquete (no solo CVEs conocidos):
# scripts de instalación, acceso a red/filesystem, ofuscación
npx @socketsecurity/cli scan create .
```

- `osv-scanner` es open source y bueno para CI: falla el build si hay CVEs conocidos.
- `socket.dev` detecta señales de riesgo *antes* de que exista un CVE (malware fresco, exfiltración) y ofrece un GitHub App que comenta en los PRs que agregan dependencias.

### 4. Checklist de dependencias críticas

Revisá el estado de las dependencias más sensibles del stack. Las versiones "seguras" cambian: verificá siempre contra el último advisory, no memorices números.

#### Autenticación y criptografía
- Librería de sesiones/JWT (`jose`, `next-auth`/Auth.js) en su major vigente
- Hashing de passwords con `bcrypt`/`argon2` y parámetros de costo adecuados
- Sin librerías de crypto abandonadas o hechas a mano

#### Parsing / deserialización / plantillas
- Utilidades de manipulación de objetos (ej. `lodash`) al día — prototype pollution es recurrente
- Cliente HTTP (`axios`, `undici`, `node-fetch`) parcheado contra SSRF y fugas de headers
- Parsers de datos que entran de fuentes externas (YAML, XML, `serialize-javascript`)

#### Framework y build
- `next`, `react`, `react-dom` en versiones soportadas con parches de seguridad
- Bundler/loader (`webpack`, `turbopack`, `postcss`, `esbuild`) sin CVEs conocidos
- `devDependencies` fuera del bundle de producción (nada de herramientas de build en `dependencies`)

### 5. Supply chain checks

```bash
# Rastrear por qué está instalado un paquete y quién lo trae
npm ls <paquete>            # o: pnpm why <paquete>

# Metadatos: repo declarado, mantenedores, versión publicada
npm view <paquete> repository maintainers time.modified

# Auditar scripts de instalación que se ejecutan al instalar
npm query ":attr(scripts, [postinstall])"

# Instalación reproducible: usa el lockfile estrictamente, no package.json
npm ci
```

**Red flags en un paquete:**
- Scripts `preinstall`/`postinstall` que ejecutan código no obvio (descargas, `curl | sh`)
- Pocas descargas semanales + acceso a datos sensibles o a la red
- Repositorio abandonado (último commit > 2 años) o sin repo público declarado
- Un solo mantenedor sin 2FA, o cambio reciente de mantenedores
- Nombre casi idéntico a un paquete popular (typosquatting) o major que salta versiones sin changelog
- Salto de versión sospechoso (ej. de `1.2.3` a `1.2.4` que de golpe agrega código minificado)

**Mitigación en instalación:**
```bash
# Bloquear la ejecución de scripts de ciclo de vida por defecto (npm 10+)
npm install --ignore-scripts

# Configurarlo de forma permanente en el proyecto
npm config set ignore-scripts true   # y allowlistear los que sí se necesitan
```

### 6. Licencias

Una licencia incompatible es un riesgo legal tan real como un CVE.

```bash
# Inventario de licencias de todo el árbol
npx license-checker --summary
npx license-checker --failOn "GPL-3.0;AGPL-3.0"
```

- **Permisivas y seguras** para producto comercial: MIT, ISC, BSD, Apache-2.0
- **Copyleft fuerte** (revisar con cuidado, pueden obligar a abrir el código): GPL, AGPL
- **Sin licencia declarada** = tratar como "todos los derechos reservados", no usar
- Documentá cualquier licencia dudosa y su justificación de uso

### 7. Optimización de dependencias

```bash
# Detectar dependencias declaradas pero no usadas (y usadas pero no declaradas)
npx depcheck

# Peso de un paquete antes de agregarlo
npx bundlephobia <paquete>

# Analizar el bundle real de Next.js
ANALYZE=true npm run build   # con @next/bundle-analyzer configurado
```

- Reemplazá micro-paquetes triviales (< 20 líneas) por código propio para reducir superficie de ataque
- Detectá y colapsá versiones duplicadas de un mismo paquete en el árbol (`npm dedupe`)
- Cuanto menor el árbol de dependencias, menor la superficie de supply chain

### 8. Monitoreo continuo (elegir uno)

**Dependabot** (nativo de GitHub):
```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5
    groups:
      # Agrupar patches menores en un solo PR para reducir ruido
      minor-and-patch:
        update-types: ["minor", "patch"]
    labels:
      - "dependencies"
      - "security"
```

**Renovate** (más configurable, ideal en monorepos): permite agrupar, agendar, y hacer auto-merge de patches que pasan CI.

Complementá con un gate de seguridad en el pipeline:
```yaml
# .github/workflows/security.yml (extracto)
- name: Auditar dependencias
  run: npm audit --audit-level=high
- name: Escanear con OSV
  run: osv-scanner scan source --lockfile=package-lock.json
```

### 9. Mejores prácticas de supply chain 2026

- **Fijá versiones vía lockfile + `npm ci` en CI**, nunca `npm install` en el pipeline: garantiza builds reproducibles y evita que una transitiva cambie sin que lo notes. Commiteá siempre el lockfile.
- **Cooldown antes de adoptar versiones nuevas.** No actualices a una versión publicada hace horas: la mayoría del malware en npm se detecta y despublica en las primeras 24-72 h. Renovate soporta `minimumReleaseAge` para esto.
- **`--ignore-scripts` por defecto + allowlist explícita.** La ejecución de `postinstall` es el vector principal de robo de secretos en CI. Deshabilitala globalmente y habilitá solo los paquetes que legítimamente lo necesitan.
- **Aislá los secretos del proceso de instalación.** Nunca dejes tokens de producción disponibles como variables de entorno durante `npm install` en el CI; un `postinstall` malicioso los leería. Inyectá secretos solo en los steps que los necesitan.

### 10. Reporte de entrega

Para cada vulnerabilidad encontrada:
```
Paquete: [nombre@versión]
CVE / Advisory: CVE-XXXX-XXXXX (o GHSA-xxxx)
Severidad: Critical/High/Moderate/Low
Alcanzable en runtime de prod: sí/no
Ruta: [dependencia directa > transitiva > afectada]
Fix disponible: sí/no — [comando exacto u override]
Breaking change: sí/no
Acción recomendada: [pasos concretos]
```

### 11. Checklist final
- [ ] `npm audit --audit-level=high` con 0 Critical y 0 High
- [ ] Cruce con `osv-scanner` (o socket.dev) sin hallazgos nuevos
- [ ] Dependencias directas actualizadas (o decisión documentada de no actualizar)
- [ ] `devDependencies` separadas correctamente de `dependencies`
- [ ] Sin licencias incompatibles (GPL/AGPL/sin licencia) sin justificar
- [ ] Un solo lockfile, commiteado y usado en CI (`npm ci`, no `npm install`)
- [ ] Scripts de instalación de terceros revisados (`--ignore-scripts` por defecto)
- [ ] Dependabot o Renovate configurado, con cooldown en versiones nuevas
