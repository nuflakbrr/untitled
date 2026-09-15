import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('.', import.meta.url).pathname;
const directories = {
  scenario: join(root, 'scenario'),
  testCase: join(root, 'test-case'),
};

function collect(directory, suffix) {
  const files = readdirSync(directory).filter((file) => file.endsWith(suffix));
  const ids = new Map();

  for (const file of files) {
    const match = file.match(/^(tc\d{3})-/i);
    if (!match) throw new Error(`Nama file tidak memakai ID TC tiga digit: ${file}`);
    if (ids.has(match[1])) throw new Error(`ID duplikat ${match[1]}: ${ids.get(match[1])}, ${file}`);
    ids.set(match[1], file);
  }

  return ids;
}

const scenarios = collect(directories.scenario, '.md');
const testCases = collect(directories.testCase, '.spec.ts');
const missingScenarios = [...testCases.keys()].filter((id) => !scenarios.has(id));
const missingTestCases = [...scenarios.keys()].filter((id) => !testCases.has(id));

for (const [id, file] of scenarios) {
  const content = readFileSync(join(directories.scenario, file), 'utf8').trim();
  if (!content.includes(id.toUpperCase())) {
    throw new Error(`Scenario tidak mencantumkan ID: ${file}`);
  }
}

if (missingScenarios.length || missingTestCases.length) {
  throw new Error([
    missingScenarios.length && `Scenario hilang: ${missingScenarios.join(', ')}`,
    missingTestCases.length && `Test case hilang: ${missingTestCases.join(', ')}`,
  ].filter(Boolean).join('\n'));
}

console.log(`Valid: ${scenarios.size} scenario dan ${testCases.size} Playwright spec berpasangan.`);
