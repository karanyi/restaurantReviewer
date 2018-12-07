var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
mongoose.plugin(schema => { schema.options.usePushEach = true });
var dotenv = require('dotenv');
var Restaurant = require('./models/Restaurant');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));

/* Add whatever endpoints you need! Remember that your API endpoints must
 * have '/api' prepended to them. Please remember that you need at least 5 
 * endpoints for the API, and 5 others. 
 */


const allergens = ["yes", "no"];
const types = ["American", "Italian", "Asian", "Mexican", "Greek", "Other"];
const prices = ["$", "$$", "$$$", "$$$$"];

const ratings = [1, 2, 3, 4, 5];
const recommended = ["Yes", "No"];

dotenv.load();

mongoose.connect(process.env.MONGODB);
mongoose.connection.on('error', function() {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
});

app.get('/', function(req, res) {
    Restaurant.find({}, function(err, restaurants){
        if (err) throw err;
        var sum = 0;
        for (var restaurant of restaurants) {
            if (restaurant.reviews.length > 0) {
                for (var review of restaurant.reviews) {
                    sum += review.overall;
                }
                sum = sum / restaurant.reviews.length;
                restaurant.overall = roundToTenth(sum);
                restaurant.sortVal = roundToTenth(sum);
            } else {
                restaurant.overall = "N/A";
                restaurant.sortVal = 0;
            }
            sum = 0;
        }
        var arr = restaurants.sort(function(a, b){return b.sortVal-a.sortVal});
        res.render('restaurants', {
            restaurants: arr
        });
    });
});

app.get('/type', function(req, res) {
    Restaurant.find({}, function(err, restaurants){
        if (err) throw err;
        var sum = 0;
        for (var restaurant of restaurants) {
            if (restaurant.reviews.length > 0) {
                for (var review of restaurant.reviews) {
                    sum += review.overall;
                }
                sum = sum / restaurant.reviews.length;
                restaurant.overall = roundToTenth(sum);
                restaurant.sortVal = roundToTenth(sum);
            } else {
                restaurant.overall = "N/A";
                restaurant.sortVal = 0;
            }
            sum = 0;
        }
        var arr = restaurants.sort(function(a, b){return b.sortVal-a.sortVal});
        if (arr.length === 0) {
            res.render('types', {
                restaurants: null
            }); 
        } else {
            res.render('types', {
                restaurants: arr
            });  
        }
    });
});

app.get('/submitRestaurant', function(req, res) {
    res.render('submitRestaurant');
});

app.post('/submitRestaurant', function(req, res) {
    var allergenFriendly = req.body.allergen == "yes" ? true : false;

    var restaurant = new Restaurant({
        name: req.body.name,
        allergenFriendly: allergenFriendly,
        type: req.body.type,
        price: req.body.price,
        reviews: []
    });

    restaurant.save(function(err){
        if (err) throw err;
        res.redirect("/");
    });
    
});

app.get('/reviews/:restaurant', function(req, res) {
    Restaurant.findOne({name: req.params.restaurant},function(err, restaurant){
        if (err) throw err;

        if ( restaurant.reviews.length === 0) {
            res.render('reviews', {
                reviews: null
            });
        } else {
            res.render('reviews', {
                reviews: restaurant.reviews
            });
        }
    });
});

app.get('/submitReview/:restaurant', function(req, res) {
    var restaurant = req.params.restaurant;

    res.render('submitReview', {
        reviews: restaurant,
        name: restaurant
    });
});

app.post('/submitReview/:restaurant', function(req, res) {    
    Restaurant.findOne({name: req.params.restaurant},function(err, restaurant){
        if (err) throw err;

        restaurant.reviews.push({
            overall: parseInt(req.body.overall),
            recommend: req.body.recommend,
            service: parseInt(req.body.service),
            cleanliness: parseInt(req.body.cleanliness),
            comment: req.body.comment
        });

        restaurant.save(function(err){
            if (err) throw err;
            res.redirect("/");
        });
    });
});

app.get('/alphabetical', function(req, res) {
    Restaurant.find({}, function(err, restaurants){
        if (err) throw err;
        var sum = 0;
        for (var restaurant of restaurants) {
            if (restaurant.reviews.length > 0) {
                for (var review of restaurant.reviews) {
                    sum += review.overall;
                }
                sum = sum / restaurant.reviews.length;
                restaurant.overall = roundToTenth(sum);
            } else {
                restaurant.overall = "N/A";
            }
            sum = 0;
        }
        restaurants.sort(function(a, b){return a.name.localeCompare(b.name)});

        if (restaurants.length === 0) {
            res.render('restaurants', {
                restaurants: null
            });
        } else {
            res.render('restaurants', {
                restaurants: restaurants
            });  
        }
    });
});

app.get('/cleanliness', function(req, res) {
    Restaurant.find({}, function(err, restaurants){
        if (err) throw err;
        var sum = 0;
        var cleanlinessSum = 0;
        var arr = []; // array of restaurants that pass the 3.3 threshold
        for (var restaurant of restaurants) {
            if (restaurant.reviews.length > 0) {
                for (var review of restaurant.reviews) {
                    sum += review.overall;
                    cleanlinessSum += review.cleanliness;
                }
                sum = sum / restaurant.reviews.length;
                cleanlinessSum = cleanlinessSum / restaurant.reviews.length;
                restaurant.overall = roundToTenth(sum);
                restaurant.sortVal = roundToTenth(sum);
                cleanlinessSum = roundToTenth(cleanlinessSum);
                if (cleanlinessSum >= 3.3) {
                    arr.push(restaurant);
                }
            } else {
                restaurant.overall = "N/A";
                restaurant.sortVal = 0;
            }
            sum = 0;
            cleanlinessSum = 0;
        }
        arr.sort(function(a, b){return b.sortVal-a.sortVal});

        if (arr.length === 0) {
            res.render('restaurants', {
                restaurants: null
            });
        } else {
            res.render('restaurants', {
                restaurants: arr
            });
        }
    });
});

app.get('/service', function(req, res) {
    Restaurant.find({}, function(err, restaurants){
        if (err) throw err;
        var sum = 0;
        var serviceSum = 0;
        var arr = []; // array of restaurants that pass the 3.3 threshold
        for (var restaurant of restaurants) {
            if (restaurant.reviews.length > 0) {
                for (var review of restaurant.reviews) {
                    sum += review.overall;
                    serviceSum += review.service;
                }
                sum = sum / restaurant.reviews.length;
                serviceSum = serviceSum / restaurant.reviews.length;
                restaurant.overall = roundToTenth(sum);
                restaurant.sortVal = roundToTenth(sum);
                serviceSum = roundToTenth(serviceSum);
                if (serviceSum >= 3.3) {
                    arr.push(restaurant);
                }
            } else {
                restaurant.overall = "N/A";
                restaurant.sortVal = 0;
            }
            sum = 0;
            serviceSum = 0;
        }
        arr.sort(function(a, b){return b.sortVal-a.sortVal});

        if (arr.length === 0) {
            res.render('restaurants', {
                restaurants: null
            });
        } else {
            res.render('restaurants', {
                restaurants: arr
            });
        }
    });
});

app.get('/allergen', function(req, res) {
    Restaurant.find({}, function(err, restaurants){
        if (err) throw err;
        var sum = 0;
        var arr = []; // array of restaurants that pass the 3.3 threshold
        for (var restaurant of restaurants) {
            if (restaurant.reviews.length > 0) {
                for (var review of restaurant.reviews) {
                    sum += review.overall;
                }
                sum = sum / restaurant.reviews.length;
                restaurant.overall = roundToTenth(sum);
                restaurant.sortVal = roundToTenth(sum);
            } else {
                restaurant.overall = "N/A";
                restaurant.sortVal = 0;
            }
            sum = 0;
            if (restaurant.allergenFriendly) {
                arr.push(restaurant);
            }
        }
        arr.sort(function(a, b){return b.sortVal-a.sortVal});

        if (arr.length === 0) {
            res.render('restaurants', {
                restaurants: null
            });
        } else {
            res.render('restaurants', {
                restaurants: arr
            });
        }
    });
});

app.get('/api/allergen', function(req, res) {
    Restaurant.find({}, function(err, restaurants){
        if (err) throw err;
        var sum = 0;
        var arr = []; // array of restaurants that pass the 3.3 threshold
        for (var restaurant of restaurants) {
            if (restaurant.reviews.length > 0) {
                for (var review of restaurant.reviews) {
                    sum += review.overall;
                }
                sum = sum / restaurant.reviews.length;
                restaurant.overall = roundToTenth(sum);
                restaurant.sortVal = roundToTenth(sum);
            } else {
                restaurant.overall = "N/A";
                restaurant.sortVal = 0;
            }
            sum = 0;
            if (restaurant.allergenFriendly) {
                arr.push(restaurant);
            }
        }
        arr.sort(function(a, b){return b.sortVal-a.sortVal});

        if (arr.length === 0) {
            res.json([]);
        } else {
            res.json(arr);
        }
    });
});

app.get('/api/service', function(req, res) {
    Restaurant.find({}, function(err, restaurants){
        if (err) throw err;
        var sum = 0;
        var serviceSum = 0;
        var arr = []; // array of restaurants that pass the 3.3 threshold
        for (var restaurant of restaurants) {
            if (restaurant.reviews.length > 0) {
                for (var review of restaurant.reviews) {
                    sum += review.overall;
                    console.log(review);
                    serviceSum += review.service;
                }
                sum = sum / restaurant.reviews.length;
                serviceSum = serviceSum / restaurant.reviews.length;
                restaurant.overall = roundToTenth(sum);
                restaurant.sortVal = roundToTenth(sum);
                serviceSum = roundToTenth(serviceSum);
                if (serviceSum >= 3.3) {
                    console.log(serviceSum);
                    arr.push(restaurant);
                }
            } else {
                restaurant.overall = "N/A";
                restaurant.sortVal = 0;
            }
            sum = 0;
            serviceSum = 0;
        }
        arr.sort(function(a, b){return b.sortVal-a.sortVal});

        if (arr.length === 0) {
            res.json([]);
        } else {
            res.json(arr);
        }
    });
});

app.get('/api/cleanliness', function(req, res) {
    Restaurant.find({}, function(err, restaurants){
        if (err) throw err;
        var sum = 0;
        var cleanlinessSum = 0;
        var arr = []; // array of restaurants that pass the 3.3 threshold
        for (var restaurant of restaurants) {
            if (restaurant.reviews.length > 0) {
                for (var review of restaurant.reviews) {
                    sum += review.overall;
                    cleanlinessSum += review.cleanliness;
                }
                sum = sum / restaurant.reviews.length;
                cleanlinessSum = cleanlinessSum / restaurant.reviews.length;
                restaurant.overall = roundToTenth(sum);
                restaurant.sortVal = roundToTenth(sum);
                cleanlinessSum = roundToTenth(cleanlinessSum);
                if (cleanlinessSum >= 3.3) {
                    arr.push(restaurant);
                }
            } else {
                restaurant.overall = "N/A";
                restaurant.sortVal = 0;
            }
            sum = 0;
            cleanlinessSum = 0;
        }
        arr.sort(function(a, b){return b.sortVal-a.sortVal});

        if (arr.length === 0) {
            res.json([]);
        } else {
            res.json(arr);
        }
    });
});

app.get('/api/', function(req, res) {
    Restaurant.find({}, function(err, restaurants){
        if (err) throw err;
        var sum = 0;
        for (var restaurant of restaurants) {
            if (restaurant.reviews.length > 0) {
                for (var review of restaurant.reviews) {
                    sum += review.overall;
                }
                sum = sum / restaurant.reviews.length;
                restaurant.overall = roundToTenth(sum);
                restaurant.sortVal = roundToTenth(sum);
            } else {
                restaurant.overall = "N/A";
                restaurant.sortVal = 0;
            }
            sum = 0;
        }
        var arr = restaurants.sort(function(a, b){return b.sortVal-a.sortVal});
        res.json(arr);
    });
});

app.post('/api/submitRestaurant', function(req, res) {
    var failed = false;
    console.log(req.body);

    if (!prices.includes(req.body.price) || !allergens.includes(req.body.allergen) ||
    !types.includes(req.body.type)) {
        failed = true;
        console.log(req.body.price);
    }

    var allergenFriendly = req.body.allergen == "yes" ? true : false;

    var restaurant = new Restaurant({
        name: req.body.name,
        allergenFriendly: allergenFriendly,
        type: req.body.type,
        price: req.body.price,
        reviews: []
    });

    if (!failed) {
        restaurant.save(function(err){
            if (err) throw err;
            res.send("Success!");
        });
    } else {
        res.send("Failed!");
    }
});

app.post('/api/submitReview/:restaurant', function(req, res) {
    var failed = false;

    if (!ratings.includes(parseInt(req.body.overall)) || !ratings.includes(parseInt(req.body.service)) ||
    !ratings.includes(parseInt(req.body.cleanliness)) || !recommended.includes(req.body.recommend)) {
        failed = true;
    }

    Restaurant.findOne({name: req.params.restaurant},function(err, restaurant){
        if (err) throw err;

        restaurant.reviews.push({
            overall: parseInt(req.body.overall),
            recommend: req.body.recommend,
            service: parseInt(req.body.service),
            cleanliness: parseInt(req.body.cleanliness),
            comment: req.body.comment
        });

        if (!failed) {
            restaurant.save(function(err){
                if (err) throw err;
                res.send("Success!");
            });
        } else {
            res.send("Failure!");
        }
    });
});

app.listen(process.env.PORT || 3000, function() {
    console.log('Final Project listening on port 3000!');
});

function roundToTenth(number) {
    return Math.round(100*number)/100;
}