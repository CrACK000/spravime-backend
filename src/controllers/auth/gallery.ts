import { User } from '../../models/user'
import mongoose from 'mongoose'
import { DeleteObjectCommand, DeleteObjectCommandInput } from '@aws-sdk/client-s3';
import { s3 } from '../../config/aws'
import { checkValidObjectId } from '../../config/functions';

export class Gallery {

  static async addImages(req: any, res: any, next: any) {

    const user_id = new mongoose.Types.ObjectId(String(req.user._id))

    let gallery = req.files.map((file: { key: string }) => ({
      path: file.key
    }))

    // Update user's gallery and get the updated document
    const updatedUser = await User.findOneAndUpdate({ _id: user_id }, { $push: { gallery: { $each: gallery } } }, { new: true })

    // Check if user found
    if (!updatedUser) {
      return res.send({ success: false, message: "User not found!" })
    }

    // Return new images
    return res.send({ success: true, message: "Images added successfully!", images: updatedUser.gallery })
  }

  static async removeImages(req: any, res: any, next: any) {

    const { imageIds } = req.body

    if (!checkValidObjectId(req.user._id)){
      return res.send({ success: false, message: "Invalid user ID!" })
    }

    const user_id = new mongoose.Types.ObjectId(String(req.user._id))

    const user = await User.findOne({ _id: user_id })

    if (!user) {
      return res.send({ success: false, message: "User not found!" })
    }

    // Filter out images to delete
    const updatedGallery = user.gallery.filter((image: any) =>
      !imageIds.includes(image._id.toString())
    )

    // Delete images from S3
    const imagesToDelete = user.gallery.filter((image: any) =>
      imageIds.includes(image._id.toString())
    )

    await Gallery.removeImagesFromS3(imagesToDelete)

    // Update user's gallery
    const updatedUser = await User.findOneAndUpdate(
      { _id: user_id },
      { gallery: updatedGallery },
      { new: true }
    )

    if (!updatedUser) {
      return res.send({ success: false, message: "Error updating user's gallery!" })
    }

    return res.send({ success: true, message: "Images removed successfully!", images: updatedUser.gallery })
  }

  static async avatar(req: any, res: any, next: any) {
    try {
      let userid = new mongoose.Types.ObjectId(String(req.user.id))

      // Získať starý avatar
      const user = await User.findOne({ _id: userid })
      if (!user) {
        return res.status(404).send({ success: false, message: "User not found!" })
      }
      const oldAvatar = user.avatar

      // Upload nového avataru a aktualizácia v databáze
      const filename = req.file.key
      await User.updateOne({ _id: userid }, { avatar: filename })

      // Vymazať starý avatar
      if (oldAvatar) {
        await s3.send(new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET,
          Key: oldAvatar
        }))
      }

      res.status(200).send({ success: true, message: "Avatar updated successfully!", newAvatar: filename })
    } catch (error) {
      next(error)
      return res.status(500).send({ success: false, message: "Avatar is not updated!" })
    }
  }

  static async removeImagesFromS3(images: any) {

    for (let image of images) {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET,
          Key: image.path
        } as unknown as DeleteObjectCommandInput)
      )
    }

  }

  static async removeAvatarFromS3(avatarKey: string) {

    // Delete avatar from S3
    await s3.send(new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: `${avatarKey}`
    }))

  }

}