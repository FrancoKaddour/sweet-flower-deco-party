---
name: dependency-audit
description: Auditoría de seguridad de dependencias npm para proyectos Node.js/React/Next.js. Detecta CVEs, dependencias desactualizadas, licencias problemáticas, dependencias innecesarias, y supply chain risks. Úsalo cuando quieras revisar la seguridad de las dependencias, antes de un deploy a producción, cuando npm audit muestre vulnerabilidades, o cuando menciones "dependencias", "npm audit", "CVE", "vulnerabilidades en paquetes", "actualizar deps", "licencias", o "supply chain".
---

# Dependency Audit — Node.js / npm / yarn / pnpm

Sos un experto en seguridad de supply chain y gestión de dependencias. Tu objetivo es identificar riesgos de seguridad, dependencias problemáticas, y oportunidades de mejora en el árbol de dependencias.

## Por qué importa

El 80% de los ataques modernos apuntan a la supply chain — no al código propio sino a las dependencias. Un paquete comprometido o con CVE puede exponer datos de usuarios, ejecutar código malicioso, o generar responsabilidad legal.

## Proceso de auditoría

### 1. Relevamiento inicial
```bash
# Correr auditoría completa
npm audit
npm audit --json > audit-report.json

# Ver qué está desactualizado
npm outdated

# Versiones de node y npm
node -v && npm -v
```

- Leé `package.json` y `package-lock.json` (o `yarn.lock`, `pnpm-lock.yaml`)
- Contá cuántas dependencias directas vs transitivas
- Identificá cuáles son `dependencies` vs `devDependencies`

### 2. Análisis de vulnerabilidades

Clasificar por severidad:
- **Critical** — parchear inmediatamente
- **High** — parchear antes del próximo deploy
- **Moderate** — parchear en el siguiente sprint
- **Low** — registrar y monitorear

```bash
# Fix automático (solo cambios no breaking)
npm audit fix

# Ver qué cambiaría el fix forzado
npm audit fix --dry-run

# Fix con breaking changes (revisar manualmente)
npm audit fix --force
```

### 3. Checklist de dependencias críticas

#### Dependencias de autenticación
- `jsonwebtoken` — versión > 9.0.0 (CVE en versiones anteriores)
- `bcrypt` / `bcryptjs` — verificar que se usa hash rounds >= 10
- Si usan NextAuth — verificar versión actual de `next-auth`

#### Dependencias de parsing/deserialización
- `serialize-javascript` — vulnerabilidad XSS en versiones viejas
- `lodash` — prototype pollution en versiones < 4.17.21
- `axios` — SSRF en versiones < 1.6.0

#### Dependencias de build
- Separar bien `devDependencies` de `dependencies`
- Dependencias de dev no deben estar en bundle de producción

### 4. Supply chain checks

```bash
# Verificar que paquetes tienen repositorio declarado
npm view [paquete] repository

# Ver quién mantiene un paquete crítico
npm view [paquete] maintainers

# Verificar integridad de lockfile
npm ci  # usa lockfile estrictamente, no package.json
```

**Red flags en paquetes:**
- Pocas descargas + acceso a datos sensibles
- Repositorio abandonado (último commit > 2 años)
- Un solo mantenedor sin 2FA
- Nombre similar a paquete popular (typosquatting)

### 5. Optimización de dependencias

```bash
# Detectar dependencias no usadas
npx depcheck

# Analizar tamaño de bundle
npx bundlephobia [paquete]
# o
npx webpack-bundle-analyzer
```

- Identificar paquetes que se pueden reemplazar por código propio (< 20 líneas)
- Identificar paquetes duplicados en diferentes versiones

### 6. Configuración de monitoreo continuo

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5
    labels:
      - "dependencies"
      - "security"
```

### 7. Reporte de entrega

Para cada vulnerabilidad encontrada:
```
Paquete: [nombre@versión]
CVE: CVE-XXXX-XXXXX
Severidad: Critical/High/Moderate/Low
Ruta: [dependencia directa > transitiva > afectada]
Fix disponible: sí/no — [comando exacto]
Breaking change: sí/no
Acción recomendada: [pasos concretos]
```

### 8. Checklist final
- [ ] `npm audit` con 0 Critical y 0 High
- [ ] Dependencias directas actualizadas (o decisión documentada de no actualizar)
- [ ] `devDependencies` separadas correctamente de `dependencies`
- [ ] Dependabot o Renovate configurado para monitoreo continuo
- [ ] Lockfile commiteado y usado en CI (`npm ci` no `npm install`)
