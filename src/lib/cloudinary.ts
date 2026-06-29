import { v2 as cloudinary } from "cloudinary";

export function getCloudinaryClientConfig() {
  return {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "",
    uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "",
    uploadUrl: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      ? `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`
      : "",
  };
}

export function getCloudinaryServerConfig() {
  return {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "",
    apiKey: process.env.CLOUDINARY_API_KEY ?? "",
    apiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
    folder: process.env.CLOUDINARY_UPLOAD_FOLDER ?? "mybio",
  };
}

export function getCloudinaryConfig() {
  return {
    ...getCloudinaryClientConfig(),
    ...getCloudinaryServerConfig(),
  };
}

export function isCloudinaryUploadEnabled() {
  const config = getCloudinaryClientConfig();

  return Boolean(config.cloudName && config.uploadPreset);
}

export function isCloudinaryAdminEnabled() {
  const config = getCloudinaryServerConfig();

  return Boolean(config.cloudName && config.apiKey && config.apiSecret);
}

export function isCloudinaryEnabled() {
  return isCloudinaryUploadEnabled() || isCloudinaryAdminEnabled();
}

export function configureCloudinary() {
  const config = getCloudinaryServerConfig();

  if (!isCloudinaryAdminEnabled()) {
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

export function getAvatarStrategyLabel() {
  if (isCloudinaryUploadEnabled()) {
    return "Upload direto de avatar pronto via Cloudinary; a URL manual continua disponível como fallback.";
  }

  if (isCloudinaryAdminEnabled()) {
    return "Operações server-side do Cloudinary estão prontas; defina o upload preset público para habilitar envio direto no navegador.";
  }

  return "Cloudinary ainda não foi publicado neste ambiente; o formulário continua aceitando URL manual sem quebrar a experiência.";
}
