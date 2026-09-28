import mongoose from 'mongoose';

const auditEventSchema = new mongoose.Schema({
  owner: { type: String, required: true },
  action: { type: String, required: true, maxlength: 160 },
  at: { type: Date, required: true }
}, { collection: 'audits', versionKey: false, strict: 'throw' });
auditEventSchema.index({ owner: 1, at: -1 });

export default mongoose.models.AuditEvent || mongoose.model('AuditEvent', auditEventSchema);
