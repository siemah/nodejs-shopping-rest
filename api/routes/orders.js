let router = require('express').Router();
let checkAuth = require('../middleware/check-auth');
//controller of orders
const OrdersController = require('../controllers/orders');

const PORT = process.env.PORT || 8000;
const URL = `http://127.0.0.1:${PORT}/orders/`;

router.route('/')
    .get(checkAuth, OrdersController.getAllOrders)
    .post(checkAuth, OrdersController.createOrder);

//special order
router.route('/:orderId')
    .get(checkAuth, OrdersController.getOrderById)
    .delete(checkAuth, OrdersController.deleteOrder);

module.exports = router;