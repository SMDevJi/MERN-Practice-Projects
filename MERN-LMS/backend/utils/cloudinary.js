import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


export const generateUploadSignature = (folder) => {
    const timestamp = Math.round(Date.now() / 1000);

    const signature = cloudinary.utils.api_sign_request(
        { timestamp, folder },
        process.env.CLOUDINARY_API_SECRET
    );

    return {
        timestamp,
        signature,
        apiKey: process.env.CLOUDINARY_API_KEY,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        folder,
    };
};


export const deleteImage = async (url) => {
    if (!url.includes("cloudinary")) return

    const afterUpload = url.split('/upload/')[1];
    const withoutVersion = afterUpload.replace(/^v\d+\//, '');
    const id = withoutVersion.substring(0, withoutVersion.lastIndexOf('.'));

    //console.log(id, url)
    try {
        const result = await cloudinary.uploader.destroy(id, { invalidate: true });
        //console.log(result)
        return result;
    } catch (error) {
        console.error('❌ Cloudinary Delete Error:', error);
        throw error;
    }
};
