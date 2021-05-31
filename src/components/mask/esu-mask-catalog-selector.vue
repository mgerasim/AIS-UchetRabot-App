<!-- 
    Выбор каталога маскируемых защит ЕСУ = САУ + СДКУ, а также 
    в диалогах формирования шаблонов и разрешений 
-->

<template>

<div class=" v-flex">
    <div class="full-size h-flex" style="margin-top: 8px; flex: 1 1 100%; min-height: 0;">
        <div class="v-flex" style="height: 100%; flex: 0 0 400px;">
            <div class="toolbar h-flex">
                <button class="k-button" :class="{ 'k-primary': selectedMaskCatalog != null && selectedMaskCatalog == maskCatalogs.sau }" @click="selectMaskCatalog(maskCatalogs.sau)" title="Защиты САУ" style="flex: 1;">
                    САУ
                </button>
                <button class="k-button" :class="{ 'k-primary': selectedMaskCatalog != null && selectedMaskCatalog == maskCatalogs.sdku }" @click="selectMaskCatalog(maskCatalogs.sdku)" title="Защиты СДКУ" style="flex: 1;">
                    СДКУ
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
    name: 'esu-mask-catalog-selector',
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
            maskCatalogs: {
                sau: null,
                sdku: null,
            },
            selectedMaskCatalog: null,
            selectedCatalogItem: null,
        };
    },
    computed: {
    },
    methods: {
        loadCatalogs() {
            Promise.all([
                MaskService.getMaskCatalogForSau(),
                MaskService.getMaskCatalogForSdku(),
            ])
                .then(responses => {
                    const sauResponse = responses[0];
                    const sdkuResponse = responses[1];
                    if(sauResponse.data.HasError) throw sauResponse.data.ErrorMessage;
                    if(sdkuResponse.data.HasError) throw sdkuResponse.data.ErrorMessage;
                    this.maskCatalogs.sau = sauResponse.data.Result;
                    this.maskCatalogs.sdku = sdkuResponse.data.Result;
                    this.selectedMaskCatalog = sauResponse.data.Result;
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