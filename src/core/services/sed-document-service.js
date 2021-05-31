import axios from 'axios';

const SedDocumentService = {
    
    createDocument(permitId) {
        return axios.post('../api/permit/createSedDocument', { permitId: permitId });
    },

    updateDocument(permitId) {
        return axios.post('../api/permit/updateSedDocument', { permitId: permitId });
    },
    
};

export default SedDocumentService;