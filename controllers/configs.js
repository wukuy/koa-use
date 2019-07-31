const Config = require('../models/config');

class ConfigCtrl {
	async find(ctx) {
		ctx.body = await Config.find();
	}
	async create(ctx) {
		ctx.verifyParams({
			name: 'string',
			git_url: 'string'
		});
		let { name } = ctx.request.body;
		const config = await Config.findOne({ name });
		if (config) {
			ctx.throw(403, '配置名称已存在!');
		} else {
			ctx.body = await new Config(ctx.request.body).save();
		}
	}
	async delete(ctx) {
		let config = await Config.findByIdAndDelete(ctx.params.id);
		if (!config) ctx.throw(404, '配置不存在!');
		ctx.status = 204;
	}
	async update(ctx) {
		ctx.verifyParams({
			name: 'string',
			git_url: 'string'
		});

		let config = await Config.findByIdAndUpdate(ctx.params.id, ctx.request.body);
		if (!config) ctx.throw(404, '配置不存在!');
		ctx.body = config;
	}
	async findById(ctx) {
		let config = await Config.findById(ctx.params.id);
		if (!config) ctx.throw(404, '配置不存在!');
		ctx.body = config;
	}
}

module.exports = new ConfigCtrl();
