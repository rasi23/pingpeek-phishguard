import axios from 'axios';

export const analyzeEmail = async (emailContent) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/analyze`, {
      raw_email: emailContent
    });
    return response.data;
  } catch (error) {
    console.error("Analysis error:", error);
    throw error;
  }
};

export const fetchEmails = async (limit = 10) => {
  return await axios.get(`${API_BASE_URL}/fetch-emails?limit=${limit}`);
};