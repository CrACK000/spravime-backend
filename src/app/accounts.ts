import { getDb } from '../plugins/database';

export class Accounts {

  static async accounts(req: any, res: any) {

    const response = await getDb()
      .collection('users')
      .find(
        { type: { $in: ['company', 'worker'] } },
        { projection: { password: 0 } }
      )
      .sort({ average_rating: -1 })
      .toArray()

    if (response) {
      res.status(200).json(response)
    } else {
      res.status(404).json({ message: "User not found" })
    }

  }

}