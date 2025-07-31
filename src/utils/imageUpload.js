// utils/uploadAPI.js
import axios from 'axios';

export const uploadAPI = {
  uploadImage: async (file) => {
    try {
      // Validate file type
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        throw new Error('Invalid file type');
      }

      const formData = new FormData();
      formData.append('file', file, file.name); // Properly set name and MIME type

      const uploadResponse = await axios.post(
        'https://srv694651.hstgr.cloud/storage/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-api-key': 'ayzenn09876@'
          }
        }
      );

      return uploadResponse.data;
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  }
};
