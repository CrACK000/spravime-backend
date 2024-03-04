import mongoose, { Document, Schema } from 'mongoose'

export interface Gallery extends Document {
  _id: mongoose.Schema.Types.ObjectId,
  author: mongoose.Schema.Types.ObjectId,
  path: number,
  description: string | null,
  created_at: string,
  updated_at: string,
}

const GallerySchema: Schema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  author: { type: mongoose.Schema.Types.ObjectId, required: true },
  path: { type: String, required: true },
  description: { type: String, required: false, default: null },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

export const Gallery = mongoose.model<Gallery>('galleries', GallerySchema)