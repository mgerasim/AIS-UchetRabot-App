import axios from 'axios';
import ISimpleMask from '../types/mask/simpleMask';
import IFullMask from '../types/mask/fullMask';
import { IApiResult } from '../types/apiResult';
import IEnumModel from '../types/enumModel';

const MaskService = {

    /**
     * Возвращает каталог маскирований МПСА для подразделения (НПС)
     * 
     * @param {Number} branchId Идентификатор подразделения
     * @returns {Promise}
     */
    getMaskCatalogForMpsa(branchId) {
        return axios.post('../api/mask/getMaskCatalogByBranch', { branchId: branchId });
    },

    /**
     * Возвращает каталог маскирований АСПТ для подразделения (НПС)
     * 
     * @param {Number} branchId Идентификатор подразделения
     * @returns {Promise}
     */
    getMaskCatalogForAspt(branchId) {
        return axios.post('../api/mask/getMaskCatalogForAsptByBranch', { branchId: branchId });
    },

    /**
     * Возвращает каталог маскирований САУ
     * 
     * @returns {Promise}
     */
    getMaskCatalogForSau() {
        return axios.post('../api/mask/getMaskCatalogForSau');
    },

    /**
     * Возвращает каталог маскирований СДКУ
     * 
     * @returns {Promise}
     */
    getMaskCatalogForSdku() {
        return axios.post('../api/mask/getMaskCatalogForSdku');
    },

    /**
     * Возвращает каталог маскирований ЦСПА
     * 
     * @returns {Promise}
     */
    getMaskCatalogForCspa() {
        return axios.post('../api/mask/getMaskCatalogForCspa');
    },

    /**
     * Возвращает все маскирования, привязанные к элементу каталога
     *
     * @param {Number} catalogItemId Идентификатор элемента каталога
     * @param {Boolean} includeRemoved Включая удаленные
     * @returns {Promise}
     */
    getAllByCatalogItem(catalogItemId, includeRemoved = false) {
        return axios.post(`../api/mask/getAllByCatalogItem`, { catalogItemId: catalogItemId, includeRemoved: includeRemoved });
    },
    
    /**
     * Помечает защиту как удаленную
     *
     * @param {*} id Идентификатор защиты
     */
    remove(id): Promise<IApiResult<ISimpleMask>> {
        return axios.post(`../api/mask/remove`, { id: id })
                    .then(response => response.data);
    },

    /**
     * Восстанавливает защиту
     *
     * @param {*} id Идентификатор защиты
     */
    restore(id): Promise<IApiResult<ISimpleMask>> {
        return axios.post(`../api/mask/restore`, { id: id })
                    .then(response => response.data);
    },

    /**
     * Возвращает защиту по Id
     *
     * @param {*} id Идентификатор защиты
     */
    getById(id): Promise<IApiResult<IFullMask>> {
        return axios.post(`../api/mask/getById`, { id: id })
                    .then(response => response.data);
    },

    /**
     * Создает защиту
     *
     * @param {*} mask Создаваемая защита
     */
    create(mask: IFullMask): Promise<IApiResult<IFullMask>> {
        return axios.post(`../api/mask/create`, { mask: mask })
                    .then(response => response.data);
    },

    /**
     * Изменяет защиту
     *
     * @param {*} mask Изменяемая защита
     */
    update(id: number, mask: IFullMask): Promise<IApiResult<IFullMask>> {
        return axios.post(`../api/mask/update`, { id: id, mask: mask })
                    .then(response => response.data);
    },

    getAllMaskTypes(): Promise<IApiResult<IEnumModel>> {
        return axios.post(`../api/mask/getAllMaskTypes`).then(response => response.data);
    },

    getAllMaskSystems(): Promise<IApiResult<IEnumModel>> {
        return axios.post(`../api/mask/getAllMaskSystems`).then(response => response.data);
    },

    getAllMaskSourceEngines(): Promise<IApiResult<IEnumModel>> {
        return axios.post(`../api/mask/getAllMaskSourceEngines`).then(response => response.data);
    },
};

export default MaskService;