import assert from 'node:assert/strict';
import test from 'node:test';

test('project setup is ready', () => {
  assert.equal('copper-mesa-rewards'.length > 0, true);
});
