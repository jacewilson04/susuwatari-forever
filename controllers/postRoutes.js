const router = require('express').Router();
const { Post } = require('../models');

router.get('/:id', async (req, res) => {
    let id = req.params.id;
    
    let post = await Post.findOne({
        where: {
            id,
        },
    });

    res.render('homepage');
})

module.exports = router;