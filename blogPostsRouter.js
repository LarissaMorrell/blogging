const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { BlogPosts } = require('./models');

BlogPosts.create(
    'My First Blog Post',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    'Jane Doe',
    new Date('October 31, 2015')
);
BlogPosts.create(
    'A Second Post',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    'Frank Lee',
    new Date('November 11, 2001')
);
BlogPosts.create(
    'The Last Blog Post',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    'Tom Cat'
);


router.get('/', (req, res) => {
    return res.json(BlogPosts.get());
});




router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author'];

    //check that all of the required fields are present
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
    //If we got here, then it's okay to create
    const blogPost = BlogPosts.create(req.body.title, req.body.content, req.body.author);
    return res.status(201).json(blogPost);
});




router.delete('/:id', (req, res) => {
    const deletedPost = BlogPosts.delete(req.params.id);
    //if there is no deleted post... undefined, null, "", 0, nan
    if (!deletedPost) {
        const message = `Failed to delete blog post with id \`${req.params.id}\``;
        return res.status(400).send(message);
    }
    const message = `Deleted blog post id \`${req.params.id}\``;
    return res.status(202).send(message);
});



router.put('/:id', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author'];

    //check that all of the required fields are present
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

    //check that IDs match
    if (req.params.id !== req.body.id) {
        const message = `Request path id \`${req.params.id}\` and request body id \`
		${req.body.id}\` must match`;
        console.error(message);
        return res.status(400).send(message);
    }

    //if we got this far, it's ok to update
    console.log(`Updating blog post \`${req.params.id}\``);
    const updatedPost = BlogPosts.update({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        publishDate: req.body.date || new Date()
    })
    return res.status(200).json(updatedPost);
});





module.exports = router;
