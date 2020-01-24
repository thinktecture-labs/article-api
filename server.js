const restify = require('restify'),
  errors = require('restify-errors'),
  categories = require('./categories'),
  articles = require('./articles');
const port = process.env.PORT || 8080;

const server = restify.createServer();
server.use(restify.plugins.queryParser());

server.get('/articles', (req, res, next) => {
  const query = req.query.q;
  res.send(query ? articles.filter(article => article.title.toLowerCase().includes(query.toLowerCase())) : articles);
  next();
});

server.get('/articles/:id', (req, res, next) => {
  const articleIndex = articles.findIndex(a => a.id === +req.params.id);
  if (articleIndex === -1) {
    next(new errors.NotFoundError('Article not found'));
    return;
  }

  const article = articles[articleIndex];
  const previousArticle = articles[articleIndex - 1];
  const nextArticle = articles[articleIndex + 1];

  if (previousArticle) {
    article.previousId = previousArticle.id;
  }

  if (nextArticle) {
    article.nextId = nextArticle.id;
  }

  res.send(article);
  next();
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
