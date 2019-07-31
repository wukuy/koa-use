const User = require('../models/user');
const jsonwebtoken = require('jsonwebtoken');
const { secret } = require('../config');

class UserCtrl {
	async find(ctx) {
		ctx.body = await User.find();
	}
	async create(ctx) {
		ctx.verifyParams({
			name: 'string',
			password: 'string'
		});
		let { name } = ctx.request.body;
		const user = await User.findOne({ name });

		if (user) {
			ctx.throw(403, '用户名称已存在!');
		} else {
			ctx.body = await new User(ctx.request.body).save();
		}
	}
	async delete(ctx) {
		let user = await User.findByIdAndDelete(ctx.params.id);
		if (!user) ctx.throw(404, '用户不存在!');
		ctx.status = 204;
	}
	async update(ctx) {
		ctx.verifyParams({
			name: 'string',
			password: 'string'
		});

		let user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body);
		if (!user) ctx.throw(404, '用户不存在!');
		ctx.body = user;
	}
	async findById(ctx) {
		let user = await User.findById(ctx.params.id);
		if (!user) ctx.throw(404, '用户不存在!');
		ctx.body = user;
	}
	async login(ctx) {
		let user = await User.findOne(ctx.request.body);
		if (!user) ctx.throw(401, '账号或密码错误');
		// expiresIn 有效时间 1天
		let { name, password } = user;
		let token = jsonwebtoken.sign({ name, password }, secret, { expiresIn: '1d' });
		ctx.body = { token };
	}
}

module.exports = new UserCtrl();
