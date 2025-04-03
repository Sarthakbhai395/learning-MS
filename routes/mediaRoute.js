const express = require('express');
const router = express.Router();
const { upload } = require('../utils/multer'); // Import correctly
const { uploadMedia } = require('../utils/cloudinary');

router.post('/upload-video', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    // Upload to Cloudinary
    const result = await uploadMedia(req.file.path);

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error uploading file',
      error: error.message,
    });
  }
});

module.exports = router;