const express = require('express');
const router = express.Router();
const { User, Post, Comment } = require('../models');

// Render the homepage with recent posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [{ model: User, attributes: ['username'] }],
      order: [['createdAt', 'DESC']],
    });
    res.render('homepage', { posts, user: req.session.user });
  } catch (err) {
    console.error(err);
    res.render('homepage', { error: 'An error occurred. Please try again.' });
  }
});


// Render a blog post with its comments
router.get('/blog/:id', async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await Post.findByPk(postId, {
      include: [
        { model: User, attributes: ['username'] },
        { model: Comment, include: [{ model: User, attributes: ['username'] }] },
      ],
    });
    if (!post) {
      return res.render('blogpost', { error: 'Post not found.' });
    }
    res.render('blogpost', { post, comments: post.comments, user: req.session.user });
  } catch (err) {
    console.error(err);
    res.render('blogpost', { error: 'An error occurred. Please try again.' });
  }
});


// Handle comment form submission
router.post('/blog/:id/comment', async (req, res) => {
  const postId = req.params.id;
  const { content } = req.body;
  try {
    // Create a new comment in the database
    await Comment.create({ content, userId: req.session.user.id, postId });
    res.redirect(`/blog/${postId}`);
  } catch (err) {
    console.error(err);
    res.render('blogpost', { error: 'An error occurred. Please try again.' });
  }
});


// Render the dashboard with user's posts
router.get('/dashboard', async (req, res) => {
  try {
    // const posts = await Post.findAll({
    //   where: { userId: req.session.user.id },
    //   include: [{ model: User, attributes: ['username'] }],
    //   order: [['createdAt', 'DESC']],
    // });

    const posts = await Post.findAll(); // Fetch all posts from the database

    // console.log("Posts fetched:", posts);

    // Example query to fetch posts
    // Post.findAll({
    //     where: { userId:  req.session.user.id  },
    //     order: [["createdAt", "DESC"]],
    //   })
    //     .then((posts) => {
    //       console.log("Posts:", posts); // Log the fetched posts to check if they are retrieved correctly
    //       res.render("dashboard", { user: req.user, posts: posts });
    //     })
    //     .catch((err) => {
    //       console.error("Error fetching posts:", err);
    //       res.render("dashboard", { user: req.user, posts: [] }); // Render an empty array if there is an error
    //     });
    res.render('dashboard', { posts: posts , user: req.user });
  } catch (err) {
    console.error(err);
    res.render('dashboard', { error: 'An error occurred. Please try again.', user: req.session.user });
  }
});

// Render the "New Post" form
router.get('/dashboard/new', (req, res) => {
  res.render('newpost', { user: req.session.user });
});

// Handle the "New Post" form submission
router.post('/dashboard/new', async (req, res) => {
  const { title, content } = req.body;
  try {
    // Create a new post in the database
    await Post.create({ title, content, userId: req.session.user.id });
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('newpost', { error: 'An error occurred. Please try again.', user: req.session.user });
  }
});

// Render the "Edit Post" form
router.get('/dashboard/edit/:id', async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await Post.findByPk(postId);
    if (!post || post.userId !== req.session.user.id) {
      return res.redirect('/dashboard');
    }
    res.render('editpost', { post, user: req.session.user });
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
});

// Handle the "Edit Post" form submission
router.post('/dashboard/edit/:id', async (req, res) => {
  const postId = req.params.id;
  const { title, content } = req.body;
  try {
    // Update the post in the database
    const post = await Post.findByPk(postId);
    if (!post || post.userId !== req.session.user.id) {
      return res.redirect('/dashboard');
    }
    await post.update({ title, content });
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
});

// Handle post deletion
router.get('/dashboard/delete/:id', async (req, res) => {
  const postId = req.params.id;
  try {
    // Find the post in the database
    const post = await Post.findByPk(postId);
    if (!post || post.userId !== req.session.user.id) {
      return res.redirect('/dashboard');
    }
    // Delete the post
    await post.destroy();
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
});


  module.exports = router;
