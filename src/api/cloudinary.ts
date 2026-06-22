import axios from "axios";

// Cloudinary unsigned upload config. Overridable via env vars; falls back to the
// project's existing values so local dev keeps working without setup.
const CLOUD_NAME =
    process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "dvnwx89ao";
const UPLOAD_PRESET =
    process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || "cg4zfcut";

/**
 * Upload a single image file to Cloudinary and return its secure URL.
 * @param file - the image file from an <input type="file">
 * @returns the uploaded image's secure_url
 */
export const uploadImage = async (file: File): Promise<string> => {
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", UPLOAD_PRESET);

    const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
        form
    );

    return response.data.secure_url;
};
