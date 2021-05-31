<template>

<div class="full-size h-flex">

    <catalog-tree   v-if="maskCatalog != null"
                    :catalog-id="maskCatalog.Catalog.Id"
                    class="full-size" 
                    @select="selectedCatalogItem = $event"
                    :read-only="false"></catalog-tree>

        <div style="flex: 1 1 100%; margin-left: 4px;">
            <sdku-mask-list 
                v-if="selectedCatalogItem != null && maskCatalog != null" 
                class="full-size" 
                :catalog-item-id="selectedCatalogItem.Id"
                :mask-catalog-id="maskCatalog.Id">
            </sdku-mask-list>
        </div>


</div>

</template>

<script lang="ts">

import { ref, computed, watch, defineComponent } from '@vue/composition-api';
import CatalogTree from '@/components/catalog/catalog-tree.vue';
import MaskService from '@/core/services/mask-service';
import SdkuMaskList from '@/components/mask/manager/sdku-mask-list.vue';

export default defineComponent({
    name: 'sdku-masks-manager',
    components: {
        CatalogTree,
        SdkuMaskList,
    },
    props: {
    },
    setup(props, context) {
        let maskCatalog = ref(null);
        let selectedCatalogItem = ref(null);

        function loadCatalog() {
            MaskService.getMaskCatalogForSdku()
                .then(response => {
                    if(response.data.HasError) throw response.data.ErrorMessage;
                    maskCatalog.value = response.data.Result;
                    selectedCatalogItem.value = null;
                })
                .catch(error => {
                    console.log(error);
                    alert(`Ошибка при получении данных: ${error}`);
                });
        }

        loadCatalog();

        return {
            maskCatalog,
            selectedCatalogItem,
        };
    }, 
})

</script>

<style lang="scss" scoped>

</style>