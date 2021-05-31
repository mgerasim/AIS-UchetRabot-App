import axios from 'axios';

const UserService = {
    
    getCurrentUser() {
        return axios.post('../api/user/getCurrentUser');
    },

};

export default UserService;