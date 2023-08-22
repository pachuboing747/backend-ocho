const { Schema, model } = require('mongoose')

const schema = new Schema({
  firstname: String,
  lastname: { type: String, index: true },
  email: String,
  password: String,
  role: String,
  gender: String,
  isAdmin: { type: Boolean, default: false }
})

const userModel = model('users', schema)

module.exports = userModel