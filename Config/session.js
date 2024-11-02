const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

module.exports = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        ttl: 14 * 24 * 60 * 60, // Session expiration in seconds (14 days)
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 14, // Optional: Expire cookies in 14 days
    },
});