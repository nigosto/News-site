const router = require('express').Router();
const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin')

router.post('/category/create',isAdmin,feedController.createCategory )
router.post('/category/rename/:id',isAdmin,feedController.categoryRename)
router.post('/category/delete/:id',isAdmin,feedController.deleteCategory)
router.get('/category/articles/:name', feedController.getArticlesByCategory)
router.get('/category/all', feedController.getCategories)
router.post('/article/create',isAuth , feedController.articleCreate)
router.get('/article/all', feedController.articleGet)
router.get('/comment/create', isAuth, feedController.addComment)
router.get('/article/:id',  feedController.getArticle)
router.post('/article/approve/:id', isAdmin,feedController.approveArticle)
router.post('/article/remove/:id', isAuth, feedController.deleteArticle)
router.post('/article/edit/:id', isAuth, feedController.editArticle)
router.get('/user/profile/:username', isAuth, feedController.getProfile)
router.post('/comment/add', isAuth, feedController.addComment)

module.exports = router;