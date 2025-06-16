#!/bin/sh
set -e

if [ ! -d "node_modules" ]; then
  echo "$(date '+%Y-%m-%d %H:%M:%S') INFO 'node_modules' não encontrado. Instalando dependências..."
  npm install
else
  echo "$(date '+%Y-%m-%d %H:%M:%S') INFO Dependências já instaladas."
fi

echo "$(date '+%Y-%m-%d %H:%M:%S') INFO Iniciando servidor..."
exec npm run dev -- --host
