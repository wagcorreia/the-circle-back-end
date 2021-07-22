const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const saltRounds = 10

const UserModel = require('../models/User.model')
const MessageModel = require('../models/Message.model')

const isAuthenticated = require('../middlewares/isAuthenticated')
const attachCurrentUser = require('../middlewares/attachCurrentUser')

router.post(
  '/message',
  isAuthenticated,
  attachCurrentUser,
  async (req, res, next) => {
    try {
      const { messagebody, userId_received } = req.body

      const loggedInUser = req.currentUser

      const newMessage = await MessageModel.create({
        userId_sending: loggedInUser._id,
        messagebody: messagebody,
        userId_received,
      })
      await UserModel.findOneAndUpdate(
        { _id: userId_received },
        { $push: { messengerID: newMessage._id } },
      )

      return res.status(201).json(newMessage)
    } catch (err) {
      next(err)
    }
  },
)

router.get(
  '/message/:id',
  isAuthenticated,
  attachCurrentUser,
  async (req, res, next) => {
    try {
      const { id } = req.params

      const message = await MessageModel.findOne({
        _id: id,
      })

      return res.status(200).json(message)
    } catch (err) {
      next(err)
    }
  },
)

router.delete(
  '/message/:id',
  isAuthenticated,
  attachCurrentUser,
  async (req, res, next) => {
    try {
      const { id } = req.params

      const messageReceived = MessageModel.findOne({ _id: id })

      const { userId_received } = messageReceived

      const message = await MessageModel.deleteOne({
        _id: id,
      })

      await UserModel.findOneAndUpdate(
        { _id: userId_received },
        { $pull: { messengerID: id } },
      )

      return res.status(200).json(message)
    } catch (err) {
      next(err)
    }
  },
)

module.exports = router
