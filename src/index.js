const express = require('express');
const path = require('path');
const morgan = require('morgan');
const multer = require('multer');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const imageName = require('./utilities');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

//inicialitations
const app = express();
require('./database');

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
app.use(express.urlencoded({extended: false})); //helps to understand the inputs like strings/texts 
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file, cb, filename) => {
        cb(null, imageName() + path.extname(file.originalname));
    }
});
app.use(multer({
    storage: storage
}).single('image')); //say it thet I will push only one image with the input image

//global variables

//routes
app.use(require('./routes/index'));

//static files
app.use(express.static(path.join(__dirname, 'public')));

//star the server
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});