const express  = require("express");
const router = express.Router();

const userController = require('../controllers/userController');
const customerController = require('../controllers/customerController');
const advertisementController = require('../controllers/advertisementController');
const escortController =  require('../controllers/escortController');
const serviceController = require('../controllers/serviceController');
const ratingController = require('../controllers/ratingController');


const {auth, isAdmin, isVendor}  = require('../middlewares/Auth');

const {customerAuth} = require('../middlewares/CustomerAuth');
const { imageSingleUpload , imageMultiUpload} = require("../middlewares/multer");
// Home 
router.get("/", (req, res) =>{
    res.send("Welcome to UB Factory Backend");
});
//Admin Route//
router.post("/register-user", userController.signUp);
router.post("/login-user", userController.login);
router.get("/my-profile", auth, userController.getMyProfile);//auth
router.put("/update-user/:id",imageSingleUpload, auth, userController.updateUser);
router.put("/update-user-status", auth, isAdmin, userController.updateUserStatus);
router.get("/get-all-users", auth, isAdmin, userController.getUser);
router.get("/get-user-by-id/:id", auth, isAdmin, userController.getUserById);
router.delete("/delete-user/:id", auth, isAdmin, userController.deleteUser);
router.post("/forget-password",  userController.forgotPassword);
router.post("/change-password", auth, userController.updatePassword);


//Customer Route//
router.post("/register-customer", customerController.signup);
router.post("/login-customer", customerController.login);
router.get("/get-my-profile", customerAuth, customerController.getMyProfile);
router.put("/update-my-profile/:id", customerAuth, customerController.updateMyProfile);
router.get("/get-customer",  auth, isAdmin, customerController.getAllCustomers);
router.get('/get-customer-by-id/:id', auth, isAdmin, customerController.getCustomerById);
router.get("/get-my-favorite",  customerAuth, customerController.getMyFavorite);
router.post("/add-to-favorite",  customerAuth, customerController.addTofavorite);
router.post("/remove-from-favorite",  customerAuth, customerController.removeFromFavorite);
router.post('/update-customer/:id', auth, isAdmin, customerController.updateCustomer);
router.put('/update-recent-view/:id', customerAuth, customerController.updateRecentlyViewedEscorts);
router.get('/get-recent-view', customerAuth, customerController.getMyRecentView);



//Advertisement  Route//
router.post("/create-advertisement", auth, isAdmin,advertisementController.createAdvertisement);
router.put("/update-advertisement/:id", auth, isAdmin, advertisementController.updateAdvertisement);
router.put("/update-advertisement-status/:id", auth, isAdmin, advertisementController.changeStatus);
router.get("/get-advertisement",  advertisementController.getAllAdvertisement);
router.get("/get-advertisement-by-id/:id",  advertisementController.getAdvertisementById);
router.delete('/delete-advertisement/:id', auth, isAdmin, advertisementController.deleteAdvertisement);

//Escort Route//
router.post("/create-escort", imageMultiUpload, auth, isVendor, escortController.createEscort);
router.get("/get-escorts",  escortController.getAllEscorts);
router.get("/get-my-escorts",  auth, isVendor, escortController.getMyEscorts);
router.put("/update-escorts/:id",  imageMultiUpload, auth,  escortController.updateEscort);
router.delete("/delete-escort/:id",  auth, isVendor, escortController.deleteEscorts);


//Service Route//
router.post("/create-service", auth, serviceController.createService);
router.put('/update-service/:id', auth,  serviceController.updateService);
router.get("/get-service",  serviceController.getAllService);
router.get('/get-service-by-id/:id', serviceController.getServiceById);
router.delete('/delete-service/:id', auth, serviceController.deleteService);

//Rating Route//
router.post("/create-rating", customerAuth, ratingController.creatRating);
router.put('/update-rating/:id', customerAuth,  ratingController.updateRating);
router.get("/get-rating/:id",  ratingController.getEscortRating);

module.exports = router;