import mongoose, { Document, Schema } from 'mongoose'

interface Gallery extends Document { // preč
  _id: mongoose.Schema.Types.ObjectId,
  path: number,
  description: string | null,
  created_at: string,
  updated_at: string,
}

const GallerySchema: Schema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  path: { type: String, required: true },
  description: { type: String, required: false, default: null },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

interface ProfileData {
  type: 'normal' | 'worker' | 'company',
  name: string | null,
  slogan: string | null,
  description: string | null,
  sections: any,
  address: string | null,
}

const ProfileDataSchema = new Schema({
  type: { type: String, required: false, enum: ['normal', 'worker', 'company'], default: 'normal' },
  name: { type: String, required: false, default: null },
  slogan: { type: String, required: false, default: null },
  description: { type: String, required: false, default: null },
  sections: { type: [Schema.Types.Mixed], required: false, default: [] },
  address: { type: String, required: false, default: null },
}, { _id: false })

interface SocialData {
  facebook: string | null,
  instagram: string | null,
  tiktok: string | null,
  linkedin: string | null
}

const SocialDataSchema = new Schema({
  facebook: { type: String, required: false, default: null },
  instagram: { type: String, required: false, default: null },
  tiktok: { type: String, required: false, default: null },
  linkedin: { type: String, required: false, default: null },
}, { _id: false })

interface ReviewsData {
  average_rating: number,
  count_reviews: number,
}

const ReviewsDataSchema = new Schema({
  average_rating: { type: Number, required: false, default: 0 },
  count_reviews: { type: Number, required: false, default: 0 },
}, { _id: false })

export interface User extends Document {
  _id: mongoose.Schema.Types.ObjectId,
  username: string,
  email: string,
  password: string,
  phone: string | null,
  avatar: string | undefined,
  profile: ProfileData,
  social: SocialData,
  gallery: [Gallery],
  reviews: ReviewsData,
  views: number,
  verify: boolean,
  created_at: string,
  updated_at: string,
  last_login: string,
}

const UserSchema: Schema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: false, default: null },
  avatar: { type: String, required: false, default: undefined },
  profile: { type: ProfileDataSchema, required: false, default: {} },
  social: { type: SocialDataSchema, required: false, default: {} },
  gallery: { type: [GallerySchema], required: false, default: [] },
  reviews: { type: ReviewsDataSchema, required: false, default: {} },
  views: { type: Number, required: false, default: 0 },
  verify: { type: Boolean, required: false, default: false },
  last_login: { type: String, required: false, default: () => new Date().toISOString() },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

export const User = mongoose.model<User>('users', UserSchema)