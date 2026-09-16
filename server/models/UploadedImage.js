import mongoose from 'mongoose';

const uploadedImageSchema = new mongoose.Schema(
  {
    data: {
      type: String, // base64 string or data URL
      required: true
    },
    contentType: {
      type: String,
      default: 'image/webp'
    },
    size: {
      type: Number,
      default: 0
    },
    filename: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export const UploadedImage = mongoose.model('UploadedImage', uploadedImageSchema);
