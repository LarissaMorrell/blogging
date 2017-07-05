const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const mongoose = require('mongoose');

// Mongoose internally uses a promise-like object,
// but its better to make Mongoose use built in es6 promises
mongoose.Promise = global.Promise;

const { BlogPost } = require('./models');


router.get('/', (req, res) => {
    // return res.json(BlogPost.get());
    const filters = {};
    const queryableFields = ['title', 'content', 'author', 'publishDate'];
    queryableFields.forEach(field => {
        if (req.query[field]) {
            filters[field] = req.query[field];
        }
    });
    BlogPost
        .find(filters)
        .exec()
        .then(BlogPosts => res.json(
            BlogPosts.map(blogPost => blogPost.apiRepr())
        ))
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' })
        });
});

router.get('/:id', (req, res) => {
    BlogPost
        .findById(req.params.id)
        .exec()
        .then(blogPost => res.json(blogPost.apiRepr()))
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' })
        })
})


router.post('/', (req, res) => {

    const requiredFields = ['title', 'content', 'author'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        console.log('\n\n\n\n\n\n\n\nreq.body:\n', req.body);
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }

    BlogPost
        .create({
            "title": req.body.title,
            "content": req.body.content,
            "author": req.body.author})
        .then(blogPost => res.status(201).json(blogPost.apiRepr()))
        .catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal server error'});
        });
})

// router.post('/', jsonParser, (req, res) => {
//     const requiredFields = ['title', 'content', 'author'];

//     //check that all of the required fields are present
//     for (let i = 0; i < requiredFields.length; i++) {
//         const field = requiredFields[i];
//         if (!(field in req.body)) {
//             const message = `Missing \`${field}\` in request body`;
//             console.error(message);
//             return res.status(400).send(message);
//         }
//     }
//     //If we got here, then it's okay to create
//     const blogPost = BlogPost.create(req.body.title, req.body.content, req.body.author);
//     return res.status(201).json(blogPost);
// });




// router.delete('/:id', (req, res) => {
//     const deletedPost = BlogPost.delete(req.params.id);
//     //if there is no deleted post... undefined, null, "", 0, nan
//     if (!deletedPost) {
//         const message = `Failed to delete blog post with id \`${req.params.id}\``;
//         return res.status(400).send(message);
//     }
//     const message = `Deleted blog post id \`${req.params.id}\``;
//     return res.status(202).send(message);
// });



// router.put('/:id', jsonParser, (req, res) => {
//     const requiredFields = ['title', 'content', 'author'];

//     //check that all of the required fields are present
//     for (let i = 0; i < requiredFields.length; i++) {
//         const field = requiredFields[i];
//         if (!(field in req.body)) {
//             const message = `Missing \`${field}\` in request body`;
//             console.error(message);
//             return res.status(400).send(message);
//         }
//     }

//     //check that IDs match
//     if (req.params.id !== req.body.id) {
//         const message = `Request path id \`${req.params.id}\` and request body id \`
//      ${req.body.id}\` must match`;
//         console.error(message);
//         return res.status(400).send(message);
//     }

//     //if we got this far, it's ok to update
//     console.log(`Updating blog post \`${req.params.id}\``);
//     const updatedPost = BlogPost.update({
//         id: req.params.id,
//         title: req.body.title,
//         content: req.body.content,
//         author: req.body.author,
//         publishDate: req.body.publishDate || new Date()
//     })
//     return res.status(200).json(updatedPost);
// });





module.exports = router;
