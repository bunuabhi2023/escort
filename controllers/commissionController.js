const Commission = require('../models/commission');

exports.setCommission = async(req, res) =>{
    try {
        const {vendorId, commissionPercentage} = req.body;

        const commission = await Commission.findOne({vendorId:vendorId});
        if(commission){
            commission.commissionPercentage = commissionPercentage;
            commission.save();
            return res.status(400).json(commission);
        }

        const newCommission = new Commission({
            vendorId,
            commissionPercentage
        })

        const savedCommission = await newCommission.save();
        console.log(savedCommission); 
        res.json(savedCommission);
        
    } catch (error) {
        console.error(error); 
        return res.status(500).json({ error: 'Failed to create Service' });
        
    }
};

exports.getAllCommission = async(req, res) =>{
    try {
        const commissions = await Commission.find().populate('vendorId', 'name').exec();
        if(!commissions){
            return null;
        }
        return res.status(200).json(commissions);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create Service' });
    }
};

exports.getCommissionByVendor = async(req, res) =>{
    try {
        const vendorId = req.params.id;
        const commission = await Commission.findOne({vendorId:vendorId}).populate('vendorId', 'name').exec();
        if(!commission){
            return null;
        }
        return res.status(200).json(commission);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create Service' });
    }
}

