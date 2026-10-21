import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const stylesheet = readFileSync('src/style.css', 'utf8');
const application = readFileSync('src/main.ts', 'utf8');
const image = readFileSync('public/casino-atmosphere.png');

test('casino atmosphere uses the existing PNG asset', () => {
  assert.equal(image.subarray(1, 4).toString(), 'PNG');
  assert.match(stylesheet, /url\('\/casino-atmosphere\.png'\)/);
  assert.doesNotMatch(stylesheet, /casino-atmosphere\.webp/);
});

test('member selection and session controls remain available', () => {
  assert.match(application, /data-member="\$\{index\}"/);
  assert.match(application, /data-screen="\$\{item\.screen\}"/);
  assert.match(application, /data-action="finish"/);
});
