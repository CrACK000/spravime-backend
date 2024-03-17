import mongoose from 'mongoose';
import { Report } from '../models/report';

export class Reports {

  static async create(req: any, res: any) {

    const { type, key, author, reason } = req.body

    if (!key || !mongoose.Types.ObjectId.isValid(String(key))) {
      return res.status(404).send({ success: false, message: "Invalid key." })
    }

    if (!author || !mongoose.Types.ObjectId.isValid(String(author))) {
      return res.status(404).send({ success: false, message: "Invalid author id." })
    }

    const result = new Report({ type, key, author, reason })
    await result.save()

    if (!result) {
      return res.status(500).send({ success: false, message: "Database has failed." })
    }

    return res.status(201).send({ success: true, message: "The message has been sent." })

  }

}