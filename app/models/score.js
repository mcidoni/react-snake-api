const mongoose = require('mongoose')

const scoreSchema = new mongoose.Schema({
  score: {
    type: Number
  }
  // owner: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true
  // }
}, {
  timestamps: true
})

module.exports = mongoose.model('Score', ScoreSchema)
