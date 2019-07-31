require('colors');
require('./mongoose');
const path = require('path');
const parameter = require('koa-parameter');
const error = require('koa-json-error');
const routers = require('../routers');
const koaBody = require('koa-body');
const static = require('koa-static');
const compress = require('koa-compress');
const logger = require('koa-logger');

module.exports = (app) => {
	// 参数验证
	app.use(parameter(app));
	// 友好的错误提示
	app.use(error({
		// rest 剩余部分
		postFormat: (e, { stack, ...rest }) => process.env.NODE_ENV === 'production' ? rest : { stack, ...rest }
	}));
	// body解析
	app.use(koaBody());
	// 静态资源服务
	app.use(static(path.join(__dirname, '../www')));
	// resphonse 压缩
	app.use(compress());
	// 请求记录
	app.use(logger());
	// 添加路由
	app.use(routers.routes());
}
