const KoaRouter = require('koa-router');
const router = new KoaRouter({ prefix: '/user' });
const {
	find,
	create,
	delete: del,
	update,
	findById,
	login
} = require('../controllers/users');
const auth = require('../middleware/auth');

router.get('/', find);
router.post('/', create);
router.put('/:id', auth, update);
router.delete('/:id', auth, del);
router.get('/:id', auth, findById);
router.post('/login', login);

module.exports = router.routes();
