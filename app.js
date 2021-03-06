require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const multer = require('multer');
const rootVars = require('./middleware/root-vars.middleware');
const appRouter = require('./routes');

const notfoundHandler = require('./handlers/notfound.handler');
const errorHandler = require('./handlers/error.handler');

const uploader = multer({ dest: __dirname + '/uploads/' });
const app = express();

// >>> Configurations >>>
// set view engine
app.set('views', './views');
app.set('view engine', 'ejs');

// set up global middleware
app
  .use(rootVars)
  .use(express.static('public'))
  .use(bodyParser.urlencoded({ extended: false }))
  .use(cookieParser('lnkd'))
  .use(flash())
  .use(
    session({
      secret: 'lnkd',
      resave: false,
      saveUninitialized: false,
    })
  );
// <<< Configurations <<<

// App routing setup
app.use('/', appRouter);

/**
 * Cac ban them description
 */
app.get('/accountbalance', (req, res) => {
  res.render('accountbalance');
});

/**
 * Cac ban them description
 */
app.get('/linkcard', (req, res) => {
  res.render('linkcard');
});

/**
 * Cac ban them description
 */
app.get('/topup', (req, res) => {
  res.render('topup');
});

/**
 * Cac ban them description
 */
app.get('/transfer', (req, res) => {
  res.render('transfer');
});

/**
 * Cac ban them description
 */
app.get('/withdraw', (req, res) => {
  res.render('withdraw');
});

/**
 * Cac ban them description
 */
app.get('/buycard', (req, res) => {
  res.render('buycard');
});

/**
 * Cac ban them description
 */
app.get('/buybusticket', (req, res) => {
  res.render('buybusticket');
});

/**
 * Cac ban them description
 */
app.get('/profile', (req, res) => {
  res.render('profile');
});

/**
 * Cac ban them description
 */
app.post('/upload', uploader.single('customFile'), (req, res) => {
  const { email, path } = req.body;
  const file = req.file;
  console.log(req.body);

  if (!email || !path || !file) {
    return res.json({ code: 1, message: 'Thi???u th??ng tin' });
  }

  const { root } = req.vars;
  const currentPath = `${root}/users/${email}/${path}`;

  if (!fs.existsSync(currentPath)) {
    return res.json({ code: 2, message: '???????ng d???n kh??ng t???n t???i' });
  }

  let name = file.originalname;
  let filePath = `${currentPath}/${name}`;

  fs.renameSync(file.path, filePath);

  return res.json({ code: 0, message: 'Upload th??nh c??ng' });
});

/**
 * Cac ban them description
 */
app.post('/edit', uploader.single('customFile'), (req, res) => {
  const { email, oldName, newName } = req.body;
  console.log(req.body);

  if (!email || !oldName || !newName) {
    return res.json({ code: 1, message: 'Thi???u th??ng tin' });
  }

  const { root } = req.vars;
  const currentPath = `${root}/users/${email}/${oldName}`;

  if (!fs.existsSync(currentPath)) {
    return res.json({ code: 2, message: '???????ng d???n kh??ng t???n t???i' });
  }

  let newPath = `${root}/users/${email}/${newName}`;
  console.log('new: ' + newPath);
  fs.renameSync(currentPath, newPath);

  return res.json({ code: 0, message: '?????i t??n th??nh c??ng' });
});

/**
 * Cac ban them description
 */
app.post('/delete', uploader.single('customFile'), (req, res) => {
  const { email, name } = req.body;
  console.log(req.body);

  if (!email || !name) {
    return res.json({ code: 1, message: 'Thi???u th??ng tin' });
  }

  const { root } = req.vars;
  const currentPath = `${root}/users/${email}/${name}`;

  if (!fs.existsSync(currentPath)) {
    return res.json({ code: 2, message: '???????ng d???n kh??ng t???n t???i' });
  }

  fs.unlinkSync(currentPath);

  return res.json({ code: 0, message: 'X??a th??nh c??ng' });
});

// set up handlers
app.use(notfoundHandler).use(errorHandler);

module.exports = app;
