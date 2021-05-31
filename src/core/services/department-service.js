import axios from 'axios';

const DepartmentService = {
    
    getAll() {
        return axios.post('../api/department/getAll');
    },

};

export default DepartmentService;