<!-- 
    Выбор каталога маскируемых защит ЦСПА, а также 
    в диалогах формирования шаблонов и разрешений 
-->

<template>

<div class=" v-flex">
    <div class="full-size h-flex" style="margin-top: 8px; flex: 1 1 100%; min-height: 0;">
        <div class="v-flex" style="height: 100%; flex: 0 0 400px;">
            <catalog-tree   v-if="maskCatalog != null"
                            :catalog-id="maskCatalog.Catalog.Id"
                            class="full-size" 
                            @select="selectedCatalogItem = $event"
                            :read-only="true"></catalog-tree>
        </div>
        <div style="flex: 1 1 100%; margin-left: 4px;">
            <mask-list 
                v-if="selectedCatalogItem != null && maskCatalog != null" 
                class="full-size" 
                :catalog-item-id="selectedCatalogItem.Id"
                :mask-catalog-id="maskCatalog.Id"
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
    name: 'cspa-mask-catalog-selector',
    components: {
        CatalogTree,
        MaskList,
    },
    props: {
        selectedItems: { type: Array, required: true }
    },
    watch: {
    },
    data() {
        return {
            maskCatalog: null,
            selectedCatalogItem: null,
        };
    },
    computed: {
    },
    methods: {
        loadCatalogs() {
            MaskService.getMaskCatalogForCspa()
                .then(response => {
                    if(response.data.HasError) throw response.data.ErrorMessage;
                    this.maskCatalog = response.data.Result;
                    this.selectedCatalogItem = null;
                })
                .catch(error => {
                    console.log(error);
                    alert(`Ошибка при получении данных: ${error}`);
                });
        },
    },
    created() {
        this.loadCatalogs();
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