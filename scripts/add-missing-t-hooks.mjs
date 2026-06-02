import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'panels', 'student');

function walk(d) {
  return fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(d, e.name);
    return e.isDirectory() ? walk(p) : e.name.endsWith('.jsx') ? [p] : [];
  });
}

let n = 0;
for (const fp of walk(root)) {
  let c = fs.readFileSync(fp, 'utf8');
  if (!c.includes("t('studentPanel") && !c.includes('t("studentPanel')) continue;
  if (c.includes('const { t } = useTranslation()')) continue;
  if (!c.includes("from 'react-i18next'")) {
    c = "import { useTranslation } from 'react-i18next';\n" + c;
  }
  const pats = [
    /(const \w+ = \(\) => \{\r?\n)/,
    /(const \w+ = \(\{[^}]*\}\) => \{\r?\n)/,
    /(export default function \w+\([^)]*\) \{\r?\n)/,
  ];
  for (const p of pats) {
    if (p.test(c)) {
      c = c.replace(p, `$1  const { t } = useTranslation();\n`);
      fs.writeFileSync(fp, c);
      n++;
      console.log(path.relative(root, fp));
      break;
    }
  }
}
console.log('added hook to', n, 'files');
