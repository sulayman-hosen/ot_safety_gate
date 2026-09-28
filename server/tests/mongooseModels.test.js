import test from 'node:test';
import assert from 'node:assert/strict';
import UserSession from '../src/models/UserSession.js';
import SmartLaunchState from '../src/models/SmartLaunchState.js';
import ChecklistRecord from '../src/models/ChecklistRecord.js';
import { randomToken, hash, seal, unseal } from '../src/utils/securityUtils.js';

process.env.SESSION_ENCRYPTION_KEY = Buffer.alloc(32, 7).toString('base64');

test('Mongoose rejects accidental plaintext patient fields on session and record documents', async () => {
  assert.throws(() => new UserSession({ patient: { name: 'Synthetic patient' } }), /strict mode/);
  assert.throws(() => new ChecklistRecord({ accessToken: 'must-not-be-a-field' }), /strict mode/);
  await assert.rejects(new UserSession({ _id: hash(randomToken()) }).validate(), /required/);
});

test('Mongoose models accept an encrypted envelope and define session/state expiry indexes', async () => {
  const payload = seal({ patientId: 'synthetic-patient', accessToken: 'synthetic-token' });
  const row = new UserSession({ _id: hash(randomToken()), payload, expiresAt: new Date(Date.now() + 60000) });
  await row.validate();
  assert.equal(row.payload.includes('synthetic-patient'), false);
  assert.equal(unseal(row.payload).patientId, 'synthetic-patient');
  for (const model of [UserSession, SmartLaunchState]) assert.ok(model.schema.indexes().some(([keys, options]) => keys.expiresAt === 1 && options.expireAfterSeconds === 0));
});
