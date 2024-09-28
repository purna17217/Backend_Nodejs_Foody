const Product = require('../models/Product');
const multer = require('multer');
const Firm = require('../models/Firm');
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Directory to store uploaded images
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
    }
  });
  const upload = multer({ storage: storage });

  const addProduct = async(req, res)=>{
    try{
        const {productname, price, category, bestseller, description} = req.body;
        const image = req.file ? req.file.filename: undefined ;
        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);
        if(!firm)
        {
            return res.status(404).json({error: "No Firm Found"});
        }
        const product  = new Product({
            productname, 
            price, 
            category, 
            bestseller, 
            description,
            image,
            firm: firm._id
        })
        const savedProduct = await product.save();
        firm.products.push(savedProduct);
        await firm.save();
        res.status(200).json(savedProduct);
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({message: "Internal Server Error"})
    }
  }

    const getProductByFirm = async(req, res)=>{
      try{
        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);
        if(!firm)
        {
          return res.status(404).json({error: "No Firm Found"});
        }
        const restaurantName = firm.firmname;
        const products = await Product.find({firm: firmId});
        res.status(200).json({restaurantName, products});
      }
      catch(error){
        console.log(error);
        res.status(500).json({message: "Internal Server Error"})
      }
    }
    // const deleteProductById = async(req, res)=>{
    //   try{
    //     const productId = req.params.productId;
    //     const deletedProduct = await Product.findByIdAndDelete(productId);
    //     if(!deletedProduct)
    //     {
    //       return res.status(404).json({error: "No Product Found"});
    //     }
    //     else{
    //       console.log("Deleted Product");
    //     }
    //   }
    //   catch(error)
    //   {
    //     console.log(error);
    //     res.status(500).json({message: "Internal Server Error"})
    //   }
    // }

    const deleteProductById = async (req, res) => {
      try {
        const productId = req.params.productId;
        const deletedProduct = await Product.findByIdAndDelete(productId);
       
        if (!deletedProduct) {
          return res.status(404).json({ error: "No Product Found" });
        } else {
          console.log("Deleted Product");
          return res.status(200).json({ message: "Product deleted successfully" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    };

  module.exports = {addProduct: [upload.single('image'),addProduct], getProductByFirm, deleteProductById};