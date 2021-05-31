import axios from 'axios';

const BranchService = {
    
    getAll() {
        return axios.post('../api/branch/getAll');
    },

};

export default BranchService;