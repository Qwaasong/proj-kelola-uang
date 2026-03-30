export const testApi = async () => {
  try {
    const response = await fetch('/api/user');
    const data = await response.json();
    console.log('API Response:', data);
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
