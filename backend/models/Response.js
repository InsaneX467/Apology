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
      required: true
    },
    selectedGift: {
      type: String,
      default: ''
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
