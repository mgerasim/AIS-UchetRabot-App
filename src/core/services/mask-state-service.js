import axios from 'axios';

const MaskStateService = {
    getAllByJobIdAndVersion(jobId, version) {
        return axios.post('../api/maskState/GetAllByJobIdAndVersion', { jobId: jobId, version: version });
    },
};

export default MaskStateService;