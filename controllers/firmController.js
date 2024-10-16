const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads/'); // Directory to store uploaded images
//     },
//     filename: function (req, file, cb) {
//       cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
//     }
//   });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      const uploadPath = 'uploads/';
      if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true }); // Create folder if it doesn't exist
      }
      cb(null, uploadPath); // Directory to store uploaded images
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
  }
});
  const upload = multer({ storage: storage });
  
  const addFirm = async(req, res)=>{
    try{
    const{firmname, area, category, region, offer}= req.body

    const image = req.file ? req.file.filename: undefined ;
    
    const vendor = await Vendor.findById(req.vendorId);
    console.log(vendor);
        if(!vendor){
            res.status(404).json({message: "Vendor not found"})
        }
        if(vendor.firm.length>0)
          {
           return res.status(400).json({message:"vendor can have only one firm"})
          }
    const firm = new Firm({
        firmname,
        area, 
        category, 
        region, 
        offer, 
        image, 
        vendor: vendor._id
    })
   const savedFirm = await firm.save();
   const firmId = savedFirm._id
   vendor.firm.push(savedFirm);
   await vendor.save();
   
    return res.status(200).json({message: "Firm added Scuccessfully",firmId})
}
catch(error){
 console.log(error);
 res.status(500).json({error: "Internal Server Error"})
}
}

const deleteFirmById = async(req, res)=>{
  try{
    const firmId = req.params.firmId;
    const deletedProduct = await Product.findByIdAndDelete(firmId);
    if(!deletedProduct)
    {
      return res.status(404).json({error: "No Product Found"});
    }
  }
  catch(error)
  {
    console.log(error);
    res.status(500).json({message: "Internal Server Error"})
  }
}
module.exports = {addFirm: [upload.single('image'), addFirm],deleteFirmById} 