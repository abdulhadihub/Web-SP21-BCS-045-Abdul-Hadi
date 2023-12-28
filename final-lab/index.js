require('dotenv').config();
const express = require('express');
const connectDb = require('./config/connectDb');
// const userRoutes = require('./routes/user');
// const adminRoutes = require('./routes/admin');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const Product = require('./models/Product');
const mongoose = require('mongoose');


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

const validateForm = (req, res, next) => {
    const { name, price, description } = req.body;
    let errors = [];
    if (!name || !price || !description) {
        return res.send('Please enter all fields');
    }
    if (errors.length > 0) {
        return res.send('Please enter all fields');
    } else {
        next();
    }
};

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('crud');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/api/get-all-products', asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
}));

app.post('/api/add-product', validateForm, asyncHandler(async (req, res) => {
    const { name, price, description, images, category, quantity } = req.body;

    const date = Date.now();
    const productId = "HMP" + date.toString();

    try {
        const product = await Product.create({
            productId,
            name,
            price,
            description,
            images,
            category,
            quantity,
        });

        if (product) {
            return res.status(201).json({ productId, message: "Product Created Successfully!" });
        }

        return res.status(500).json({ error: 'Unable to create product.' });
    } catch (error) {
        console.error('Error adding product:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}));

app.post('/api/update-product', validateForm, asyncHandler(async (req, res) => {
    const { id, name, price, description, images, category, quantity } = req.body;
    const productId = new mongoose.Types.ObjectId(id);

    try {
        const product = await Product.findById(productId);

        if (product) {
            product.name = name;
            product.price = price;
            product.description = description;
            product.images = images;
            product.category = category;
            product.quantity = quantity;


            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error('Error updating product:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));

app.delete('/api/delete-product/:id', asyncHandler(async (req, res) => {
    const productId = new mongoose.Types.ObjectId(req.params.id);

    try {
        const product = await Product.findById(productId);

        if (product) {
            await product.deleteOne();  // Use deleteOne instead of remove
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

