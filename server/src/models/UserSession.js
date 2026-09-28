import mongoose from 'mongoose';

const userSessionSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  payload: { type: String, required: true },
  expiresAt: { type: Date, required: true }
}, { collection: 'sessions', versionKey: false, strict: 'throw' });
userSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.UserSession || mongoose.model('UserSession', userSessionSchema);
