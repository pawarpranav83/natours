const Review = require('../models/reviewModel');
// const APIFeatures = require('../utils/apiFeatures');
// const AppError = require('../utils/appError');
// const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

// catchAsync(async (req, res, next) => {
//   let tourIdFilter = {};

//   if (req.params.tourId) tourIdFilter = { tour: req.params.tourId };

//   const reviews = await Review.find(tourIdFilter);

//   res.status(200).json({
//     status: 'success',
//     data: {
//       reviews,
//     },
//   });
// });

exports.setTourUserIds = (req, res, next) => {
  // ALlow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// exports.createReview = catchAsync(async (req, res, next) => {
//   const review = await Review.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: {
//       review,
//     },
//   });
// });
exports.getAllReviews = factory.getAll(Review);
exports.createReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.getReview = factory.getOne(Review);
