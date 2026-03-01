import axios from 'axios';

export async function getRegion() {
  try {
    const response = await axios.get('https://ipwho.is/');
    return response.data.country_code;
  } catch (error) {
    console.error('Error fetching country code:', error);
    return null;
  }
}