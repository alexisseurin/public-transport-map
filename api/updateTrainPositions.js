const axios = require('axios');
const fs = require('fs');
const path = require('path');

const url = 'https://data.stib-mivb.brussels/api/explore/v2.1/catalog/datasets/vehicle-position-rt-production/exports/json?lang=en&timezone=Europe%2FBerlin';

const fetchData = async () => {
  try {
    const response = await axios.get(url);
    const data = response.data;

    const jsonPath = path.join(__dirname, '../public/data/vehicle-position-rt-production.json');
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
    console.log('Data updated:', new Date());
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
};

// Fetch data every 20 seconds
setInterval(fetchData, 20000);
fetchData();
