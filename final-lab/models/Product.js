const { Schema, model } = require('mongoose');

const productSchema = new Schema({
    productId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    images: [{
        type: String
    }],
    category: [{
        type: String,
        required: true
    }],
    quantity: {
        type: Number,
        required: true
    },
    rating: {
        type: Number
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    dateCreated: {
        type: Date,
        default: Date.now
    },
    keyFeatures: [{
        name: String,
        value: String
    }],
});

const Product = model('Product', productSchema);

module.exports = Product;