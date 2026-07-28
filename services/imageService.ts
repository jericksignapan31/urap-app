import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/firebaseConfig';

export const uploadImageToStorage = async (imageUri: string): Promise<string> => {
  try {
    console.log('Starting image upload for URI:', imageUri);

    // Fetch the image
    const response = await fetch(imageUri);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }

    const blob = await response.blob();
    console.log('Blob created, size:', blob.size);

    // Create unique filename
    const timestamp = Date.now();
    const filename = `posts/${timestamp}_${Math.random().toString(36).substr(2, 9)}.jpg`;
    console.log('Uploading to filename:', filename);

    // Create storage reference and upload
    const storageRef = ref(storage, filename);
    const uploadResult = await uploadBytes(storageRef, blob);
    console.log('Upload result:', uploadResult);

    // Get download URL
    const downloadUrl = await getDownloadURL(storageRef);
    console.log('Download URL:', downloadUrl);
    return downloadUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
