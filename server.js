const restify = require('restify'),
  errors = require('restify-errors'),
  categories = require('./categories'),
  articles = require('./articles');
const port = process.env.PORT || 8080;

const server = restify.createServer();
server.get('/articles', (req, res, next) => {
  res.send(articles);
  next();
});

server.get('/articles/:id', (req, res, next) => {
  const article = articles.find(a => a.id === +req.params.id);
  if (article) {
    res.send(article);
    return next();
  }

  next(new errors.NotFoundError('Article not found'));
});

server.get('/categories', (req, res, next) => {
  res.send(categories.map(({ id, key }) => ({ id, key })));
  next();
});

server.get('/categories/:id', (req, res, next) => {
  const category = categories.find(c => c.id === req.params.id);
  if (category) {
    res.send(category.children);
    return next();
  }

  next(new restify.errors.NotFoundError('Category not found'));
});

server.listen(port, function() {
  console.log('%s listening at %s', server.name, server.url);
});
