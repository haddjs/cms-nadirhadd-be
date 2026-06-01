import { Request, Response } from "express"
import cloudinary from '../config/cloudinary';

const uploadTestController = async (req: Request, res: Response) => {
    if (req.file) {
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: "image" }, (error, uploadResult) => {
                if (error) {
                    return reject(error);
                }
                return resolve(uploadResult);
            }).end(req.file?.buffer);

        })
        res.status(200).json({ message: "File upload successfully!", url: result })
    } else {
        res.status(400).json({ error: "No file uploaded" })
    }
}

export { uploadTestController }