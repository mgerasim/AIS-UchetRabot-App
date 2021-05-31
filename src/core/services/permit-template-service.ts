import axios from 'axios';
import IFullPermitTemplate from '@/core/types/permitTemplate/fullPermitTemplate';
import ISimplePermitTemplate from '@/core/types/permitTemplate/simplePermitTemplate';
import { IApiResult } from '@/core/types/apiResult';

const PermitTemplateService = {
    
    getById(id): Promise<IApiResult<IFullPermitTemplate>> {
        return axios.post('../api/permitTemplate/getPermitTemplateById', { id: id })
                    .then(response => response.data);
    },

    getPermitTemplateCatalogById(id) {
        return axios.post('../api/permitTemplate/getPermitTemplateCatalogById', { id: id });
    },

    updatePermitTemplate(permitTemplate: IFullPermitTemplate): Promise<IApiResult<IFullPermitTemplate>> {
        return axios.post('../api/permitTemplate/updatePermitTemplate', { model: permitTemplate }, { withCredentials: true })
                    .then(response => response.data);
    },

    removePermitTemplate(id: number): Promise<IApiResult<void>> {
        return axios.post('../api/permitTemplate/removePermitTemplate', { id: id })
                    .then(response => response.data);
    },

    getAllPermitTemplatesByCatalogItem(catalogItemId: number): Promise<IApiResult<ISimplePermitTemplate[]>> {
        return axios.post('../api/permitTemplate/getAllPermitTemplatesByCatalogItem', { catalogItemId: catalogItemId })
                    .then(response => response.data);
    },
};

export default PermitTemplateService;