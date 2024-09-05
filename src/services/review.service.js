import ReviewModel from "../models/review.model.js";

class ReviewService {
  // create new review
  async createReview(review) {
    const newReview = await ReviewModel.create(review);
    return newReview;
  }

  // retrieve all reviews
  async getReviews(query) {
    const reviews = await ReviewModel.find(query).populate("userId", "imageUrl name role");
    return reviews;
  }

  // retrieve one review
  async getOneReview(query) {
    const review = await ReviewModel
      .findOne(query)
      .populate("userId", "imageUrl name role");
    return review;
  }

  // update a review by id
  async updateReview(query, data) {
    const updatedReview = await ReviewModel.findOneAndUpdate(query, data, {
      new: true,
    });
    return updatedReview;
  }

  // delete user by id
  async delReview(query) {
    const deletedReview = await ReviewModel.findOneAndDelete(query);
    return deletedReview;
  }
}

export default new ReviewService();