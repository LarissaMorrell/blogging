const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

BlogPosts.create(
	'My First Blog Post', 
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
	'Jane Doe',
	'October 31, 2015'
);
BlogPosts.create(
	'A Second Post', 
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
	'Frank Lee',
	'November 11, 2001'
);
BlogPosts.create(
	'The Last Blog Post', 
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
	'Tom Cat'
);


router.get('/', (req, res) => {
	res.json(BlogPosts.get());
});




router.post('/', jsonParser, (req, res) => {
const requiredFields = ['title', 'content', 'author'];

	//check that all of the required fields are present
	for (let i = 0; i < requiredFields.length; i++){
		const field = requiredFields[i];
		if(!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}
	//If we got here, then it's okay to create
	const blogPost = BlogPosts.create(req.body.title, req.body.content, req.body.author);
	res.status(201).json(blogPost);
});




router.delete('/:id', (req, res) => {
	BlogPosts.delete(req.params.id);
	console.log(`Deleted blog post id \`${req.params.ID}\``);
	res.status(204).end();
});



router.put('/:id', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author'];

	//check that all of the required fields are present
	for (let i = 0; i < requiredFields.length; i++){
		const field = requiredFields[i];
		if(!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}

	//check that IDs match
	if(req.params.id !== req.body.id){
		const message = `Request path id \`${req.params.id}\` and request body id \`
      			${req.body.id}\` must match`;
		console.error(message);
		return res.statuse(400).send(message);
	}

	//if we got this far, it's ok to update
	console.log(`Updating blog post \`${req.params.id}\``);
	BlogPosts.update({
		id: req.params.id,
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		date: req.body.date || Date.now()
	});
	res.status(204).end();
});





module.exports = router;