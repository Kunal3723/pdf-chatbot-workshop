import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    console.log(formData);
    const response = await axios.post(BASE_URL + '/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'userid': 'kunal456',
        },
    });

    return response.data.projectID;
};

export const sendMessage = async (userMessage, projectID) => {
    try {
        const response = await axios.post(BASE_URL + '/query', {
            query: userMessage,
            projectID: projectID,
        });
        return response.data;
    } catch (error) {
        throw new Error('Error sending message:', error);
    }
};