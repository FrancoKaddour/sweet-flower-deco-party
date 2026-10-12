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
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# Se sincroniza a AMBAS carpetas de skills del repo: .claude/skills (nativa de
# Claude Code) y .agents/skills (consumida por el runner de agentes). Hay que
# mantenerlas iguales; por eso el script copia a las dos.
DSTS=("${ROOT}/.claude/skills" "${ROOT}/.agents/skills")

# Subset de BACKEND que necesita Gonzalo (backend / panel / hardening / testing)
# y que vive en tus skills globales (~/.claude/skills).
BACKEND_SKILLS=(
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

# Skills de DISEÑO/MOTION propias del proyecto. NO viven en ~/.claude/skills:
# son del repo (fuente de verdad = .claude/skills). Solo se espejan a .agents.
# Si sumás una skill de motion/diseño al proyecto, agregala acá.
PROJECT_SKILLS=(
  motion-choreography
)

missing=0

# 1) Backend: de globales → ambas carpetas del repo.
for s in "${BACKEND_SKILLS[@]}"; do
  if [ -f "${SRC}/${s}/SKILL.md" ]; then
    for dst in "${DSTS[@]}"; do
      mkdir -p "${dst}/${s}"
      cp "${SRC}/${s}/SKILL.md" "${dst}/${s}/SKILL.md"
    done
    echo "sync (backend): ${s}"
  else
    echo "AVISO: no existe ${SRC}/${s}/SKILL.md — saltada"
    missing=1
  fi
done

# 2) Proyecto (motion/diseño): fuente = .claude/skills → se espeja a .agents/skills.
for s in "${PROJECT_SKILLS[@]}"; do
  if [ -f "${ROOT}/.claude/skills/${s}/SKILL.md" ]; then
    mkdir -p "${ROOT}/.agents/skills/${s}"
    cp "${ROOT}/.claude/skills/${s}/SKILL.md" "${ROOT}/.agents/skills/${s}/SKILL.md"
    echo "sync (proyecto): ${s}"
  else
    echo "AVISO: no existe .claude/skills/${s}/SKILL.md — saltada"
    missing=1
  fi
done

echo ""
echo "Listo. Revisá 'git status' y commiteá los cambios de .claude/skills y .agents/skills."
[ "${missing}" -eq 0 ] || echo "(Hubo skills faltantes: revisá los AVISO de arriba.)"
