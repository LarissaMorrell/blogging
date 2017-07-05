exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      // 'mongodb://localhost:27017/blog-app';
                      'mongodb://dbuser:password@ds143539.mlab.com:43539/blog-app';
exports.PORT = process.env.PORT || 8080;