import mongoose, { Document, Schema } from 'mongoose'

export interface MessagesContainer extends Document {
  _id: mongoose.Schema.Types.ObjectId,
  key: mongoose.Schema.Types.ObjectId,
  from: mongoose.Schema.Types.ObjectId,
  to: mongoose.Schema.Types.ObjectId,

  created_at: string,
  updated_at: string,
}

const ContainerSchema: Schema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  key: { type: mongoose.Schema.Types.ObjectId, required: true },
  from: { type: mongoose.Schema.Types.ObjectId, required: true },
  to: { type: mongoose.Schema.Types.ObjectId, required: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

export const MessagesContainer = mongoose.model<MessagesContainer>('messages', ContainerSchema)