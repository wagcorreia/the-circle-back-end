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
      console.log(newMessage)

      const updateddeletedMessage = await UserModel.findOneAndUpdate(
        { _id: userId_received },
        { $push: { messengerID: newMessage._id } },
      )

      if (updateddeletedMessage) {
        return res.status(200).json(updateddeletedMessage)
      }

      return res.status(201).json(updateddeletedMessage)
    } catch (err) {
      next(err)
    }
  },
)
// busca uma mensagem especifica
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
      //buscar a menssagem
      const messageReceived = await MessageModel.findOne({ _id: id })

      const { userId_received } = messageReceived
      // Deletar menssagem do banco
      const message = await MessageModel.deleteOne({
        _id: id,
      })
      if (message.n > 0) {
        const updatedeteledmessage = await UserModel.findOneAndUpdate(
          { _id: messageReceived.userId_received },
          { $pull: { messengerID: id } },
          { new: true },
        )
        if (updatedeteledmessage) {
          return res.status(200).json({})
        }
        return res.status(404).json({ error: 'Messagem não encontrada' })
      }
    } catch (err) {
      next(err)
    }
  },
)

module.exports = router
