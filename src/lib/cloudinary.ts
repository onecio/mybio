import { v2 as cloudinary } from "cloudinary";

export function getCloudinaryConfig() {
  return {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "",
    apiKey: process.env.CLOUDINARY_API_KEY ?? "",
    apiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
    uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "",
    folder: process.env.CLOUDINARY_UPLOAD_FOLDER ?? "mybio",
  };
}

export function configureCloudinary() {
  const config = getCloudinaryConfig();

  if (!config.cloudName || !config.apiKey || !config.apiSecret) {
    return null;
  }

  cloudinary.config({
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    api_secret: config.apiSecret,
    secure: true,
  });

  return cloudinary;
}
