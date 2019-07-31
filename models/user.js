const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
	__v: { type: String, select: false },
	name: { type: String, required: true },
	password: { type: String, required: true, select: false }
});

module.exports = model('user', UserSchema);
