import axios from 'axios';

const PermitService = {

    getById(id) {
        return axios.post('../api/permit/getById', { id: id });
    },

    update(permit) {
        return axios.post('../api/permit/update', { permit: permit }, { withCredentials: true });
    },

    
    /**
     * Сохраняет разрешение и изменяет его статус
     *
     * @param {*} permit Разрешение
     * @param {*} status Статус
     * @returns
     */
    changeStatus(permit, status) {
        return axios.post('../api/permit/changeStatus', { permit: permit, status: status }, { withCredentials: true });
    },

    getAllStatuses() {
        return axios.post('../api/permit/getAllPermitStatuses');
    },

    getAllEquipmentTypes() {
        return axios.post('../api/permit/getAllEquipmentTypes');
    },

    getAllWorkTypes() {
        return axios.post('../api/permit/getAllWorkTypes');
    },

    remove(id) {
        return axios.post('../api/permit/remove', { id: id });
    },
};

export default PermitService;