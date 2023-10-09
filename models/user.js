const mongoose = require("mongoose");

const users = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            maxLength:255,
        },
        email: {
            type:String,
            required:true,
            maxLength:255,
        },
        password: {
            type:String,
            required:true,
            maxLength:255,
        },
        email_otp: {
            type:String,
            required:false,
            maxLength:50,
        },
        mobile: {
            type:String,
            required:true,
            maxLength:50,
        },
        mobile_otp: {
            type:String,
            required:false,
            maxLength:50,
        },
        dob: {
            type:Date,
            required:false,
        }, 
        age: {
            type:Number,
            required:false,
        },
        bio: {
            type:String,
            required:false,
            maxLength:500,
        },
        price: {
            type:String,
            required:false,
            maxLength:50,
        },
        otp: {
            type:String,
            required:false,
            maxLength:50,
        },
        // latitude: {
        //     type:String,
        //     required:false,
        //     maxLength:255,
        // },
        // longitude: {
        //     type:String,
        //     required:false,
        //     maxLength:255,
        // },
        location: {
            type: {
              type: String,
              enum: ["Point"], // Specify that it's a GeoJSON Point
              required: false,
            },
            coordinates: {
              type: [Number],
              required: false,
              validate: {
                validator: function (value) {
                  // Ensure coordinates are valid [longitude, latitude] pairs
                  return Array.isArray(value) && value.length === 2 && isFinite(value[0]) && isFinite(value[1]);
                },
                message: "Invalid coordinates",
              },
            },
        },
        mobile_verified_at: {
            type:Date,
            required:false,
        },
        email_verified_at: {
            type:Date,
            required:false,
        },
        status: {
            type:String,
            enum:["inactive", "active", "rejected"],
            default:"inactive"
        },
        files:[{
            Bucket:{
                type:String,
                required:false,
                maxLength:255,
            },
            Key:{
                type:String,
                required:false,
                maxLength:255,
            },
            Url:{
                type:String,
                required:false,
                maxLength:255,
            }
        }],
        role:{
            type:String,
            enum:["Admin", "Escort"],
            default:"Escort"
        },
        city:{
            type:String,
            required:false,
            maxLength:255,
        },
        state:{
            type:String,
            required:false,
            maxLength:255,
        },
        pincode:{
            type:String,
            required:false,
            maxLength:50,
        },
        address:{
            type:String,
            required:false,
            maxLength:255,
        },
        serviceIds:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',
            required:false,
        }],
        deviceId:{
            type:String,
            required:false,
            maxLength:800,
        },
        bookedCount: {
            type:Number,
            required:false,
        },
        createdAt:{
            type:Date,
            required:true,
            default:Date.now(),
        },
        updatedAt:{
            type:Date,
            required:true,
            default:Date.now(),
        }
    }
);
users.index({ location: "2dsphere" });
module.exports = mongoose.model("User", users);