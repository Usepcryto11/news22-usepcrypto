// news22 entrypoint (Node 22, standard library only).
//
// This program is intentionally boring: the entry is the finished image in
// entry.png next to this file, and all this file does is place an exact copy
// of it at $MAKEFUN_OUTPUT_DIR/entry.png, where the grader looks for it.
// The judge sees exactly the bytes that land there, so the copy is checked
// after it happens: if the destination is missing or a different size than
// the source, the run fails loudly instead of submitting a broken image.
//
// Run it outside the grader's container with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

function fail(message: string): never {
  console.error(`main.ts: ${message}`);
  process.exit(1);
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outputDir) {
  fail('MAKEFUN_OUTPUT_DIR is not set (expected the directory the grader reads entry.png from).');
}

const sourcePath = join(dirname(fileURLToPath(import.meta.url)), 'entry.png');
if (!existsSync(sourcePath)) {
  fail(`entry.png not found next to main.ts at ${sourcePath}.`);
}
if (!existsSync(outputDir)) {
  fail(`output directory ${outputDir} does not exist.`);
}

const destinationPath = join(outputDir, 'entry.png');
copyFileSync(sourcePath, destinationPath);

if (!existsSync(destinationPath)) {
  fail(`copy produced no file at ${destinationPath}.`);
}
const sourceSize = statSync(sourcePath).size;
const destinationSize = statSync(destinationPath).size;
if (sourceSize !== destinationSize) {
  fail(`copy is incomplete: entry.png is ${sourceSize} bytes but ${destinationPath} is ${destinationSize} bytes.`);
}
