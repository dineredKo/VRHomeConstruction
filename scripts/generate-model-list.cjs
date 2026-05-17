const fs = require('fs');
const path = require('path');

const modelsDir = path.resolve(__dirname, '../public/models');
const outputFile = path.resolve(__dirname, '../src/features/furniture/modelList.ts');

const results = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (/\.(glb|gltf)$/i.test(entry.name)) {
      const relative = '/' + path.relative(path.resolve(__dirname, '../public'), fullPath).replace(/\\/g, '/');
      results.push(relative);
    }
  }
}

walk(modelsDir);

const content = `// Автоматически сгенерировано. Не редактировать вручную.
export const modelPaths: string[] = ${JSON.stringify(results, null, 2)};

export const getModelName = (path: string) => {
  const fileName = path.split('/').pop() || '';
  return fileName.replace(/\.(glb|gltf)$/, '');
};
`;

fs.writeFileSync(outputFile, content, 'utf-8');
console.log(`Сгенерирован modelList.ts с ${results.length} моделями`);