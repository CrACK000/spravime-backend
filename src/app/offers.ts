import { getDb } from '../plugins/database';
import { ObjectId } from 'mongodb';

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

}