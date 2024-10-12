const express = require('express');
const firmController = require('../controllers/firmController');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();
router.post('/add-firm',verifyToken, firmController.addFirm);
router.get('/uploads/:imageName', (req, res)=>{
    // const imageName = req.params.imageName;
    // res.headersSent('Content-Type', 'image/jpeg');
    // res.sendFile(path.join(__dirname, '..', 'uploads', imageName));
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, '..', 'uploads', imageName);
    if (fs.existsSync(imagePath)) {
        res.setHeader('Content-Type', 'image/jpeg');
        res.sendFile(imagePath);
    } else {
        res.status(404).json({ message: 'Image not found' });
    }
});
router.delete('/:firmId', firmController.deleteFirmById);
module.exports = router;