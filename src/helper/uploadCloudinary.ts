import cloudinary from "../config/cloudinary"

const uploadToCloudinary = async (buffer: Buffer): Promise<{secure_url: string, public_id: string}> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ resource_type: "image" }, (error, uploadResult) => {
            if (error) return reject(error);
            resolve(uploadResult as {secure_url: string, public_id: string});
        }).end(buffer);
    });
}

export { uploadToCloudinary }