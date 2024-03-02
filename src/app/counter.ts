import { getDb } from '../plugins/database';
import { ObjectId } from 'mongodb';

export class Counter {

  static async views(req: any, res: any) {

    const { collection, id } = req.body

    if (!id || !ObjectId.isValid(String(id))) {
      return res.status(404).send({  success: false, message: "Invalid id." })
    }

    const _id = new ObjectId(String(id))

    const filter = { _id: _id }
    const update = { $inc: { views: 1 } }

    try {

      await getDb().collection(collection).updateOne(filter, update)

    } catch (error) {
      console.error(error)
    }

  }

}