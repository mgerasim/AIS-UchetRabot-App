import axios from 'axios';

const MapService = {
    
    getRegions() {
        return axios.post('../api/map/getRegions');
    },

    getPipelinesMapData() {
        return axios.post('../api/map/getPipelinesMapData');
    },
};

export default MapService;