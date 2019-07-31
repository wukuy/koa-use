const koa = require('koa');
const app = new koa();
const config = require('./config');
const init = require('./utils/init');

init(app);

app.listen(config.port, () => {
	console.log('server run at: ' + `http://localhost:${config.port}`.green.bold);
});
