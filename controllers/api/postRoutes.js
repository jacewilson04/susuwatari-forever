const router = require('express').Router();
const { Post } = require('../../models');


router.get('/get-amount/:amount', async (req, res) => {
    const limit = Number(req.params.amount);

    let post = await Post.findAll({
        attributes: ['id'],
        limit,
    });

    res.status(200).json(post);
})

router.get('/:id', async (req, res) => {
    console.log("AGHHH");
    let id = req.params.id;
    
    let post = await Post.findOne({
        where: {
            id,
        },
    });

    console.log(post);

    res.render("post");
})

module.exports = router;