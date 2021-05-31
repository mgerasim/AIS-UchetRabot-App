import axios from 'axios';

const JobService = {
    getJobByIdAndVersion(id, version) {
        return axios.post('../api/job/GetJobByIdAndVersion', { id: id, version: version });
    },
};

export default JobService;