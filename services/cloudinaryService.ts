const CLOUD_NAME = 'etoyjscu';
const UPLOAD_PRESET = 'urap_uploads';

export const uploadImageToCloudinary = async (imageUri: string): Promise<string> => {
  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: `upload_${Date.now()}.jpg`,
  } as unknown as Blob);
  formData.append('upload_preset', UPLOAD_PRESET);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to upload image');
  }

  return data.secure_url as string;
};
