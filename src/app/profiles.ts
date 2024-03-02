import { getDb } from '../plugins/database';
import { ObjectId } from 'mongodb';

export class Profiles {

  static async view(req: any, res: any) {

    if (!req.params.id || !ObjectId.isValid(String(req.params.id))) {
      return res.status(404).send({  success: false, message: "Invalid id." })
    }

    const id = new ObjectId(String(req.params.id))
    const response = await getDb().collection('users').findOne({ _id: id })

    if (!response) {
      return res.status(404).send({ success: false, message: "User not found." })
    }

    return res.status(200).send(response)

  }

}