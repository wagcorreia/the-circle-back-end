const { Schema, model } = require('mongoose')
const mongoose = require('mongoose')

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 30,
    maxlength: 30,
  },

  description: {
    type: String,
    required: true,
    minlength: 60,
    maxlength: 60,
  },
  terapiesfinding: {
    type: [String],
    required: true,
    minlength: 60,
    maxlength: 60,
  },

  UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
})

const PostModel = model('Post', PostSchema)

module.exports = PostModel
