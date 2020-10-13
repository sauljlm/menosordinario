const express = require('express');
const path = require('path');
const morgan = require('morgan');
const multer = require('multer');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const imageName = require('./helpers/utilities');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

//inicialitations
const app = express();
require('./database');
require('./config/passport');

//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({ // handlebars configuration
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    handlebars: allowInsecurePrototypeAccess(handlebars),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

//middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false})); //helps to understand the inputs like strings/texts from a form
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file, cb, filename) => {
        cb(null, imageName() + path.extname(file.originalname));
    }
});
app.use(multer({
    storage: storage
}).single('image')); //say it thet I will push only one image with the input image
app.use(methodOverride('_method')); // to allow forms submit all methods not only get and post
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
})); // to autenticate users
app.use(passport.initialize());
app.use(passport.session());

//global variables
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

//routes
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));

//static files
app.use(express.static(path.join(__dirname, 'public')));

//star the server
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});