<!-- 
    Выбор каталога маскируемых защит НПС = МПСА + АСПТ, а также 
    в диалогах формирования шаблонов и разрешений 
-->

<template>

<div class=" v-flex">
    <div class="full-size h-flex" style="margin-top: 8px; flex: 1 1 100%; min-height: 0;">
        <div class="v-flex" style="height: 100%; flex: 0 0 400px;">
            <div class="toolbar h-flex">
                <button class="k-button" :class="{ 'k-primary': selectedMaskCatalog != null && selectedMaskCatalog == maskCatalogs.mpsa }" @click="selectMaskCatalog(maskCatalogs.mpsa)" title="Защиты МПСА" style="flex: 1;">
                    МПСА
                </button>
                <button class="k-button" :class="{ 'k-primary': selectedMaskCatalog != null && selectedMaskCatalog == maskCatalogs.aspt }" @click="selectMaskCatalog(maskCatalogs.aspt)" title="Защиты АСПТ" style="flex: 1;">
                    АСПТ
                </button>
            </div>
            <catalog-tree   v-if="selectedMaskCatalog != null"
                            :catalog-id="selectedMaskCatalog.Catalog.Id"
                            class="full-size" 
                            @select="selectedCatalogItem = $event"
                            :read-only="true"></catalog-tree>
        </div>
        <div style="flex: 1 1 100%; margin-left: 4px;">
            <mask-list 
                v-if="selectedCatalogItem != null && selectedMaskCatalog != null" 
                class="full-size" 
                :catalog-item-id="selectedCatalogItem.Id"
                :mask-catalog-id="selectedMaskCatalog.Id"
                :is-selector="true"
                :selected-items="selectedItems"
                @select="$emit('select', $event)"
                @unselect="$emit('unselect', $event)">
            </mask-list>
        </div>
    </div>
</div>

</template>

<script>

import CatalogTree from '@/components/catalog/catalog-tree';
import MaskList from '@/components/mask/mask-list';
import MaskService from '@/core/services/mask-service';

export default {
    name: 'mpsa-mask-catalog-selector',
    components: {
        CatalogTree,
        MaskList,
    },
    props: {
        branchId: { type: Number, required: true },
        selectedItems: { type: Array, required: true }
    },
    watch: {
        branchId(newValue, oldValue) {
            this.loadCatalogs(newValue);
        }
    },
    data() {
        return {
            maskCatalogs: {
                mpsa: null,
                aspt: null,
            },
            selectedMaskCatalog: null,
            selectedCatalogItem: null,
        };
    },
    computed: {
    },
    methods: {
        loadCatalogs(branchId) {
            if(branchId == null) return;
            Promise.all([
                MaskService.getMaskCatalogForMpsa(branchId),
                MaskService.getMaskCatalogForAspt(branchId),
            ])
                .then(responses => {
                    const mpsaResponse = responses[0];
                    const asptResponse = responses[1];
                    if(mpsaResponse.data.HasError) throw mpsaResponse.data.ErrorMessage;
                    if(asptResponse.data.HasError) throw asptResponse.data.ErrorMessage;
                    this.maskCatalogs.mpsa = mpsaResponse.data.Result;
                    this.maskCatalogs.aspt = asptResponse.data.Result;
                    this.selectedMaskCatalog = mpsaResponse.data.Result;
                    this.selectedCatalogItem = null;
                })
                .catch(error => {
                    console.log(error);
                    alert(`Ошибка при получении данных: ${error}`);
                });
        },

        selectMaskCatalog(maskCatalog) {
            this.selectedMaskCatalog = maskCatalog;
        },
    },
    created() {
        this.loadCatalogs(this.branchId);
    },
}

</script>

<style lang="scss" scoped>

.toolbar {
    margin-bottom: 8px;
    & > *:not(:last-child) {
        margin-right: 8px;
    }
}

</style>