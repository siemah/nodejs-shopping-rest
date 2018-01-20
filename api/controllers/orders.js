let mongoose = require('mongoose');
const Order = require('../../models/order');
const Product = require('../../models/product');

const PORT = process.env.PORT || 8000;
const URL = `http://127.0.0.1:${PORT}/orders/`;

exports.getAllOrders = (req, res, next) => {
    Order.find().exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: URL + doc._id
                        }
                    };
                })
            });
        })
        .catch(error => res.status(00).json(error));
};

exports.createOrder = (req, res, next) => {
    Product
        .findById({ _id: req.body.productId })
        .then(product => {
            if (!product) res.status(404).json({ message: "Product Not Found" });
            // return a promise
            return order.save()
        })
        .then(result => {
            res.status(201).json({
                message: 'Order stored succesfully',
                createdOrder: {
                    _id: result._id,
                    quantity: result.quantity,
                    product: result.productId
                },
                request: {
                    type: "GET",
                    url: URL + result._id
                }
            });
        })
        .catch(error => {
            console.log("error", error);
            res.status(500).json(error)
        });
    let order = new Order({
        _id: mongoose.Types.ObjectId(),
        productId: req.body.productId,
        quantity: req.body.quantity
    });
};

exports.getOrderById = (req, res, next) => {
    Order
        .findById(req.params.orderId)
        .exec()
        .then(order => {
            if (order === null) res.status(404).json({ message: "Order dont found" })
            res.status(200).json({
                order,
                request: {
                    type: "GET",
                    url: URL
                }
            });
        })
        .catch(error => res.status(500).json(error))
};

exports.deleteOrder = (req, res, next) => {
    Order.remove({ _id: req.params.orderId })
        .then(result => {
            res.status(200).json({
                message: "Order deleted",
                request: {
                    type: 'POST',
                    url: URL,
                    body: {
                        "productId": "ID",
                        "quantity": "Number"
                    }
                }
            })
        })
        .catch(error => res.stat(500).json(error));
};

