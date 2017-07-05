const express = require('express');
const morgan = require('morgan');
const app = express();
const blogPostsRouter = require('./blogPostsRouter');
const {DATABASE_URL, PORT} = require('./config');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// log the http layer
app.use(morgan('common'));
app.use('/blog-posts', blogPostsRouter);

// catch-all endpoint if client makes request to non-existent endpoint
app.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});


let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  console.log('in runServer()');
  return new Promise((resolve, reject) => {
    console.log('\n\n\n\n\ndatabaseurl:\n', databaseUrl);
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}


if (require.main === module) {
  runServer().catch(err => console.error(err));
};


module.exports = {app, runServer, closeServer};