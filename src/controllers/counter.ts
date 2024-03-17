import mongoose from 'mongoose'

export class Counter {

  static async views(req: any, res: any) {

    const { collection, id } = req.body

    if (!id || !mongoose.Types.ObjectId.isValid(String(id))) {
      return res.status(404).send({  success: false, message: "Invalid id." })
    }

    const _id = new mongoose.Types.ObjectId(String(id))

    const filter = { _id: _id }
    const update = { $inc: { views: 1 } }

    try {

      await mongoose.connection.collection(collection).updateOne(filter, update)

    } catch (error) {
      console.error(error)
    }

  }

}