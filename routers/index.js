const fs = require('fs');
const Router = require('koa-router');
const router = new Router({ prefix: '/api' });

fs.readdirSync(__dirname).forEach(fileName => {
	if (fileName !== 'index.js') {
		router.use(require(`./${fileName}`));
	}
});

module.exports = router;
