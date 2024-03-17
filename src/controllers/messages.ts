import { MessagesContainer } from '../models/message'
import mongoose from 'mongoose'
import { Offer } from '../models/offer'
import { checkValidObjectId } from '../config/functions'

export class Messages {

  static async sendMsgFromOffer(req: any, res: any) {

    const { offerId, msg } = req.body

    if (!checkValidObjectId(offerId)) {
      return res.status(404).send({  success: false, message: "Invalid id." })
    }

    const key = new mongoose.Types.ObjectId(String(offerId))
    const from = new mongoose.Types.ObjectId(String(req.user._id))

    const selectOffer = await Offer.findOne({ _id: key })

    const to = new mongoose.Types.ObjectId(String(selectOffer.author))

    // 1. Create an empty container
    const createContainer = new MessagesContainer({
      key: key,
      container: {
        from: {
          user_id: from,
          messages: []
        },
        to: {
          user_id: to,
          messages: []
        }
      }
    })

    let savedContainer = await createContainer.save()

    if (!savedContainer) {
      return res.status(500).send({ success: false, message: "Failed to create container." })
    }

    // 2. append new message to the `from` array
    savedContainer.container.from.messages.push({
      message: msg,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

    // 3. save the update container
    const saveEnd = await savedContainer.save()

    if (!saveEnd) {
      return res.status(500).send({ success: false, message: "Failed to save container." })
    }

    return res.status(200).send({ success: true, message: "Message sent successfully." })

  }

  static async checkAlreadyContainer(req: any, res: any) {

    const { offerId } = req.body

    if (!req.user) {
      return res.send({ success: false, message: "Unauthorized." })
    }

    if (!checkValidObjectId(offerId)) {
      return res.send({ success: false, message: "Invalid id." })
    }

    const key = new mongoose.Types.ObjectId(String(offerId))
    const from = new mongoose.Types.ObjectId(String(req.user._id))

    const selectOffer = await Offer.findOne({ _id: key })

    const to = new mongoose.Types.ObjectId(String(selectOffer.author))

    if (String(to) === String(from)) {
      return res.send({ success: false, message: "Cannot send message to yourself." })
    }

    const container = await MessagesContainer.findOne({
      key,
      $or: [
        { 'container.from.user_id': from },
        { 'container.to.user_id': to }
      ]
    })

    if (container) {
      return res.send({ success: true, message: "Container already exists.", isAlready: true })
    } else {
      return res.send({ success: false, message: "Container does not exist.", isAlready: false })
    }

  }

  static async fetchContainer(req: any, res: any) {

    const containerId = new mongoose.Types.ObjectId(String(req.body.container))

    const container = await MessagesContainer.findOne({ _id: containerId }).populate([
      { path: 'key', select: 'title' },
      { path: 'container.from.user_id', select: 'username avatar verify profile.name' },
      { path: 'container.to.user_id', select: 'username avatar verify profile.name' }
    ])

    if (!container) {
      return res.status(404).send({ message: "Container not found." })
    }

    return res.status(200).send(container)

  }

  static async fetchAccounts(req: any, res: any) {

    const user_id = new mongoose.Types.ObjectId(String(req.user._id))

    let containers = await MessagesContainer.find({
      $or: [
        { 'container.from.user_id': user_id },
        { 'container.to.user_id': user_id }
      ]
    })

    // Fetch only the last message in from and in to for each container:
    containers = await Promise.all(containers.map(async container => {
      if (container.container.from.messages.length > 0) container.container.from.messages = container.container.from.messages.slice(-1)
      if (container.container.to.messages.length > 0) {
        const lastToMessage = container.container.to.messages.slice(-1)[0]
        // Check if the last message was sent in to:
        if (lastToMessage && new Date(lastToMessage.created_at) > new Date(container.container.from.messages[0].created_at)) {
          container.container.from.messages = [] // Clear the from messages if the last message was sent in to
        }
        container.container.to.messages = [lastToMessage] // Only include the last to message
      }
      return container
    }))

    const populatedContainers = await MessagesContainer.populate(containers, [
      { path: 'container.from.user_id', select: 'username avatar verify profile.name' },
      { path: 'container.to.user_id', select: 'username avatar verify profile.name' }
    ])

    if (!populatedContainers && populatedContainers.length === 0) {
      return res.status(404).send({ message: "No containers found." })
    }

    return res.status(200).send(populatedContainers)

  }

  static async addMessage(req: any, res: any) {

    if (req.user) {

      const user_id = new mongoose.Types.ObjectId(String(req.user._id))
      const container_id = new mongoose.Types.ObjectId(String(req.body.container))

      const container = await MessagesContainer.findOne({
        _id: container_id,
        $or: [
          { 'container.from.user_id': user_id },
          { 'container.to.user_id': user_id }
        ]
      })

      if (!container) {

        return res.send({ success: false, message: 'No matching container found' })

      } else {

        const newMessage = {
          message: req.body.message,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        // If the 'req.user._id' is same as 'from', add to 'from'. If it is same as 'to', add to 'to'
        if (String(container.container.from.user_id) === String(req.user._id)) {
          container.container.from.messages.push(newMessage)
        }
        if (String(container.container.to.user_id) === String(req.user._id)) {
          container.container.to.messages.push(newMessage)
        }

        const savedContainer = await container.save()
        return res.send({ success: true, message: 'Message added successfully', data: savedContainer })
      }
    } else {
      return res.send({ success: false, message: 'User not authenticated' })
    }

  }

  static async readMessages(req: any, res: any) {

    if (req.user) {

      const user_id = new mongoose.Types.ObjectId(String(req.user._id))
      const container_id = new mongoose.Types.ObjectId(String(req.body.container))

      const container = await MessagesContainer.findOne({
        _id: container_id,
        $or: [
          { 'container.from.user_id': user_id },
          { 'container.to.user_id': user_id }
        ]
      })

      if (!container) {

        return res.send({ success: false, message: 'No matching container found' })

      } else {
        // If the 'req.user._id' is same as 'from', update messages in 'from'. If it's same as 'to', update in 'to'
        if (String(container.container.from.user_id) === String(req.user._id)) {
          container.container.to.messages = container.container.to.messages.map((message) => {
            message.new = false
            return message
          })
        }

        if (String(container.container.to.user_id) === String(req.user._id)) {
          container.container.from.messages = container.container.from.messages.map((message) => {
            message.new = false
            return message
          })
        }

        await container.save()
        return res.send({ success: true, message: 'Messages updated successfully' })
      }
    } else {
      return res.send({ success: false, message: 'User not authenticated' })
    }

  }

}