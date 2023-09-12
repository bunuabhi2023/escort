const Booking = require('../models/booking');
const Escort = require('../models/escort')

exports.bookEscort = async(req, res) =>{
    try {
        const authenticatedUser = req.customer;

        const customerId = authenticatedUser._id;
        const {escortId, serviceId, bookingdate, bookingTime, bookingHrs } = req.body;

        const escort = await Escort.findById(escortId);

        const vendorId = escort.vendorId;
        const price = escort.price;

        const existingBooking =  await Booking.findOne({escortId:escortId, bookingDate: bookingdate, bookingTime:bookingTime, bookingStatus:"accepted"});

        if(existingBooking){  
            return res.status(400).json({ message: 'This Escort is Already Booked At Selected Date and Time. Please Choose diffrent time slot to get service!' });
        }
        const newbooking = new Booking({
            escortId,
            customerId, 
            serviceId,
            bookingdate,
            bookingTime,
            bookingHrs,
            vendorId,
            amount : price,
        });

        await newbooking.save();
        await Escort.updateOne({ _id: escortId }, { $inc: { bookedCount: 1 } });
        return res.status(201).json({ message: 'You Booked Escort successfully' });
    } catch ({error}) {
        console.error(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}