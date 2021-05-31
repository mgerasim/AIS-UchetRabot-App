<template>

<div class="full-size h-flex">

    <catalog-tree   v-if="maskCatalog != null"
                    :catalog-id="maskCatalog.Catalog.Id"
                    class="full-size" 
                    @select="selectedCatalogItem = $event"
                    :read-only="false"></catalog-tree>

        <div style="flex: 1 1 100%; margin-left: 4px;">
            <mpsa-aspt-mask-list 
                v-if="selectedCatalogItem != null && maskCatalog != null" 
                class="full-size" 
                :catalog-item-id="selectedCatalogItem.Id"
                :mask-catalog-id="maskCatalog.Id"
                :branch-id="branchId"
                :system="system">
            </mpsa-aspt-mask-list>
        </div>


</div>

</template>

<script lang="ts">

import { ref, computed, watch, defineComponent } from '@vue/composition-api';
import CatalogTree from '@/components/catalog/catalog-tree.vue';
import MaskService from '@/core/services/mask-service';
import MpsaAsptMaskList from '@/components/mask/manager/mpsa-aspt-mask-list.vue';

export default defineComponent({
    name: 'mpsa-masks-manager',
    components: {
        CatalogTree,
        MpsaAsptMaskList,
    },
    props: {
        branchId: { type: Number, required: true },
        system: { type: String, required: true, validator: value => ['MPSA', 'ASPT'].indexOf(value) !== -1 },
    },
    setup(props, context) {
        let maskCatalog = ref(null);
        let selectedCatalogItem = ref(null);

        watch(() => props.branchId, (value, prev) => { 
            loadCatalog();
        });

        function loadCatalog() {
            if(props.system == 'MPSA') {
                MaskService.getMaskCatalogForMpsa(props.branchId)
                    .then(response => {
                        if(response.data.HasError) throw response.data.ErrorMessage;
                        maskCatalog.value = response.data.Result;
                        selectedCatalogItem.value = null;
                    })
                    .catch(error => {
                        console.log(error);
                        alert(`Ошибка при получении данных: ${error}`);
                    });
            } else if(props.system == 'ASPT') {
                MaskService.getMaskCatalogForAspt(props.branchId)
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