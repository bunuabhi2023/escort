const mongoose = require("mongoose");

const ratings = new mongoose.Schema(
    {
        customerId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: true,
        },
        escortId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Escort',
            required: true,
        },
        rating:{
            type:Number,
            required:true,
        },
        comment:{
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

module.exports = mongoose.model("Rating", ratings);