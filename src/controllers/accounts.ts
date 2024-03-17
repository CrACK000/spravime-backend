import { User } from '../models/user';

export class Accounts {

  static async accounts(req: any, res: any) {

    const response = await User
      .find(
        { "profile.type": { $in: ['company', 'worker'] } },
        {
          _id: 1,
          username: 1,
          verify: 1,
          avatar: 1,
          'profile.name': 1,
          'profile.type': 1,
          'profile.slogan': 1,
          'profile.sections': 1,
          'profile.address': 1,
          'reviews.average_rating': 1,
          'reviews.count_reviews': 1,
        }
      )
      .sort({ average_rating: -1 })

    if (response) {
      return res.status(200).send(response)
    } else {
      return res.status(404).send({ message: "User not found." })
    }

  }

}