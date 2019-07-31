const KoaRouter = require('koa-router');
const router = new KoaRouter({ prefix: '/config' });
const {
	find,
	create,
	delete: del,
	update,
	findById
} = require('../controllers/configs');

router.get('/', find);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', del);
router.get('/:id', findById);

module.exports = router.routes();
