import mongoose from 'mongoose';

const smartLaunchStateSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  browser: { type: String, required: true },
  payload: { type: String, required: true },
  expiresAt: { type: Date, required: true }
}, { collection: 'launches', versionKey: false, strict: 'throw' });
smartLaunchStateSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.SmartLaunchState || mongoose.model('SmartLaunchState', smartLaunchStateSchema);
