#!/bin/bash

# Script to run jscpd and fail if duplicates are found
npx jscpd --min-lines 10 --min-tokens 10 src

# Check if jscpd found any duplicates
# The pattern "Found X clones" indicates duplicates were found
if npx jscpd --min-lines 10 --min-tokens 10 src 2>&1 | grep -q "Found [1-9]"; then
  echo ""
  echo "❌ ERRO: Código duplicado detectado!"
  exit 1
fi

echo ""
echo "✅ Nenhum código duplicado detectado."
exit 0
