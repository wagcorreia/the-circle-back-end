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
      const { messagebody } = req.body

      const loggedInUser = req.currentUser

      const lastInsertedMessage = await MessageModel.findOne(
        {},
        { messagebody: 1, _id: 0 },
        { sort: { messagebody: -1 }, limit: 1 },
      )

      const newMessage = await MessageModel.create({
        userId_sending: loggedInUser._id,
        messagebody: messagebody,
      })

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

module.exports = router
