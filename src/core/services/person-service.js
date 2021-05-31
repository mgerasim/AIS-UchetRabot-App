import axios from 'axios';

const PersonService = {
    
    getById(id) {
        return axios.post('../api/person/getById', { id: id });
    },

    update(person) {
        return axios.post('../api/person/update', { person: person });
    },

    remove(id) {
        return axios.post(`../api/person/remove`, { id: id });
    },

    getAllByBranchAndDepartment(branchId, departmentId) {
        return axios.post(`../api/person/getAllByBranchAndDepartment`, { branchId, departmentId });
    },
};

export default PersonService;