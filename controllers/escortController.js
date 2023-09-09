const Escort = require('../models/escort');
const Rating = require('../models/rating');
const User =require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { options } = require("../routes/route");
require("dotenv").config();

const createEscort = async(req, res) =>{
    const authenticatedUser = req.user;

    const userId = authenticatedUser._id;

    const vendor = await User.findById(userId);
    if(vendor.status != "active"){
        return res.status(400).json({ message: 'You are not Authorize yet to Do this oeration. Ask Admin to approve your profile!' });
    }
try{
    const {name, email, password, mobile, dob, bio, price, city, state, pincode, address, services} = req.body;
    const files = req.s3FileUrls;
    // Check if the email or mobile already exists in the database
    const existingEscort = await Escort.findOne({
        $or: [{ email }, { mobile }],
      });
  
      if (existingEscort) {
        return res.status(400).json({ message: 'Email or mobile already exists' });
      }
  
      // Hash the password before saving it to the database
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Calculate age based on dob and current date
      const birthDate = new Date(dob);
      const currentDate = new Date();
      let age = currentDate.getFullYear() - birthDate.getFullYear();

      // Check if the birthday has already occurred this year
      if (
        currentDate.getMonth() < birthDate.getMonth() ||
        (currentDate.getMonth() === birthDate.getMonth() &&
          currentDate.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      const newEscort = new Escort({
        name,
        email,
        mobile,
        password: hashedPassword,
        email_otp: null,
        mobile_otp: null,
        dob,
        age,
        latitude: null,
        longitude: null,
        mobile_verified_at: null,
        email_verified_at: null,
        files,
        bio, 
        price, 
        city, 
        state, 
        pincode, 
        address,
        vendorId:userId,
        serviceIds:services
      });
  
      // Save the new customer to the database
      await newEscort.save();
  
      return res.status(201).json({ message: 'Escort created successfully' });
    } catch (error) {
      console.error('Error during customer signup:', error);
      return res.status(500).json({ message: 'Something went wrong' });
    }

};

const getAllEscorts = async (req, res) => {
    try {
      // Define filter options based on query parameters
      const filters = {};
  
      if (req.query.city) {
        filters.city = { $regex:req.query.city, $options: 'i' };
      }
  
      if (req.query.state) {
        filters.state = { $regex:req.query.state, $options: 'i' };
      }
  
      if (req.query.age) {
        filters.age = req.query.age;
      }
  
      if (req.query.name) {
        filters.name = { $regex: req.query.name, $options: 'i' }; // Case-insensitive name search
      }
  
      // Query escorts using the specified filters
      const escorts = await Escort.find(filters).select('-password').populate('serviceIds', 'name').lean(); // Convert the result to plain JavaScript objects

      // Fetch and attach ratings for each escort
      const escortsWithRatings = await Promise.all(
        escorts.map(async (escort) => {
          const ratings = await Rating.find({ escortId: escort._id }).populate('customerId', 'name');
          return {
            ...escort,
            ratings,
          };
        })
      );
  
      return res.status(200).json(escortsWithRatings);
    } catch (error) {
      console.error('Error while fetching escorts:', error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  };


  const getMyEscorts = async(req, res) =>{
    try {
        const authenticatedUser = req.user;

        const userId = authenticatedUser._id;
      // Define filter options based on query parameters
      const filters = {};

      filters.vendorId = userId;
  
      if (req.query.city) {
        filters.city = { $regex:req.query.city, $options: 'i' };
      }
  
      if (req.query.state) {
        filters.state = { $regex:req.query.state, $options: 'i' };
      }
  
      if (req.query.age) {
        filters.age = req.query.age;
      }
  
      if (req.query.name) {
        filters.name = { $regex: req.query.name, $options: 'i' }; // Case-insensitive name search
      }
  
      // Query escorts using the specified filters
      const escorts = await Escort.find(filters).select('-password');
  
      return res.status(200).json(escorts);
    } catch (error) {
      console.error('Error while fetching escorts:', error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  };

  

  const updateEscort = async (req, res) => {
    const escortId = req.params.id;
  
    try {
      const {
        name,
        email,
        mobile,
        dob,
        bio,
        price,
        city,
        state,
        pincode,
        address,
        services,
        removeFiles, // Array of files to remove (e.g., by index)
      } = req.body;
      const files = req.s3FileUrls;
      // Find the existing escort by userId
      const existingEscort = await Escort.findById(escortId);
  
      if (!existingEscort) {
        return res.status(404).json({ message: 'Escort not found' });
      }
  
      // Update the escort's fields
      existingEscort.name = name;
      existingEscort.email = email;
      existingEscort.mobile = mobile;
      existingEscort.dob = dob;
      existingEscort.bio = bio;
      existingEscort.price = price;
      existingEscort.city = city;
      existingEscort.state = state;
      existingEscort.pincode = pincode;
      existingEscort.address = address;
      existingEscort.serviceIds = services;
  
      // Handle adding new files
      console.log(files);
      if (files && files.length > 0) {
        existingEscort.files = existingEscort.files.concat(files);
        console.log(existingEscort);
      }
  
      // Handle removing files
      if (removeFiles && removeFiles.length > 0) {
        existingEscort.files = existingEscort.files.filter(
          (file) => !removeFiles.includes(file._id.toString())
        );
      }
  
      // Save the updated escort to the database
      await existingEscort.save();
  
      return res.status(200).json({ message: 'Escort updated successfully' });
    } catch (error) {
      console.error('Error during escort update:', error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
};

const deleteEscorts = async(req, res) =>{
  const authenticatedUser = req.user;

  const userId = authenticatedUser._id;

  const escortId = req.params.id;

  try {
    const escort = await Escort.findByIdAndDelete({_id:escortId, vendorId:userId});
    if(!escort){ 
      return res.status(404).json({ message: 'Escort not found' });
    } 
    
    return res.status(200).json({ message: 'Escort Deleted Successfully' });
  } catch (error) {
    
    return res.status(500).json({ message: 'Something went wrong' });
  }
}
  

module.exports = {
    createEscort,
    getAllEscorts,
    getMyEscorts,
    updateEscort,
    deleteEscorts
}