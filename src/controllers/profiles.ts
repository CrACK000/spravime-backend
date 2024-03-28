import { User } from '../models/user';
import mongoose from 'mongoose';

export class Profiles {

  static async view(req: any, res: any) {

    if (!req.params.id || !mongoose.Types.ObjectId.isValid(String(req.params.id))) {
      return res.status(404).send({  success: false, message: "Invalid id." })
    }

    const id = new mongoose.Types.ObjectId(String(req.params.id))
    const response = await User.findOne({ _id: id }).select('-password')

    if (!response) {
      return res.status(404).send({ success: false, message: "User not found." })
    }

    return res.status(200).send(response)

  }

}