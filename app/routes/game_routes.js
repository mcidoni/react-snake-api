const express = require('express')

const passport = require('passport')

const Score = require('../models/score')

const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

const removeBlanks = require('../../lib/remove_blank_fields')
const score = require('../models/score')

const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// INDEX
// GET /scores
router.get('/scores', requireToken, (req, res, next) => {
  Scores.find()
    .then(scores => {
      return scores.map(scores => scores.toObject())
    })
    .then(scores => res.status(200).json({ scores: scores }))
    .catch(next)
})

// SHOW
router.get('/scores/:id', requireToken, (req, res, next) => {
  scores.findById(req.params.id)
    .then(handle404)
    .then(scores => res.status(200).json({ scores: scores.toObject() }))
    .catch(next)
})

// CREATE
// POST /scores
router.post('/scores', (req, res, next) => {
  // req.body.purchase.owner = req.user.id

  Score.create(req.body.score)
    .then(score => {
      res.status(201).json({ score: score.toObject() })
    })
    .catch(next)
})


// UPDATE
router.patch('/scores/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.score.owner

  Score.findById(req.params.id)
    .then(handle404)
    .then(score => {
      requireOwnership(req, score)

      return score.updateOne(req.body.score)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DESTROY
// DELETE /scores/5a7db6c74d55bc51bdf39793
router.delete('/scores/:id', requireToken, (req, res, next) => {
  Score.findById(req.params.id)
    .then(handle404)
    .then(score => {
      // throw an error if current user doesn't own `score`
      requireOwnership(req, score)
      // delete the score ONLY IF the above didn't throw
      score.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
