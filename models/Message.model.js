const { Schema, model } = require('mongoose')
const mongoose = require('mongoose')

const MessageSchema = new Schema({
  messagebody: {
    type: String,
    required: true,
    maxlength: 512,
  },

  userId_received: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  userId_sending: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
})

const MessageModel = model('Message', MessageSchema)

module.exports = MessageModel
