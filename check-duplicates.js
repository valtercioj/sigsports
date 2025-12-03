#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const MIN_CHAR_LENGTH = 1000; // Mínimo de caracteres para considerar duplicação

// Obter todos os arquivos .ts e .tsx
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    try {
      if (fs.statSync(filePath).isDirectory()) {
        if (!file.startsWith(".") && file !== "node_modules") {
          arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
        }
      } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
        arrayOfFiles.push(filePath);
      }
    } catch (e) {
      // Ignorar erros de acesso
    }
  });

  return arrayOfFiles;
}

// Extrair funções e componentes do código
function extractBlocks(code, filename) {
  const blocks = [];

  // Padrão para funções: function name() { ... } ou const name = () => { ... }
  const functionPattern =
    /(?:function|const|export)\s+(\w+)\s*(?:=|[:\(])[^\{]*\{(?:[^{}]|\{[^{}]*\})*\}/g;
  let match;

  while ((match = functionPattern.exec(code)) !== null) {
    const blockCode = match[0];
    // Remover trivialidades como "const router = useCardRouter();" ou "const handleLogout = ..."
    const isTrivial =
      blockCode.length < MIN_CHAR_LENGTH ||
      blockCode.match(/^const\s+\w+\s*=\s*\w+\([^)]*\);?\s*$/) ||
      blockCode.split("\n").length <= 1;

    if (!isTrivial) {
      blocks.push({
        filename,
        name: match[1],
        code: blockCode,
        start: match.index,
        length: blockCode.length,
      });
    }
  }

  return blocks;
}

// Calcular similaridade entre dois blocos de código
function similarity(code1, code2) {
  if (code1 === code2) return 1.0;

  // Remover espaços em branco e comentários
  const normalize = (code) =>
    code
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/.*/g, "")
      .replace(/\s+/g, " ")
      .trim();

  const norm1 = normalize(code1);
  const norm2 = normalize(code2);

  if (norm1 === norm2) return 1.0;

  // Levenshtein distance simplificado
  const shorter = Math.min(norm1.length, norm2.length);
  const longer = Math.max(norm1.length, norm2.length);

  if (longer === 0) return 1.0;

  // Se o tamanho é muito diferente, provavelmente não é duplicação
  if (longer > shorter * 1.5) return 0;

  // Contar caracteres comuns
  let common = 0;
  for (let i = 0; i < Math.min(norm1.length, norm2.length); i++) {
    if (norm1[i] === norm2[i]) common++;
  }

  return common / longer;
}

const srcPath = path.join(__dirname, "src");
console.log(`\n🔍 Analisando arquivos em ${srcPath}...\n`);

const files = getAllFiles(srcPath);
console.log(`📁 ${files.length} arquivos encontrados\n`);

const allBlocks = [];
files.forEach((file) => {
  try {
    const content = fs.readFileSync(file, "utf8");
    const blocks = extractBlocks(content, file);
    allBlocks.push(...blocks);
  } catch (e) {
    // Ignorar erros
  }
});

console.log(`📦 ${allBlocks.length} blocos de código analisados\n`);

// Procurar duplicações
const duplicates = [];
const THRESHOLD = 0.8; // 80% de similaridade

for (let i = 0; i < allBlocks.length; i++) {
  for (let j = i + 1; j < allBlocks.length; j++) {
    const block1 = allBlocks[i];
    const block2 = allBlocks[j];

    // Ignorar o mesmo arquivo
    if (block1.filename === block2.filename) continue;

    const sim = similarity(block1.code, block2.code);
    if (sim >= THRESHOLD) {
      duplicates.push({
        file1: path.relative(srcPath, block1.filename),
        func1: block1.name,
        file2: path.relative(srcPath, block2.filename),
        func2: block2.name,
        similarity: (sim * 100).toFixed(1),
      });
    }
  }
}

if (duplicates.length > 0) {
  console.log(
    `❌ ERRO: ${duplicates.length} funções/componentes duplicados detectados!\n`
  );
  duplicates.slice(0, 15).forEach((dup, index) => {
    console.log(
      `${index + 1}. ${dup.file1}::${dup.func1} <-> ${dup.file2}::${dup.func2}`
    );
    console.log(`   Similaridade: ${dup.similarity}%\n`);
  });

  if (duplicates.length > 15) {
    console.log(`... e mais ${duplicates.length - 15} duplicações\n`);
  }

  console.log(`Total: ${duplicates.length} funções/componentes duplicados\n`);
  process.exit(1);
} else {
  console.log("✅ Nenhum código duplicado significativo detectado!\n");
  process.exit(0);
}
