const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const saltRounds = 10
const PostModel = require('../models/Post.model')

const isAuthenticated = require('../middlewares/isAuthenticated')
const attachCurrentUser = require('../middlewares/attachCurrentUser')

router.post(
  '/post',
  isAuthenticated,
  attachCurrentUser,
  async (req, res, next) => {
    try {
      const { title, description, terapiesfinding, userId } = req.body

      const loggedInUser = req.currentUser

      const newPost = await PostModel.create({
        userId: loggedInUser._id,
        title: title,
        description: description,
        terapiesfinding: terapiesfinding,
      })
      console.log(newPost)

      await PostModel.findOneAndUpdate(
        { _id: userId },
        { $push: { postID: newPost._id } },
      )

      return res.status(201).json(newPost)
    } catch (err) {
      next(err)
    }
  },
)

router.get(
  '/post/:id',
  isAuthenticated,
  attachCurrentUser,
  async (req, res, next) => {
    try {
      const { id } = req.params

      const post = await PostModel.findOne({
        _id: id,
      })

      if (post) {
        return res.status(200).json(post)
      }
      return res.status(404).json({ error: 'post nâo encontrado' })
    } catch (err) {
      next(err)
    }
  },
)

router.delete(
  '/post/:id',
  isAuthenticated,
  attachCurrentUser,
  async (req, res, next) => {
    try {
      const { id } = req.params

      const post = await PostModel.deleteOne({
        _id: id,
      })
      console.log(post)

      if (post.n > 0) {
        return res.status(200).json({})
      }
      console.log(post)

      return res.status(200).json(post)
    } catch (err) {
      next(err)
    }
  },
)

module.exports = router
