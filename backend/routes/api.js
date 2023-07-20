const express = require('express');
const router = express.Router();

const md5 = require('md5');

/* DB */
const db = require('../DB/db');

/* Endpoints */

router.all('/', (req, res, next) => {
    res.status(501);
    res.send("Under construction - Come back later!");
});

// Auth
const authRouter = require('./api/auth');
router.use('/auth', authRouter);

// Users
const usersRouter = require('./api/users');
router.use('/users', usersRouter);

// Listings
const listingsRouter = require('./api/listings');
router.use('/listings', listingsRouter);

/* Strange outlier */

// Check out - Subtract amount from each given listing's stock
// Request body: cart: {id1: amount1, id2: amount2,...}
router.post('/check-out', (req, res, next) => {
    const cart = req.body.cart;
    const listingIDs = Object.keys(cart).map(key => db.mongoose.Types.ObjectId(key));

    // Check user sign-in status
    if (!req.session.user) {
        res.status(403).send("Not signed-in");
        return;
    }

    db.models.listing.find({ "_id": { $in: listingIDs } })
        .then(results => {
            // Check listings match
            if (results.length != listingIDs.length)
                throw "Some listings have no match in DB";

            // Check for listing stock
            results.forEach(listing => {
                if (listing.stock < cart[listing.id])
                    throw "Some listings have not enough stock";
            });

            let promises = [];

            results.forEach(listing => {
                const listingID = listing._id;
                const newStock = listing.stock -= cart[listing.id];

                promises.push(db.models.listing.findOneAndUpdate({ "_id": listingID }, { "stock": newStock }));
            })

            return Promise.all(promises);
        })
        .then(results => {
            res.send(results);
        })
        .catch(error => {
            console.log("Error change stock: ", error);
            res.status(403).send("Cannot check out this cart");
        });
});

module.exports = router;
