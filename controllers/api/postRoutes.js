const router = require('express').Router();
const { User, Post } = require('../../models');

router.get('/get-amount/:amount', async (req, res) => {
    const limit = Number(req.params.amount);

    let all_posts = await Post.findAll({
        attributes: ['id'],
        limit,
        order: [['date', 'DESC']],
    });

    res.status(200).json(all_posts);
})

router.get('/:id', async (req, res) => {
    let id = req.params.id;
    
    let post = await Post.findOne({
        where: {
            id,
        },
        include: [{ model: User, as: 'author'}]
    });

    res.status(200).json(post);

    // Incremeant pop count
    if (req.session.logged_in) {
        User.increment('pop_count', {
            where: {
                id: req.session.user_id,
            }
        })
    }
})

router.put('/:id', async (req, res) => {
    try {
        if (!req.session.logged_in) {
            return res.status(404).json({message: "Log in first!"});
        }
    
        let id = req.params.id;
        const {title, content} = req.body;
    
        // This is so an user can only update their own posts
        const author_id = req.session.user_id;
    
        Post.update({ title, content }, {
            where: {
                id,
                author_id
            }
        })

        console.log("Test")

        res.status(200).end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.delete('/:id', async (req, res) => {
    try {
        if (!req.session.logged_in) {
            return res.status(404).json({message: "Log in first!"});
        }

        let id = req.params.id;

        // This is so an user can only delete their own posts
        const author_id = req.session.user_id;

        Post.destroy({
            where: {
                id,
                author_id,
            }
        })

        res.status(200).end();

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.post('/', async (req, res) => {
    try {
        const {title, content} = req.body;
        const author_id = req.session.user_id;

        if(!title || !author_id){
            return res.status(400).json({message: 'Invalid paramaters' });
        }

        const newTask = await Post.create({
            title,
            content,
            author_id,
        });

        console.log(newTask)

        res.status(200).end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = router;