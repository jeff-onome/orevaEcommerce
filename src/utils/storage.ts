import { supabase } from '../supabaseClient';

/**
 * Converts a data URL to a Blob.
 * @param dataUrl The data URL string.
 * @returns A promise that resolves with the Blob.
 */
export const dataUrlToBlob = async (dataUrl: string): Promise<Blob> => {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return blob;
};

/**
 * Uploads an image file to a specified Supabase Storage path and returns its public URL.
 * @param {File | Blob} file - The image file or blob to upload.
 * @param {string} path - The destination folder in the storage bucket (e.g., 'products').
 * @returns {Promise<string>} The public URL of the uploaded image.
 */
export const uploadImage = async (file: File | Blob, path: string): Promise<string> => {
  const fileExt = file.type.split('/')[1];
  const fileName = `${path}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('images') // The bucket name is 'images' based on thesql.txt
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Error uploading image:', error);
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(data.path);

  return publicUrl;
};
