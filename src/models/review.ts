import mongoose, { Document, Schema } from 'mongoose'

export interface Review extends Document {
  _id: mongoose.Schema.Types.ObjectId,
  author: mongoose.Schema.Types.ObjectId,
  key: mongoose.Schema.Types.ObjectId,
  rating: number,
  recommendation: boolean,
  description: string,
  created_at: string,
  updated_at: string,
}

const ReviewSchema: Schema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
  key: { type: mongoose.Schema.Types.ObjectId, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  recommendation: { type: Boolean, required: true },
  description: { type: String, required: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

export const Review = mongoose.model<Review>('reviews', ReviewSchema)