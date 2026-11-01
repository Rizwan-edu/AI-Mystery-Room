import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import app from '../app.js';
import { connectDB } from '../config/db.js';

describe('End-to-End API Workflow Tests', () => {
  let server;
  let baseUrl;
  let createdCaseId;
  let firstClueId;
  let testSuspectId;

  before(async () => {
    await connectDB();
    await new Promise((resolve) => {
      // Listen on ephemeral port 0 to prevent conflicts with port 5000
      server = app.listen(0, '127.0.0.1', () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}/api`;
        resolve();
      });
    });
  });

  after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  test('GET /api/health returns 200 and healthy status', async () => {
    const res = await fetch(`${baseUrl}/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, 'healthy');
    assert.ok(data.database);
    assert.ok(data.ai);
  });

  test('POST /api/cases creates a new mystery without exposing the solution', async () => {
    const res = await fetch(`${baseUrl}/cases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        premise: 'A priceless emerald disappeared during the museum masquerade ball.',
        difficulty: 'easy',
      }),
    });

    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.data.id, 'Case should have an ID');
    assert.strictEqual(body.data.difficulty, 'easy');
    assert.strictEqual(body.data.suspects.length, 3, 'Easy difficulty should have 3 suspects');
    assert.strictEqual(body.data.clues.length, 5, 'Easy difficulty should have 5 clues');

    // Security check: culpritId must not be leaked!
    assert.strictEqual(body.data.culpritId, undefined);
    assert.strictEqual(body.data.solutionExplanation, undefined);

    createdCaseId = body.data.id;
    firstClueId = body.data.clues[0].id;
    testSuspectId = body.data.suspects[0].id;
  });

  test('GET /api/cases/:id retrieves active case securely', async () => {
    const res = await fetch(`${baseUrl}/cases/${createdCaseId}`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.id, createdCaseId);
    assert.strictEqual(body.data.culpritId, undefined);
  });

  test('POST /api/cases/:id/clues/:clueId/discover unlocks clue description', async () => {
    const res = await fetch(`${baseUrl}/cases/${createdCaseId}/clues/${firstClueId}/discover`, {
      method: 'POST',
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.clue.id, firstClueId);
    assert.ok(body.data.clue.description);
    assert.ok(body.data.discoveredClueIds.includes(firstClueId));

    // Discovering again must not duplicate the ID
    const resDup = await fetch(`${baseUrl}/cases/${createdCaseId}/clues/${firstClueId}/discover`, {
      method: 'POST',
    });
    const dupBody = await resDup.json();
    const count = dupBody.data.discoveredClueIds.filter((id) => id === firstClueId).length;
    assert.strictEqual(count, 1, 'Duplicate clue discoveries must not be added');
  });

  test('POST /api/cases/:id/hints unlocks progressive hint', async () => {
    const res = await fetch(`${baseUrl}/cases/${createdCaseId}/hints`, {
      method: 'POST',
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.hintsUsed, 1);
    assert.ok(body.data.latestHint);
  });

  test('POST /api/cases/:id/accuse submits accusation and reveals verdict', async () => {
    const res = await fetch(`${baseUrl}/cases/${createdCaseId}/accuse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ suspectId: testSuspectId }),
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.data.culpritId, 'Culprit is now revealed');
    assert.ok(body.data.solutionExplanation, 'Explanation is now revealed');
    assert.ok(typeof body.data.finalScore === 'number');

    // Repeated accusation should fail
    const repeatedRes = await fetch(`${baseUrl}/cases/${createdCaseId}/accuse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ suspectId: testSuspectId }),
    });
    assert.strictEqual(repeatedRes.status, 400);
  });

  test('GET /api/cases/:id/result returns completed verdict', async () => {
    const res = await fetch(`${baseUrl}/cases/${createdCaseId}/result`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.data.culprit);
    assert.ok(typeof body.data.finalScore === 'number');
  });
});
