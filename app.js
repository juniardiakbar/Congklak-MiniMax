const express = require('express');
const path = require('path');
const sass = require('node-sass-middleware');
const app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public')
}));

const homeCongklak = (req,res) => {
  res.render('home', {
    title: 'Home'
  });
}

app.use('/', express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
app.get('/', homeCongklak);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'development') {
  app.use(errorHandler());app.use('/', express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

} else {
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Server Error');
  });
}

/**
 * Start Express server.
 */
app.listen(3001, () => {
  console.log('App is running at http://localhost:%d', 3001);
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;