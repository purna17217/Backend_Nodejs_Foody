const express = require('express');
const dotEnv= require('dotenv');
const mongoose = require('mongoose');
const vendorRoutes = require('./routes/vendorRoutes');
const bodyparser = require('body-parser');
const firmRoutes = require('./routes/firmRoutes');
const productRoutes = require('./routes/productRoutes');
const path = require('path');
const cors = require('cors');


const app = express()
const PORT= process.env.PORT || 8850;
dotEnv.config();

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("mongoose connected"))
.catch((error)=>console.log(error))

app.use(cors())
app.use(bodyparser.json());
app.use('/vendor',vendorRoutes);
app.use('/firm',firmRoutes);
app.use('/product',productRoutes);
app.use('/uploads',express.static('uploads'));
app.listen(PORT,()=>{
    console.log(`server started at ${PORT}`);
})
app.use('/',(req,res)=>{
    res.send("Hello Foody")
})
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });
  