const axios = require('axios');

const url = 'https://data.stib-mivb.brussels/api/explore/v2.1/catalog/datasets/vehicle-position-rt-production/records?select=vehiclepositions&limit=20';

const fetchData = async () => {
  try {
    const response = await axios.get(url);
    const data = response.data;

    if (!data || !data.records) {
      console.error('No records found in response data.');
      return;
    }

    const vehiclePositions = data.records.flatMap(record => JSON.parse(record.record.fields.vehiclepositions));

    // Filter results to find specific pointId
    const pointId = "8162"; // Replace with the desired pointId
    const filteredPositions = vehiclePositions.filter(pos => pos.pointId === pointId);

    if (filteredPositions.length > 0) {
      console.log(`Details for pointId ${pointId}:`, filteredPositions);
    } else {
      console.log(`No details found for pointId ${pointId}`);
    }

  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
};

fetchData();
