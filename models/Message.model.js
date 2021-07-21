const { Schema, model } = require('mongoose')
const mongoose = require('mongoose')

const MessageSchema = new Schema({
  Messagebody: {
    type: String,
    required: true,
    minlength: 512,
    maxlength: 512,
  },

  UserId_received: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  UserId_sending: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
})

const MessageModel = model('Message', MessageSchema)

module.exports = MessageModel
