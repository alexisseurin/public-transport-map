import axios from 'axios';

const dataUrl = import.meta.env.VITE_DATA_URL as string;

if (!dataUrl) {
  console.error('VITE_DATA_URL is not defined');
} else {
  //console.log('Using data URL:', dataUrl);
}

const fetchData = async () => {
  try {
    //console.log('Fetching data from URL:', dataUrl);
    const response = await axios.get(dataUrl);
    const data = response.data;

    if (typeof data !== 'object') {
      throw new Error('Data is not an object');
    }

    //console.log('Data fetched:', data);
    // Here you can update your application state with the new data
  } catch (error) {
    console.error('Error fetching data:', (error as Error).message);
    console.error('Error details:', error);
  }
};

// Fetch data every 12 seconds
setInterval(fetchData, 12000);
fetchData();
