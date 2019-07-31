const mongoose = require('mongoose');
const config = require('../config');

mongoose.connect(config.mongoUrl, (err) => {
	if (err) {
		console.log('mongo error:'.red, err);
	} else {
		console.log('mongo数据库连接成功'.green);
	}
});

