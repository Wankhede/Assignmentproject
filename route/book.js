const express = require("express");
const router = express.Router();
const path = require("path");
const Book = require("../model/bookModel");
const mongoose = require("mongoose");
const Cart = require("../model/cartModel");

//const multer = require("multer");
const { response } = require("express");
//for taking multiport files
// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, "./uploads/");
//     },
//     filename: function(req, file, cb) {
//         cb(null, path.join(Date.now() + file.originalname));
//     },
// });
//const upload = multer({ storage: storage });

//getting book api/book
router.get("/book", async(req, res) => {
    const book = await Book.find();
    res.send(book);
});

//for getting by book name /.*port.*/

router.get("/book/:title", async(req, res) => {
    const book = await Book.find({ title: { $regex: req.params.title, $options: "$i" } },
        (err) => {
            if (err) {
                console.log(err);
            }
        }
    );
    res.send(book);
});

//searching the book with title and having that city
router.get("/book1/:title/:city", async(req, res) => {
    const book = await Book.find({
            $and: [
                { title: { $regex: req.params.title, $options: "$i" } },
                { city: req.params.city },
            ],
        },
        (err) => {
            if (err) {
                console.log(err);
            }
        }
    );
    res.send(book);
});

// finding users book
router.get("/user/:user", async(req, res) => {
    const book = await Book.find({ user: req.params.user });
    res.send(book);
});

// finding distinct category
router.get("/cat", async(req, res) => {
    const book = await Book.distinct("category");
    console.log(JSON.stringify(book));
    res.send(book);
});

// finding book by city
router.get("/city2/:city", async(req, res) => {
    const book = await Book.find({ city: req.params.city });
    //console.log(JSON.stringify(book));
    res.send(book);
});

//for finding books with city and category
router.get("/citys/:city/:category", async(req, res) => {
    const book = await Book.find({
        $and: [{ city: req.params.city }, { category: req.params.category }],
    });
    //console.log(JSON.stringify(book));
    res.send(book);
});

//for finding distinct city
router.get("/city1", async(req, res) => {
    const book = await Book.distinct("city");
    console.log(JSON.stringify(book));
    res.send(book);
});
router.get("/city/:cat", async(req, res) => {
    const book = await Book.find({ city: req.params.cat }).limit(5);
    res.send(book);
});

router.get("/categ/:cat", async(req, res) => {
    const book = await Book.find({ category: req.params.cat });
    res.json(book);
});

//for getting book by id


//for deleting the book

router.get("/productid/:id", async function(req, res) {
    const product = await Book.findById(req.params.id)
    console.log(product)
    res.json(product)

});

/* UPDATE BOOK */
router.put("/:id", function(req, res, next) {
    Book.findByIdAndUpdate(req.params.id, req.body, function(err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

//uploading img
router.post("/upload", upload.single("productImage"), async(req, res) => {
    console.log(req.file.path);
    res.send({ imgUrl: req.file.path });
});

//saving book
router.post("/sell", async(req, res) => {
    var objectId = mongoose.Types.ObjectId(req.body.user);
    console.log(objectId);

    console.log(req.body);
    console.log(req.file);

    let book = new Book({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        imgUrl: req.body.imgUrl,
    });

    try {
        let savebook = await book.save();
        res.send({ book: book._id });
    } catch (err) {
        res.status(400).send(err);
    }
});


//adding in cart
router.post("/cart", async(req, res) => {
    var objectId = mongoose.Types.ObjectId(req.body.prod);
    console.log(objectId);

    console.log(req.body);
    //console.log(req.file);

    let cart = new Cart({
        quantity: req.body.quantity,
        prod: objectId,

    });

    try {
        let savebook = await cart.save();
        res.send({ cart: cart._id });
    } catch (err) {
        res.status(400).send(err);
    }
});


//view cart
router.get("/view", (req, res, next) => {
    Cart.find()
        .populate("prod")
        .exec(function(err, post) {
            if (err) return next(err);
            res.json(post);
        });
})

// router.delete("/delete", async(req, res) => {
//     Book.deleteMany({}).then(() => {
//         console.log("deleted")
//     })

//     res.json({ "message": "deleted" })

// })

// router.delete("/cart", async(req, res) => {
//     Cart.deleteOne({}).then(() => {
//         console.log("cart items deleted")
//     })

//    

// })

router.delete("/cart", async(req, res) => {
    Cart.deleteOne({}).then(() => {
        var objectId = mongoose.Types.ObjectId(req.body.prod);
        console.log(objectId);

    })
    res.json({ "message": "deleted" })
})

router.delete("/deleteId/book/:id", function(req, res, next) {
    console.log(req.params.id)
    Cart.findByIdAndRemove(req.params.id, function(err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

// router.get('/delete/:id', function(req, res) {
//     var id = req.params.id;
//     console.log(id);
//     var sql = `DELETE FROM products WHERE id=${id}`;

//     db.query(sql, function(err, result) {
//         if (err) throw err;
//         console.log('record deleted!');
//         res.redirect('/products');
//     });
// });

//exporting the router
module.exports = router;