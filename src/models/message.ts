import mongoose, { Document, Schema } from 'mongoose'

interface Message {
  _id?: mongoose.Schema.Types.ObjectId,
  message: string,
  new?: boolean,
  created_at?: string,
  updated_at?: string,
}

const MessageSchema: Schema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  message: { type: String, required: true },
  new: { type: Boolean, required: false, default: true },
  created_at: { type: String, required: true },
  updated_at: { type: String, required: true }
})

interface Container {
  from: {
    user_id: mongoose.Schema.Types.ObjectId,
    messages: Message[]
  },
  to: {
    user_id: mongoose.Schema.Types.ObjectId,
    messages: Message[]
  }
}

export interface MessagesContainer extends Document {
  _id: mongoose.Schema.Types.ObjectId,
  key: mongoose.Schema.Types.ObjectId,
  container: Container,
  created_at: string,
  updated_at: string,
}

const ContainerSchema: Schema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  key: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'requests' },
  container: {
    from: {
      user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
      messages: { type: [MessageSchema], required: false, default: [] }
    },
    to: {
      user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
      messages: { type: [MessageSchema], required: false, default: [] }
    }
  }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

export const MessagesContainer = mongoose.model<MessagesContainer>('messages', ContainerSchema)