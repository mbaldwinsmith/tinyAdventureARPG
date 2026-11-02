import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
interface PackageMetadata {
  name: string;
  version: string;
  license?: string;
  dependencies?: Record<string, string>;
}
async function packageDirectory(root: string, name: string, from: string): Promise<string> {
  let directory = from;
  while (directory.startsWith(root)) {
    const candidate = path.join(directory, 'node_modules', name);
    try {
      await stat(path.join(candidate, 'package.json'));
      return candidate;
    } catch {
      /* Try the next Node resolution ancestor. */
    }
    const parent = path.dirname(directory);
    if (parent === directory) break;
    directory = parent;
  }
  throw new Error(`Missing notice dependency: ${name}`);
}
export async function buildNotices(root: string): Promise<string> {
  root = path.resolve(root);
  const main = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8')) as {
    dependencies: Record<string, string>;
  };
  const records = new Map<
    string,
    { metadata: PackageMetadata; license: string; role: 'runtime' | 'build' }
  >();
  async function visit(name: string, role: 'runtime' | 'build', from: string): Promise<void> {
    const directory = await packageDirectory(root, name, from),
      metadata = JSON.parse(
        await readFile(path.join(directory, 'package.json'), 'utf8'),
      ) as PackageMetadata;
    const key = `${metadata.name}@${metadata.version}`,
      old = records.get(key);
    if (old) {
      if (role === 'runtime') old.role = role;
      return;
    }
    const licenseFile = (await readdir(directory))
      .filter((file) => /^licen[cs]e(?:\..*)?$/i.test(file))
      .sort()[0];
    if (!licenseFile) throw new Error(`No bundled license text found for ${key}`);
    const license = await readFile(path.join(directory, licenseFile), 'utf8');
    records.set(key, { metadata, license, role });
    for (const child of Object.keys(metadata.dependencies ?? {}).sort())
      await visit(child, role, directory);
  }
  for (const name of Object.keys(main.dependencies).sort()) await visit(name, 'runtime', root);
  for (const name of ['fflate', 'pngjs']) await visit(name, 'build', root);
  let text =
    '# Third-party software notices\n\nGenerated from the locked, installed package graph by `npm run assets:build`. Runtime dependencies are included below with their bundled licence texts. Archive and PNG build tools are recorded separately; they are not imported into the browser application. The repository software licence and purchased artwork terms remain separate.\n';
  for (const role of ['runtime', 'build'] as const) {
    text += `\n## ${role === 'runtime' ? 'Browser runtime' : 'Archive and PNG build tools'}\n`;
    for (const [key, record] of [...records]
      .filter(([, r]) => r.role === role)
      .sort(([a], [b]) => a.localeCompare(b, 'en'))) {
      text += `\n### ${key}\n\nDeclared licence: ${record.metadata.license ?? 'See bundled text'}\n\n\`\`\`text\n${record.license.trim()}\n\`\`\`\n`;
    }
  }
  // Phaser also vendors code that is absent from npm's dependency graph.
  const phaser = await packageDirectory(root, 'phaser', root);
  text +=
    '\n## Components bundled inside Phaser\n\nThese notices come from the installed Phaser source, including its vendored geometry and physics code.\n';
  for (const [name, file] of [
    ['Earcut (ISC)', 'src/geom/polygon/Earcut.js'],
    ['Simplify (BSD 2-clause)', 'src/geom/polygon/Simplify.js'],
    ['Matter.js (MIT)', 'src/physics/matter-js/lib/license.js'],
  ]) {
    if (!name || !file) throw new Error('Missing bundled notice definition');
    const source = await readFile(path.join(phaser, file), 'utf8');
    const notice = source
      .match(/\/\*[\s\S]*?\*\//g)
      ?.find((block) => block.includes('Copyright (c)'));
    if (!notice || !notice.includes('SOFTWARE'))
      throw new Error(`Missing bundled licence: ${file}`);
    text += `\n### ${name}\n\nSource: \`phaser/${file}\`\n\n\`\`\`text\n${notice.trim()}\n\`\`\`\n`;
  }
  const bundled = await readFile(path.join(phaser, 'dist/phaser.esm.js'), 'utf8');
  const copyrights = [
    ...new Set(
      bundled
        .split(/\r?\n/)
        .filter(
          (line) =>
            /^\s*(?:\*|\/\/)\s*(?:@copyright\s|Copyright \(c\))/.test(line) &&
            !line.includes('Phaser Studio'),
        )
        .map((line) => line.trim()),
    ),
  ].sort();
  if (!copyrights.some((line) => line.includes('Stefan Gustavson')))
    throw new Error('Missing bundled noise attribution');
  text += `\n### Additional embedded attributions\n\nPreserved from Phaser's distributed ESM source. MIT components use the MIT permission/disclaimer text recorded above; embedded component notices retain their own terms.\n\n\`\`\`text\n${copyrights.join('\n')}\n\`\`\`\n`;
  return text;
}
