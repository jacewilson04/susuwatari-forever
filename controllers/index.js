const router = require('express').Router();

const homeRoutes = require('./homeRoutes');
const apiRoutes = require('./api');
const postRoutes = require('./postRoutes');

router.use('/', homeRoutes);
router.use('/api', apiRoutes);
router.use('/posts', postRoutes);


module.exports = router;