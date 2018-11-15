// config.js
module.exports = {
    'SECRET': 'supersecret',
    'DATABASE': 'mongodb://127.0.0.1:27017/mean',
    "cookieSecret": "dfkjdlsfjljklsdfj",
    "facebook": {
        "app_id": "290766454870982",
        "app_secret": "1fe85622abb9f454e4a4212992b408c8",
        "callback": "http://localhost:3000/auth/facebook/callback"
    },
    "twitter": {
        "consumer_key": "akeyishere",
        "consumer_secret": "mysecretisbetterthanyoursecret",
        "callback": "http://localhost:3000/auth/twitter/callback"
    },
};