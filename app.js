const koa = require('koa');
const app = new koa();
const config = require('./config');
const init = require('./utils/init');

init(app);

app.listen(config.appPort, () => {
	console.log('server run at: ' + `http://localhost:${config.appPort}`.green.bold);
});
