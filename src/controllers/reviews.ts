import { Review } from '../models/review'
import mongoose from 'mongoose'
import { User } from '../models/user'

export class Reviews {

  static async create(req: any, res: any) {

    const { profile_id, star, recommendation, description } = req.body

    if (!profile_id || !mongoose.Types.ObjectId.isValid(String(profile_id))) {
      return res.send({ success: false, message: "Invalid key." })
    }

    const author = new mongoose.Types.ObjectId(String(req.user._id))
    const key = new mongoose.Types.ObjectId(String(profile_id))

    const result = new Review({
      author: author,
      key: key,
      rating: star,
      recommendation: recommendation,
      description: description
    })

    let savedReview = await result.save()

    savedReview = await Review.populate(savedReview, {
      path: 'author',
      select: 'username avatar verify profile.name'
    })

    const userData = await Review.find({ key: key })
    const count_reviews = Number(userData.length)
    let average_rating = 0
    if (count_reviews > 0) {
      average_rating = userData.reduce((sum, r) => sum + r.rating, 0) / count_reviews
    }

    await User.findByIdAndUpdate(
      { _id: key },
      { 'reviews.count_reviews': count_reviews, 'reviews.average_rating': average_rating }
    )

    if (!savedReview) {
      return res.send({ success: false, message: "Database has failed." })
    }

    return res.send({ success: true, message: "Review is created.", review: savedReview })

  }

  static async all(req: any, res: any) {

    const key = new mongoose.Types.ObjectId(String(req.params.key))
    const response = await Review.find({ key: key }).populate({
      path: 'author',
      select: 'username avatar verify profile.name'
    })
    return res.status(200).send(response)

  }

  static async edit(req: any, res: any) {

    const { review_id, description } = req.body

    if (!review_id || !mongoose.Types.ObjectId.isValid(String(review_id))) {
      return res.send({ success: false, message: "Invalid review ID." })
    }

    const _id = new mongoose.Types.ObjectId(String(review_id))
    const reviewToUpdate = await Review.findById(_id)

    if(!reviewToUpdate) {
      return res.send({ success: false, message: "Review not found." })
    }

    const updatedReview = await Review.findByIdAndUpdate(_id, {
      description: description
    })

    if (!updatedReview) {
      return res.send({ success: false, message: "Review update failed." })
    }

    const userData = await Review.find({ key: reviewToUpdate.key })

    const count_reviews = Number(userData.length)
    let average_rating = 0

    if (count_reviews > 0) {
      average_rating = userData.reduce((sum, r) => sum + r.rating, 0) / count_reviews
    }

    await User.findByIdAndUpdate(
      { _id: reviewToUpdate.key },
      { 'reviews.count_reviews': count_reviews, 'reviews.average_rating': average_rating }
    )

    return res.send({ success: true, message: "Review updated." })
  }

  static async remove(req: any, res: any) {

    const { review_id } = req.body

    if (!review_id || !mongoose.Types.ObjectId.isValid(String(review_id))) {
      return res.status(404).send({ success: false, message: "Invalid review ID." })
    }

    const _id = new mongoose.Types.ObjectId(String(review_id))
    const reviewToDelete = await Review.findById(_id)

    if(!reviewToDelete) {
      return res.status(404).send({ success: false, message: "Review not found." });
    }

    await Review.findByIdAndDelete(_id)

    // After deletion, we update the User review counts and average rating:
    const userData = await Review.find({ key: reviewToDelete.key })
    const count_reviews = Number(userData.length)
    let average_rating = 0

    if (count_reviews > 0) {
      average_rating = userData.reduce((sum, r) => sum + r.rating, 0) / count_reviews
    }

    await User.findByIdAndUpdate(
      { _id: reviewToDelete.key },
      { 'reviews.count_reviews': count_reviews, 'reviews.average_rating': average_rating }
    )

    return res.status(200).send({ success: true, message: "Review deleted." })
  }

}