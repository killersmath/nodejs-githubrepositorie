const express = require('express');
const morgan = require('morgan');
const passport = require('passport');

const exphbs = require('express-handlebars');

//--- import env variable
require('dotenv').config();

const app = express();

app.use(express.static(__dirname + '/public'));

const port = process.env.PORT | 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

//--- setup view engine

const hbs = exphbs.create({
  layoutsDir: __dirname + '/views'
});

app.engine('handlebars', hbs.engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// --- setup passport (github)
require('./controllers/passport')(app, passport);

// --- setup routes
require('./routes/routes')(app, passport);

app.listen(port, () => {
  console.log(`🌏Server is running at http://localhost:${port}`);
});
