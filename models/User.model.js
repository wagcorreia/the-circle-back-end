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
  address: new Schema({
    street: String,
    neighbourhood: String,
    city: String,
    state: String,
    postalCode: String,
    number: String,
  }),

  CertificatesTerapies: [String],
  birthDate: { type: Date, required: true },
  phoneNumber: { type: String, trim: true },
  documentCPF: { type: String, required: true, trim: true },

  MessengerID: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },

  PostID: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
})

const UserModel = model('User', UserSchema)

module.exports = UserModel
