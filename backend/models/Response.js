import mongoose from 'mongoose';

const responseSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true
    },
    selectedOption: {
      type: String,
      required: true,
      enum: ['Tonight', '1 Day', '2 Days']
    },
    twoDayRequests: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Response', responseSchema);

