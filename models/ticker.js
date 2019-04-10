const Joi = require('joi');
const mongoose = require('mongoose');

const Ticker = mongoose.model('Tickers', new mongoose.Schema({
  ticker: {
    type: String,
    required: true,
    trim: true, 
    maxlength: 10
  },
  price: { 
    type: Number, 
    required: true,
    min: -5000,
    max: 255
  },
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  linkedID: {
    type: String
  }
}));

// Ticker.pre('save', function preSave(next){
//   var something = this;
//   something.updatedAt(Date.now());
//   next();
// });

function validateTicker(ticker) {
  const schema = {
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required()
  };

  return Joi.validate(ticker, schema);
}

exports.Ticker = Ticker; 
exports.validate = validateTicker;