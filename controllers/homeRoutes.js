const router = require('express').Router();
const { User, Post } = require('../models');

// A function that gets all of the data that is required for every page
const get_main_page_data = async (req) => {
  const logged_in = req.session.logged_in;

  let data = {
    logged_in,
  };

  if (logged_in) {
    let user_data = await User.findOne({ where: { id: req.session.user_id } })

    data["username"] = user_data.username;
    data["pop_count"] = user_data.pop_count;
  }

  return data
}

// Render the homepage
router.get('/', async (req, res) => {
  try {
    res.render('homepage', await get_main_page_data(req));

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// render the login page
router.get("/login", async (req, res) => {
  try {
    res.render('login', await get_main_page_data(req));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
})

//render the signup page
router.get("/signup", async (req, res) => {
  try {
    res.render('signup', await get_main_page_data(req));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
})

// render the dashboard page
router.get("/dashboard", async (req, res) => {
  try {
    let data = await get_main_page_data(req)

    if (!req.session.logged_in || !req.session.user_id) {
      return res.render('login', data);
    }

    console.log(req.session.user_id)

    data["posts"] = await Post.findAll({
      where: {author_id: req.session.user_id},
      raw: true,
      order: [['date', 'DESC']],
    })

    console.log(data["posts"])

    res.render('dashboard', data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
})

// render the update post page
router.get("/update/:id", async (req, res) => {
  try {
    let page_data = await get_main_page_data(req)

    let id = req.params.id;

    page_data["post"] = await Post.findOne({
      where : {
        id,
      },
      raw: true,
    });

    res.render('update', page_data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
})

module.exports = router;
