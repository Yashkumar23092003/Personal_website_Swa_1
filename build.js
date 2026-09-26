import { cp, mkdir, rm } from 'node:fs/promises';

// Only this generated directory is replaced. Original photos stay in assets/.
const output = new URL('./dist/', import.meta.url);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const entry of ['index.html', 'style.css', 'app.js', 'catch.js', 'favicon.svg', 'favicon.ico', 'apple-touch-icon.png', 'assets']) {
  await cp(new URL(`./${entry}`, import.meta.url), new URL(entry, output), {
    recursive: true,
    filter: source => !source.split(/[\\/]/).some(part => part.startsWith('.')),
  });
}
console.log('Static website ready in dist/');
