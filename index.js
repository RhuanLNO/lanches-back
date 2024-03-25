const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./utils/database');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Origin', 'GET, POST, PATCH, DELETE');
  next();
});

app.get('/', (request, response, next) => {
  response.send('Hello World');
});

app.use('/restaurants', require('./routes/restaurants'));
app.use('/categories', require('./routes/categories'));
app.use('/restaurantsCategories', require('./routes/restaurantsCategories'));

app.use((error, request, response, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  response.status(status).json({ message: message });
});

sequelize
  .sync()
  .then(() => {
    console.log('Database OK');
    app.listen(3000);
  })
  .catch(err => console.log(err));
  