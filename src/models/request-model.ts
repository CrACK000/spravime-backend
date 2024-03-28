import mongoose, { Document, Schema } from 'mongoose'

interface TimeRange {
  start_at: string,
  end_at: string
}

export interface RequestModel extends Document {
  _id: mongoose.Schema.Types.ObjectId,
  title: string,
  address: string,
  description: string,
  author: mongoose.Schema.Types.ObjectId,
  section: number,
  category: number,
  status: boolean,
  disabled: boolean,
  approved: boolean,
  top: boolean,
  time_range: null | TimeRange,
  views: number,
  closed_at: string,
  created_at: string,
  updated_at: string,
}

const RequestModelSchema: Schema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  title: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
  section: { type: Number, required: true },
  category: { type: Number, required: true },
  status: { type: Boolean, required: false, default: true },
  disabled: { type: Boolean, required: false, default: false },
  approved: { type: Boolean, required: false, default: true },
  top: { type: Boolean, required: false, default: false },
  time_range: { type: Object, required: false, default: null },
  views: { type: Number, required: false, default: 0 },
  closed_at: { type: String, required: false, default: () => new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString() },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

export const RequestModel = mongoose.model<RequestModel>('requests', RequestModelSchema)