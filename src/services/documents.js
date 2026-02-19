import axios from 'axios';

const API_URL = 'http://localhost:5002/api/documents';

const documents = {
    
    list: async () => {
        const response = await axios.get(API_URL);
        return response.data;
    },

    
    upload: async (formData) => {
        const response = await axios.post(`${API_URL}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    
    update: async (id, data) => {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data;
    },

    
    delete: async (id) => {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    },

    
    getDownloadUrl: (id) => {
        return `${API_URL}/${id}/download`;
    }
};

export default documents;
