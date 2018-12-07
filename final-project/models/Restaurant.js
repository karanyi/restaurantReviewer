var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
    overall:{
        type: Number,
        min: 0.0,
        max: 5.0,
        required: true,
    },
    recommend:{
        type: String,
        required: true
    },
    service:{
        type: Number,
        min: 0.0,
        max: 5.0,
        required: true,
    },
    cleanliness:{
        type: Number,
        min: 0.0,
        max: 5.0,
        required: true,
    },
    comment:{
        type: String,
    }
});

var restaurantSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    allergenFriendly:{
        type: Boolean,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    price:{
        type: String,
        required: true,
    },
    sortVal:{
        type: Number,
        required: false
    },
    reviews: [reviewSchema]
});

var Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;