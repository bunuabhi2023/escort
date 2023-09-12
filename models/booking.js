const mongoose = require("mongoose");

const bookings = new mongoose.Schema(
    {
        escortId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Escort',
            required:true,
        },
        customerId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required:true,
        },
        vendorId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required:true,
        },
        serviceId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',
            required:false,
        },
        bookingDate:{
            type:String,
            required:false,
        },
        bookingTime:{
            type: Date,
            required: true,
            get: (val) => {
              // This getter function extracts the time portion and returns it as a string
              return val ? val.toTimeString().slice(0, 8) : val;
            },
            set: (val) => {
              // This setter function sets the Date object to the beginning of the day
              // and then sets the time based on the provided string (HH:MM:SS)
              const timeParts = val.split(':');
              return new Date(0, 0, 0, timeParts[0], timeParts[1], timeParts[2]);
            },
        },
        bookingHrs:{
            
            type:String,
            required:false,
        },
        bookingStatus:{
            type:String,
            enum:["pending", "accepted",  "rejected", "completed", "canceled"],
            default: "pending"

        },
        amount:{
            type:String,
            required:false,
        },      
        razorpayPaymentId: {
            type:String,
            required:false,
            maxLength:255,
        },
        razorpayOrderId: {
            type:String,
            required:false,
            maxLength:255,
        },
        razorpaySignature: {
            type:String,
            required:false,
            maxLength:255,
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
module.exports = mongoose.model("Booking", bookings);