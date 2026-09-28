import mongoose from 'mongoose';

const checklistRecordSchema = new mongoose.Schema({
  _id: { type: String, required: true, immutable: true },
  owner: { type: String, required: true, immutable: true },
  requestHash: { type: String, required: true, immutable: true },
  payload: { type: String, required: true, immutable: true },
  createdAt: { type: Date, required: true, immutable: true }
}, { collection: 'records', versionKey: false, strict: 'throw' });
checklistRecordSchema.index({ owner: 1, createdAt: -1 });

export default mongoose.models.ChecklistRecord || mongoose.model('ChecklistRecord', checklistRecordSchema);
