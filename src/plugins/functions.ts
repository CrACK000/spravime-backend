import mongoose from 'mongoose'

export function generateRandomString(length: number) {

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''

  for (let i = 0; i < length; i++) {

    result += characters.charAt(Math.floor(Math.random() * characters.length))

  }

  return result

}

export function checkValidObjectId(_id: string): boolean {

  return _id && mongoose.Types.ObjectId.isValid(String(_id))

}