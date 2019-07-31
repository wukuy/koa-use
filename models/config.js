const { model, Schema } = require('mongoose');

const configSchema = new Schema({
	__v: { type: String, select: false },
	// 项目名称
	name: { type: String, required: true },
	// git项目地址
	git_url: { type: String, required: true }
});

module.exports = model('Config', configSchema);
