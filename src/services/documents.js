import axios from 'axios';

const API_URL = 'http://localhost:5002/api/documents';

const documents = {
    // List all documents
    list: async () => {
        const response = await axios.get(API_URL);
        return response.data;
    },

    // Upload a new document
    upload: async (formData) => {
        const response = await axios.post(`${API_URL}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Update a document's metadata
    update: async (id, data) => {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data;
    },

    // Delete a document
    delete: async (id) => {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    },

    // Get download URL
    getDownloadUrl: (id) => {
        return `${API_URL}/${id}/download`;
    }
};

export default documents;
