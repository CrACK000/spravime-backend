import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import { Gallery } from './gallery'
import { Offer } from '../../models/offer'
import { User } from '../../models/user'
import { Review } from '../../models/review'
import { MessagesContainer } from '../../models/message'

export class Security {

  static async changePassword(req: any, res: any, next: any) {

    const { currentPass, newPass } = req.body
    const user_id = new mongoose.Types.ObjectId(String(req.user._id))

    try {
      const user = await User.findById(user_id)

      if (!user) {
        return res.send({ success: false, message: 'User not found.' })
      }

      const isCurrentPassValid = await Security.checkPassword(currentPass, user.password)

      if (!isCurrentPassValid) {
        return res.send({ success: false, message: 'Current password is incorrect.' })
      }

      user.password = await bcrypt.hash(newPass, 10)
      await user.save()

      return res.send({ success: true, message: 'Password changed successfully.' })

    } catch (error) {
      console.log('[Change-password] Server connection failed.', error)
      return res.send({ success: false, message: 'Server connection failed.' })
    }

  }

  static async checkPassword(rawPassword: string, hashedPassword: string) {

    return await bcrypt.compare(rawPassword, hashedPassword)

  }

  static async removeAccount(req: any, res: any, next: any) {

    const { password } = req.body
    const user_id = new mongoose.Types.ObjectId(String(req.user._id))

    try {
      const user = await User.findById(user_id)

      if (!user) {
        return res.send({ success: false, message: 'User not found.' })
      }

      const isPasswordValid = await Security.checkPassword(password, user.password)

      if (!isPasswordValid) {
        return res.send({ success: false, message: 'Password is incorrect.' })
      }

      // Remove user images and avatar
      if (user.gallery.length > 0) {
        await Gallery.removeImagesFromS3(user.gallery)
      }
      if (user.avatar) {
        await Gallery.removeAvatarFromS3(user.avatar)
      }

      // Remove user reviews
      await Review.deleteMany({ author: user_id })


      // Remove message containers
      await MessagesContainer.deleteMany({
        $or: [
          { 'container.from.user_id': user_id },
          { 'container.to.user_id': user_id }
        ]
      })


      // Remove offers
      await Offer.deleteMany({ author: user_id })

      // Finally, remove user account
      await User.deleteOne({ _id: user_id })

      return res.send({ success: true, message: 'Account removed successfully.' })

    } catch (error) {
      console.log('[Remove-account] Server connection failed.', error)
      return res.send({ success: false, message: 'Server connection failed.' })
    }

  }

}