require('dotenv').config();
const express = require('express');
const connectDb = require('./config/connectDb');
// const userRoutes = require('./routes/user');
// const adminRoutes = require('./routes/admin');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');


const app = express();

connectDb();
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(expressLayouts);
app.use(
    session({
        key: "userId",
        secret: 'abdulhadi',
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 60 * 60 * 24 * 1000,
        },
    })
)

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/login', (req, res) => {
    res.render('login');
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
