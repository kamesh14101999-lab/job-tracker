import mongoose from 'mongoose';

const STATUS_VALUES = ['applied', 'interview', 'offer', 'rejected'];

const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  company: {
    type: String,
    required: [true, 'Company is required'],
    trim: true,
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    trim: true,
  },
  status: {
    type: String,
    enum: STATUS_VALUES,
    default: 'applied',
  },
  dateApplied: {
    type: Date,
    default: Date.now,
  },
  jobLink: {
    type: String,
    trim: true,
    default: '',
  },
  salary: {
    type: String,
    trim: true,
    default: '',
  },
  location: {
    type: String,
    trim: true,
    default: '',
  },
  notes: {
    type: String,
    trim: true,
    default: '',
  },
}, {
  timestamps: { createdAt: false, updatedAt: true },
});

applicationSchema.statics.STATUS_VALUES = STATUS_VALUES;

const Application = mongoose.model('Application', applicationSchema);

export default Application;
