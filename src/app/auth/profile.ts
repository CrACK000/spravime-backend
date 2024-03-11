import { User } from '../models/user';
import mongoose from 'mongoose';

export class Profile {

  static async updateLoginData(req: any, res: any) {

    let errors = []
    const user_id = new mongoose.Types.ObjectId(String(req.user._id))
    const { username, email, phone } = req.body

    const alreadyUsername = await User.findOne({ username: username })
    const alreadyEmail = await User.findOne({ email: email })

    // Overenie či existuje použivateľ s rovnakým username
    if (alreadyUsername && alreadyUsername._id.toString() !== user_id.toString()) {
      errors.push({
        where: 'username',
        message: 'Username already exists'
      })
    }

    // Overenie či existuje použivateľ s rovnakým email
    if (alreadyEmail && alreadyEmail._id.toString() !== user_id.toString()) {
      errors.push({
        where: 'email',
        message: 'Email already exists'
      })
    }

    // Ak validácia formy bude nesprávna vráti odpoved a vnej všetky chyby
    if (errors.length > 0) {
      return res.send({
        success: false,
        message: 'Validation error',
        errors
      })
    }

    // Nájsť užívateľa a upraviť mu data
    const updatedData = { username, email, phone }
    const result = await User.findByIdAndUpdate(user_id, updatedData)

    // Odpoveď ak zlyhá zapísanie do databázy
    if (!result) {
      return res.send({
        success: false,
        message: 'User not found'
      })
    }

    return res.send({
      success: true,
      message: 'User data updated successfully'
    })

  }

  static async updateAdvancedData(req: any, res: any) {

    const user_id = new mongoose.Types.ObjectId(String(req.user._id))
    const { type, address, name, sections, slogan, description } = req.body

    const updatedData = {
      'profile.type': type,
      'profile.address': address,
      'profile.name': name,
      'profile.sections': sections,
      'profile.slogan': slogan,
      'profile.description': description
    }

    const result = await User.findByIdAndUpdate(user_id, updatedData)

    if (!result) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    return res.status(200).json({ success: true, message: 'User data updated successfully' })

  }

  static async updateSocialData(req: any, res: any) {

    const user_id = new mongoose.Types.ObjectId(String(req.user._id))
    const { facebook, instagram, tiktok, linkedin } = req.body

    const prependHttps = (url: string) => {
      if (url) {
        if (url.startsWith('http://')) {
          return 'https://' + url.substring(7)
        } else if (!url.startsWith('https://')) {
          return 'https://' + url
        }
      }
      return url
    }

    const updatedData = {
      'social.facebook': prependHttps(facebook),
      'social.instagram': prependHttps(instagram),
      'social.tiktok': prependHttps(tiktok),
      'social.linkedin': prependHttps(linkedin)
    }

    const result = await User.findByIdAndUpdate(user_id, updatedData)

    if (!result) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    return res.status(200).json({ success: true, message: 'User data updated successfully' })

  }

}