import axios from 'axios';

export async function getRegion() {
  try {
    const response = await axios.get('https://ipwho.is/');
    console.log(response.data); // Log the data for debugging
    return response.data.country_code;
    
  } catch (error) {
    console.error('Error fetching country code:', error);
    return null;
  }
}