const { Schema, model } = require('mongoose')
const mongoose = require('mongoose')

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: 30,
  },

  description: {
    type: String,
    required: true,
    maxlength: 200,
  },
  terapiesfinding: {
    type: [String],
    required: true,
    maxlength: 200,
  },

  userId: { type: [mongoose.Schema.Types.ObjectId], ref: 'User' },
})

const PostModel = model('Post', PostSchema)

module.exports = PostModel
