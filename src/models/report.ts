import mongoose, { Document, Schema } from 'mongoose'

export interface Report extends Document {
  _id: mongoose.Schema.Types.ObjectId,
  type: 'review' | 'comment',
  key: mongoose.Schema.Types.ObjectId,
  author: mongoose.Schema.Types.ObjectId,
  reason: string,
  created_at: string,
  updated_at: string,
}

const ReportSchema: Schema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  type: { type: String, required: true, enum: ['review', 'comment'] },
  key: { type: mongoose.Schema.Types.ObjectId, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, required: true },
  reason: { type: String, required: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

export const Report = mongoose.model<Report>('reports', ReportSchema)