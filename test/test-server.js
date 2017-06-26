const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');
const should = chai.should();

chai.use(chaiHttp);

describe('Blog Posts', function() {
    before(function() {
        return runServer();
    });

    after(function() {
        return closeServer();
    });

    it('should list blog entries on GET', function() {

        return chai.request(app)
            .get('/blog-posts')
            .then(function(res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.length.should.be.above(0);
                res.body.forEach(function(item) {
                    item.should.be.a('object');
                    item.should.have.all.keys('title', 'content', 'author', 'id', 'publishDate');
                });
            })
    })


    it('should create a new blog entry on POST', function() {
        const newBlogPost = {
            title: 'test blog title',
            content: 'this is a very short paragraph',
            author: 'joe schmoe',
            publishDate: '10/1/11'
        }

        return chai.request(app)
            .post('/blog-posts')
            .send(newBlogPost)
            .then(function(res) {
                res.should.have.status(201);
                res.should.be.json;
                res.should.be.a('object');
                res.body.should.include.keys('title', 'content', 'author');
                res.body.id.should.not.be.null;
            })
    })


    it('should update an existing blog entry on PUT', function() {
        const updateData = {
            title: 'change this title',
            content: 'this is a new sentence',
            author: 'new author',
            publishDate: '1/01/01'
        }
        return chai.request(app)
            .get('/blog-posts')
            .then(function(res) {
                updateData.id = res.body[0].id;

                return chai.request(app)
                    .put(`/blog-posts/${updateData.id}`)
                    .send(updateData);
            })
            .then(function(res) {
            	// console.log(res);
             //    res.should.have.status(204);
             //    res.should.be.json;
             //    res.body.should.be.a('object');
             //    res.body.should.include.keys('title', 'content', 'id', 'author', 'publishDate');
             //    res.body.should.deep.equal(updateData);
            });
    })

    it('should delete an existing blog entry on DELETE', function() {
		return chai.request(app)
    		.get('/blog-posts')
    		.then(function(res){
    			// let id = res.body[0].id;
    			return chai.request(app)
    				.delete(`/blog-posts/${res.body[0].id}`)
    		})
    		.then(function(res){
    			res.should.have.status(202);
    		})
    })
})
