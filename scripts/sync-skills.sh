#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# sync-skills.sh — sincroniza las skills de backend desde tus skills globales
# (~/.claude/skills) hacia el repo (.claude/skills), para que el equipo (Gonzalo)
# las reciba al clonar y no queden desactualizadas.
#
# Por qué existe: las skills viven en ~/.claude/skills (personales, por máquina).
# El repo versiona una COPIA del subset de backend. Cuando mejorás una skill
# global, corré este script para propagar el cambio al repo y commitealo.
#
# Uso (desde la raíz del repo, con Git Bash):
#   bash scripts/sync-skills.sh
#   git add .claude/skills && git commit -m "chore(skills): sync bundle"
# ---------------------------------------------------------------------------
set -euo pipefail

SRC="${HOME}/.claude/skills"
DST="$(cd "$(dirname "$0")/.." && pwd)/.claude/skills"

# Subset que necesita Gonzalo (backend / panel / hardening / testing).
# Si sumás una skill al bundle, agregala acá.
SKILLS=(
  architecture-review
  api-design
  backend-review
  db-review
  auth-review
  security-audit
  owasp-hardening
  dependency-audit
  devops-audit
  monitoring-setup
  performance-audit
  code-quality
  project-clean
  testing
)

missing=0
for s in "${SKILLS[@]}"; do
  if [ -f "${SRC}/${s}/SKILL.md" ]; then
    mkdir -p "${DST}/${s}"
    cp "${SRC}/${s}/SKILL.md" "${DST}/${s}/SKILL.md"
    echo "sync: ${s}"
  else
    echo "AVISO: no existe ${SRC}/${s}/SKILL.md — saltada"
    missing=1
  fi
done

echo ""
echo "Listo. Revisá 'git status' y commiteá los cambios de .claude/skills."
[ "${missing}" -eq 0 ] || echo "(Hubo skills faltantes: revisá los AVISO de arriba.)"
