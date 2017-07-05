const mongoose = require('mongoose');

const blogPostSchema = mongoose.Schema({
  "title": {type: String, required: true},
  "content": {type: String, required: true},
  "author": {
      "firstName": String, 
      "lastName": String},
  "publishDate": {type: String}
});

blogPostSchema.virtual('authorName').get(function(){
	return `${this.author.firstName} ${this.author.lastName}`.trim()
});

blogPostSchema.methods.apiRepr = function(){
	return {
	  id: this._id,
      title: this.title,
      content: this.content,
      author: this.authorName,
      publishDate: this.publishDate || new Date()
	};
}

const BlogPost = mongoose.model('blogpost', blogPostSchema);

module.exports = {BlogPost};