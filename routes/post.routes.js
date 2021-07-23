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

      return res.status(200).json(post)
    } catch (err) {
      next(err)
    }
  },
)

//   router.delete(
//     '/message/:id',
//     isAuthenticated,
//     attachCurrentUser,
//     async (req, res, next) => {
//       try {
//         const { id } = req.params

//         const messageReceived = PostModel.findOne({ _id: id })

//         const { userId_received } = messageReceived

//         const message = await PostModel.deleteOne({
//           _id: id,
//         })
//         console.log(message)

//         const findmessage = await UserModel.findOneAndUpdate(
//           { _id: userId_received },
//           { $pull: { messengerID: id } },
//         )
//         console.log(findmessage)

//         return res.status(200).json(message)
//       } catch (err) {
//         next(err)
//       }
//     },
//   )

module.exports = router
