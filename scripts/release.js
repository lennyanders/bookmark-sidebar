import { readFile, writeFile } from 'fs/promises';
import pkg from '../package.json';
import AdmZip from 'adm-zip';

const zip = new AdmZip();
zip.addLocalFolder('./dist');
zip.writeZip('./dist/release.zip');

const changelogPath = './CHANGELOG.md';
const changelog = await readFile(changelogPath, { encoding: 'utf-8' });
const newChangelog = changelog.replace('## Next', `## ${pkg.version}`);
await writeFile(changelogPath, newChangelog, { encoding: 'utf-8' });
