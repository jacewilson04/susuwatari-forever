const User = require('./User');
const Post = require('./Post');

// Why is this so weird!!!!
Post.belongsTo(User, {
    as: 'author',
})

User.hasMany(Post)

module.exports = { Post, User };