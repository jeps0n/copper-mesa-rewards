import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

function source(path) {
  return readFileSync(path, 'utf8');
}

test('casino background and responsive styles remain unchanged', () => {
  const stylesheet = source('src/style.css');
  const image = readFileSync('public/casino-atmosphere.png');

  assert.equal(image.subarray(1, 4).toString(), 'PNG');
  assert.match(stylesheet, /url\('\/casino-atmosphere\.png'\)/);
  assert.match(stylesheet, /@media \(max-width: 1050px\)/);
  assert.match(stylesheet, /@media \(max-width: 700px\)/);
});

test('kiosk controls and member navigation remain connected', () => {
  const application = source('src/main.ts');
  const kiosk = source('src/ui/kiosk.ts');
  const menu = source('src/data/menu.ts');

  assert.match(kiosk, /data-member="\$\{index\}"/);
  assert.match(kiosk, /data-action="finish"/);
  assert.match(menu, /screen: 'gifts'/);
  assert.match(menu, /screen: 'promotions'/);
  assert.match(menu, /screen: 'points'/);
  assert.match(menu, /screen: 'account'/);
  assert.match(application, /renderKiosk\(app, screen, member, screenContent\(\)\)/);
});
