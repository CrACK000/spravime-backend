import { getDb } from '../plugins/database';
import { ObjectId, FindOneAndUpdateOptions } from 'mongodb';

export class Offers {

  static async all(req: any, res: any) {

    const response = await getDb().collection('offers').find().toArray()
    return res.status(200).send(response)

  }

  static async view(req: any, res: any) {

    if (!req.params.id || !ObjectId.isValid(String(req.params.id))) {
      return res.status(404).send({  success: false, message: "Invalid id." })
    }

    const id = new ObjectId(String(req.params.id))
    const offer = await getDb().collection('offers').findOne({ _id: id })

    if (!offer) {
      return res.status(404).send({ success: false, message: "Offer not found." });
    }

    return res.status(200).send(offer);

  }

  static async allMine(req: any, res: any) {

    if (!req.user && !req.user._id) {
      return res.status(401).send({ success: false, message: "Unauthorized." })
    }

    const userId = req.user._id
    const response = await getDb().collection('offers').find({ author: userId }).toArray()
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
      time_range: time_range,
      start_at: start_at,
      end_at: end_at,
      author: req.user.id,
      created_at: new Date(),
      closed_at: new Date().setMonth(new Date().getMonth() + 3),
      approved: true,
    }

    const result = await getDb().collection('offers').insertOne(document)

    if (!result) {
      return res.status(500).send({ success: false, message: "Database has failed." })
    }

    return res.status(201).send({ success: true, message: "The request has been successfully added.", last_id: result.insertedId })

  }

  static async edit(req: any, res: any) {

    const { title, section, category, address, time_range, start_at, end_at, description, offer_id } = req.body

    if (!offer_id || !ObjectId.isValid(String(offer_id))) {
      return res.status(404).send({  success: false, message: "Invalid id." })
    }

    const id = new ObjectId(String(offer_id))
    const filter = { _id: id };
    const update = {
      $set: {
        title: title,
        section: section,
        category: category,
        description: description,
        address: address,
        time_range: time_range,
        start_at: start_at,
        end_at: end_at,
      }
    }
    const options = { returnOriginal: false } as FindOneAndUpdateOptions
    const result = await getDb().collection('offers').findOneAndUpdate(filter, update, options)

    if (!result) {
      return res.status(404).send({ success: false, message: "Offer not found." })
    }

    return res.status(200).send({ success: true, message: "The request was successfully updated." })

  }

  static async remove(req: any, res: any) {

    const { ids } = req.body

    const idArray = ids.map((id: string) => new ObjectId(String(id)))
    const filter = { _id: { $in: idArray } }
    const result = await getDb().collection('offers').deleteMany(filter)

    if (!result) {
      return res.status(404).send({ success: false, message: "Offer not found." })
    }

    return res.status(200).send({ success: true, message: "The request was successfully removed." })

  }

}