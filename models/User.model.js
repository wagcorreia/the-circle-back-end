const { Schema, model } = require('mongoose')
const mongoose = require('mongoose')

const UserSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  passwordHash: { type: String, required: true },
  occupation: { type: String, required: true },
  location: { type: String },

  certificatesTerapies: [String],
  age: { type: Number, required: true },
  phoneNumber: { type: String, trim: true },

  messengerID: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],

  postID: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
})

const UserModel = model('User', UserSchema)

module.exports = UserModel
