import { User } from './models/users';

export class Accounts {

  static async accounts(req: any, res: any) {

    const response = await User
      .find(
        { "profile.type": { $in: ['company', 'worker'] } },
        { password: 0 }
      )
      .sort({ average_rating: -1 })

    if (response) {
      return res.status(200).send(response)
    } else {
      return res.status(404).send({ message: "User not found." })
    }

  }

}