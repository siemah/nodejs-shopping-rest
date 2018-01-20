let router = require('express').Router();
let multer = require('multer');
let checkAuth = require('../middleware/check-auth');
let ProductController = require('../controllers/products');

//stirage strategy
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/"); //save a file uploaded inside a uploads folder
    }, filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

//filter a file mimetype
const fileFilter = (req, file, cb) => {
    if( file.mimetype == "image/jpeg" || file.mimetype == "image/png" ) cb(null, true);
    else cb(null, false);//dont save a file but this save other data
};

let upload = multer({
    storage, //storage strategy
    limits: { // accepte a file who has a size less than 5Mb
        fileSize: 1024 * 1024 * 5
    }, fileFilter
});



router.route('/')
    .get(ProductController.getAllProducts)
    .post(checkAuth, upload.single("productImage"), ProductController.createProduct);

//special product
router.route('/:productId')
    .get(ProductController.getProductById)
    .delete(checkAuth, ProductController.deleteProduct)
    .patch(checkAuth, ProductController.updateProduct);

module.exports = router;