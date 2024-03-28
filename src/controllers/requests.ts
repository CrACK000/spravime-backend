import { RequestModel } from '../models/request-model'
import mongoose from 'mongoose'

export class RequestsClass {

  static async all(req: any, res: any) {

    const response = await RequestModel.find().populate({
      path: 'author',
      select: 'username avatar verify profile.name'
    })
    return res.status(200).send(response)

  }

  static async view(req: any, res: any) {

    if (!req.params.id || !mongoose.Types.ObjectId.isValid(String(req.params.id))) {
      return res.status(404).send({  success: false, message: "Invalid id." })
    }

    const id = new mongoose.Types.ObjectId(String(req.params.id))
    const request = await RequestModel.findOne({ _id: id }).populate({
      path: 'author',
      select: 'username avatar verify profile.name'
    })

    if (!request) {
      return res.status(404).send({ success: false, message: "Request not found." })
    }

    return res.status(200).send(request)

  }

  static async allMine(req: any, res: any) {

    if (!req.user && !mongoose.Types.ObjectId.isValid(String(req.user._id))) {
      return res.status(401).send({ success: false, message: "Unauthorized." })
    }

    const userId = new mongoose.Types.ObjectId(String(req.user._id))
    const response = await RequestModel.find({ author: userId })
    return res.status(200).send(response)

  }

  static async create(req: any, res: any) {

    let { title, section, category, address, time_range, start_at, end_at, description } = req.body

    const document = {
      title: title,
      section: section,
      category: category,
      description: description,
      address: address,
      time_range: time_range ? { start_at, end_at } : null,
      author: new mongoose.Types.ObjectId(String(req.user.id)),
    }

    const result = new RequestModel(document)
    await result.save()

    if (!result) {
      return res.send({ success: false, message: "Database has failed." })
    }

    return res.send({ success: true, message: "The request has been successfully added.", last_id: result._id })

  }

  static async edit(req: any, res: any) {

    const { title, section, category, address, time_range, start_at, end_at, description, request_id } = req.body

    if (!request_id || !mongoose.Types.ObjectId.isValid(String(request_id))) {
      return res.send({ success: false, message: "Invalid id." })
    }

    const _id = new mongoose.Types.ObjectId(String(request_id))
    const filter = { _id: _id }
    const update = {
      $set: {
        title: title,
        section: section,
        category: category,
        description: description,
        address: address,
        time_range: time_range ? { start_at, end_at } : null
      }
    }
    const options = { new: true }
    const result = await RequestModel.findOneAndUpdate(filter, update, options)

    if (!result) {
      return res.send({ success: false, message: "Request not found." })
    }

    return res.send({ success: true, message: "The request was successfully updated.", request: result })

  }

  static async remove(req: any, res: any) {

    const { ids } = req.body

    const filter = { _id: { $in: ids } }
    const result = await RequestModel.deleteMany(filter)

    if (result.deletedCount === 0) {
      return res.status(404).send({ success: false, message: "Request not found." })
    }

    return res.status(200).send({ success: true, message: "The request was successfully removed." })

  }

}