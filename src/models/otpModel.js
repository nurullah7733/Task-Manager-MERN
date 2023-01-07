const mongoose = require('mongoose')

const OtpSchema = mongoose.Schema({
	email: String,
	otp: String,
	status: {type: Number, default: 0},
	createdDate: {type: Date, default: Date.now()}
})

const OtpModel = mongoose.model('otps', OtpSchema)
module.exports =  OtpModel;