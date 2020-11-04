const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

// Define `ApoyoToken` Schema
const ApoyoToken = new mongoose.Schema({
  email: { type: String },
  nombreApellido: { type: String },
  token: { type: String },
}, { timestamps: true })

// Model's Plugin Extensions
ApoyoToken.plugin(mongoosePaginate)

// Expose Model
module.exports = mongoose.model('ApoyoToken', ApoyoToken)
