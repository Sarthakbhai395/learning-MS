const cloudinary = require('cloudinary').v2;
require("dotenv").config();

cloudinary.config({ 
    cloud_name: 'dlrgf8fku', 
    api_key: '489931641643831', 
    api_secret: 'ViTldJjf-zXJNKF3bTSuYou0VEA' // Click 'View API Keys' above to copy your API secret
});

exports.uploadMedia = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file,{
            resource_type: "auto",
        })
        return result
    }catch(error){
        console.log(error)
    }
}

//delete photos from cloduinary
exports.deleteMedia = async (public_id) => {
    try{
        const result = await cloudinary.uploader.destroy(public_id)
        return result
    }catch(error){
        console.log(error)
    }
}

//delete videos from cloudinary
exports.deleteVideo = async (public_id) => {
    try{
        const result = await cloudinary.uploader.destroy(public_id,{
            resource_type: "video"
        })
        return result
    }catch(err)
    {
        console.log(err)
    }
}