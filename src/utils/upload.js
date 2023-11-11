const cloudinary = require('cloudinary')
const DatauriParser = require('datauri/parser')
const path = require('path')

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
const parser = new DatauriParser()

const uploadToCloudinary = (imageFile) => new Promise(async (resolve, reject) => {
    try {
        const file = parser.format(path.extname(imageFile.name).toString(), imageFile.data).content
        const result = await cloudinary.v2.uploader.upload(file, {
            folder: 'uploads',
            use_filename: true,
            unique_filename: false,
        })
        resolve(result.secure_url)
    } catch (error) {
        reject(error)
    }
})

module.exports = { uploadToCloudinary }