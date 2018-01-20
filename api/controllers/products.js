let mongoose = require('mongoose');
//include a schemas from models
const Product = require("../../models/product");

//address link 
const PORT = process.env.PORT || 8000;
const URL = `http://127.0.0.1:8000/products/`;

exports.getAllProducts = (req, res, next) => {
    Product.find()
        .select('_id name price productImage')
        .exec()
        .then(docs => {
            let data = {
                count: docs.length,
                products: docs.map(row => {
                    let request = { url: URL + row._id, type: "GET" };
                    return { name: row.name, price: row.price, _id: row._id, productImage: row.productImage, request }
                })
            }
            res.status(200).json(data);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.createProduct = (req, res, next) => {
    console.log("--------------------------");
    console.log(req.file);
    console.log("--------------------------");
    let newProduct = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path//the path & name of image stored into server
    });


    newProduct
        .save()
        .then(result => {
            res.status(201).json({
                message: 'POST request',
                product: {
                    _id: newProduct._id,
                    name: newProduct.name,
                    price: newProduct.price,
                    productImage: newProduct.productImage,
                    request: {
                        type: 'GET',
                        url: URL + result._id
                    }
                }
            });
        })
        .catch(error => {
            console.log("err----------->", error);
            res.status(500).json(error);
        });



};

exports.getProductById = (req, res, next) => {
    Product
        .findById({ _id: req.params.productId })
        .select('_id name price productImage')
        .then(doc => {
            doc = {
                name: doc.name,
                price: doc.price,
                _id: doc._id,
                productImage: doc.productImage,
                request: {
                    type: "GET",
                    url: URL
                }
            }
            if (doc) res.status(200).json(doc);
            else res.status(404).json({ message: "Not found product" });

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        });
};

exports.deleteProduct = (req, res, next) => {
    Product.remove({ _id: req.params.productId })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Product deleted"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        })
};

exports.updateProduct = (req, res, next) => {
    let updateOpts = {};
    for (const opt of req.body) {
        updateOpts[opt.propName] = opt.value;
    }
    Product.update({ _id: req.params.productId }, { $set: updateOpts })
        .exec()
        .then(result => {
            console.log('res', req.params.productId);
            res.status(200).json({
                message: "Product updated succesfully",
                request: {
                    type: "GET",
                    url: URL + req.params.productId
                }
            })
        }).catch(error => res.status(500).json({ error }))
};
