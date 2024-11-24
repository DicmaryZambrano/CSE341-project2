const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const BodyParser = require('body-parser');
const mongodb = require('./db/connection');
const routes = require('./routes');
const errorHandler = require('./utils/errorHandler');
const Api404Error = require('./utils/api404Error');

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app.use(cors());

/* Routes */

app.use('/', routes);

// Catch-all 404 handler with custom error
app.use((req, res, next) => {
  next(new Api404Error());
});

// Error-handling middleware

app.use(errorHandler);

/* Database Connection an api initialization */

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(
        `Database is connected and Web Server is listening at port ${port}`,
      );
    });
  }
});
