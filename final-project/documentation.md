
# PROJECT NAME

---

Name: Kevin Aranyi

Date: 12-7-18

Project Topic: Restaurant Reviewer

URL: 

---


### 1. Data Format and Storage

### Restaurant

Data point fields:
- `Field 1`: name                ...       `Type: String`
- `Field 2`: allergenFriendly    ...       `Type: Boolean`
- `Field 3`: type                ...       `Type: String`
- `Field 4`: price               ...       `Type: String`
- `Field 5`: sortVal             ...       `Type: Number`
- `Field 6`: reviews             ...       `Type: [Review]`

Schema: 
```javascript
{
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
}
```

### Review

Data point fields:
- `Field 1`: overall             ...       `Type: String`
- `Field 2`: recommend           ...       `Type: Boolean`
- `Field 3`: service             ...       `Type: String`
- `Field 4`: cleanliness         ...       `Type: String`
- `Field 5`: comment             ...       `Type: Number`

Schema: 
```javascript
{
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
}
```

### 2. Add New Data

HTML form route: `/submitRestaurant`

POST endpoint route: `/api/submitRestaurant`

Example Node.js POST request to endpoint: 
```javascript
var request = require("request");

var options = { 
    method: 'POST',
    url: 'http://localhost:3000/api/...',
    headers: { 
        'content-type': 'application/json' 
    },
    form: { 
      "name": "Mcdonalds",
      "price": "$",
      "type": "American",
      "allergen": "yes"
    } 
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});

HTML form route: `/submitReview/:restaurant`

POST endpoint route: `/api/submitReview/:restaurant`

Example Node.js POST request to endpoint: 

javascript
var request = require("request");

var options = { 
    method: 'POST',
    url: 'http://localhost:3000/api/submitReview/Mcdonalds',
    headers: { 
        'content-type': 'application/json' 
    },
    form: { 
      "recommend": "Yes",
      "service": 5,
      "cleanliness": 4,
      "overall": 5,
      "comment": "boy oh boy was this a delicious and nutritious meal"
    } 
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});

```

### 3. View Data

GET endpoint route: `/api/allergen`
GET endpoint route: `/api/type`
GET endpoint route: `/api/alphabetical`
GET endpoint route: `/api/cleanliness`
GET endpoint route: `/api/service`

### 4. Search Data

Search Field: name

### 5. Navigation Pages

Navigation Filters
1. Sort by Rating -> `  /  `
2. Sort Alphabetically -> `  /alphabetical  `
3. Clean Restaurants -> `  /cleanliness  `
4. Great Service -> `  /service  `
5. Select a type of Restauran -> `  /type  `
6. Allergen Friendly Restaurants -> `  /allergen  `