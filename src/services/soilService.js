import axios from 'axios';

// SoilGrids API base URL
const BASE_URL = 'https://rest.isric.org/soilgrids/v2.0/classification/query';

export const fetchSoilData = async (lat, lon) => {
    try {
        console.log(`Fetching soil data for ${lat}, ${lon}...`);

        // Fetch Classification (WRB)
        const res = await axios.get(`${BASE_URL}?lat=${lat}&lon=${lon}`);
        // Note: SoilGrids API structure is complex. We often get probabilities of soil classes.
        // For simple properties like pH and texture, we use the properties endpoint.

        // Properties endpoint
        const propsUrl = `https://rest.isric.org/soilgrids/v2.0/properties/query?lat=${lat}&lon=${lon}&property=phh2o&property=nitrogen&property=soc&depth=0-5cm&depth=0-30cm&value=mean`;

        const propsRes = await axios.get(propsUrl);
        const data = propsRes.data;

        // Process pH (phh2o) - stored as pH * 10
        const phLayer = data.properties.layers.find(l => l.name === 'phh2o');
        const phValue = phLayer ? phLayer.depths[0].values.mean / 10 : 7.0; // Default Neutral

        // Process Nitrogen (nitrogen) - stored as cg/kg (centigrams per kg)
        const nLayer = data.properties.layers.find(l => l.name === 'nitrogen');
        const nValue = nLayer ? nLayer.depths[0].values.mean / 100 : 0.1; // Default

        // Process Organic Carbon (soc) - g/kg
        const socLayer = data.properties.layers.find(l => l.name === 'soc');
        const socValue = socLayer ? socLayer.depths[0].values.mean / 10 : 1.2;

        return {
            ph: phValue.toFixed(1),
            nitrogen: nValue.toFixed(2) + '%',
            organicCarbon: socValue.toFixed(1) + '%',
            moisture: 'Estimating...', // SoilGrids doesn't give real-time moisture. We'll simulate or use Weather.
            type: res.data.wrb_class_name || 'Loam (Estimated)'
        };

    } catch (error) {
        console.error("SoilGrids API Error:", error);
        return {
            ph: '6.5',
            nitrogen: '0.15%',
            organicCarbon: '1.2%',
            moisture: '60%',
            type: 'Unknown'
        };
    }
};
