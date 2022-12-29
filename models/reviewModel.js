const mongoose = require('mongoose');
const Tour = require('./tourModels');

const reveiwSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty.'],
      // maxlength: 100,
    },
    rating: {
      type: Number,
      min: [1, 'Min rating must be 1'],
      max: [5, 'Max rating must be 5'],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a Tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a User'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reveiwSchema.pre(/^find/, function (next) {
  // this.populate({ path: 'tour', select: 'name' }).populate({
  //   path: 'user',
  //   select: 'name photo',
  // });

  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

reveiwSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  // console.log(stats);

  if (stats.length > 0)
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  else
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
};

reveiwSchema.index({ tour: 1, user: 1 }, { unique: true });

reveiwSchema.post('save', async (docs, next) => {
  await docs.constructor.calcAverageRatings(docs.tour);
  next();
});

// reveiwSchema.pre(/^findOneAnd/, async function (next) {
//   const r = await this.findOne();
//   next();
//   // console.log(r);
// });

reveiwSchema.post(/^findOneAnd/, async (doc, next) => {
  await doc.constructor.calcAverageRatings(doc.tour);
});

const Review = mongoose.model('Review', reveiwSchema);

module.exports = Review;
