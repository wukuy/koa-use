const { secret } = require('../config');
const JWT = require('koa-jwt');

module.exports = JWT({ secret });
