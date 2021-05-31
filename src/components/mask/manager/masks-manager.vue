<template>

<div class="v-flex fill-size">
    <div class="toolbar">
        <button v-for="(system, index) in systems" 
                :key="'system_' + index" 
                :class="['k-button', system.key == currentSystem.key && 'k-primary']"
                @click="currentSystem = system">{{ system.name }}</button>
        <div v-if="currentSystem.needBranchSelect" style="width: 250px;">
            <dropdownlist       :data-source="branches"
                                data-text-field="Name"
                                data-value-field="Id"
                                v-model="currentBranch"
                                style="width: 100%;">
            </dropdownlist>
        </div>
    </div>
    <div class="content">
        <mpsa-aspt-masks-manager
            v-if="currentSystem.key == 'MPSA' && currentBranch != null"
            key="mpsa_mask_manager"
            :branchId="currentBranch.Id"
            system="MPSA">
        </mpsa-aspt-masks-manager>
        <mpsa-aspt-masks-manager
            v-if="currentSystem.key == 'ASPT' && currentBranch != null"
            key="aspt_mask_manager"
            :branchId="currentBranch.Id"
            system="ASPT">
        </mpsa-aspt-masks-manager>
        <sdku-masks-manager
            v-if="currentSystem.key == 'SDKU'">
        </sdku-masks-manager>
        <sau-masks-manager
            v-if="currentSystem.key == 'SAU'">
        </sau-masks-manager>
    </div>
</div>

</template>

<script lang="ts">

import { ref, computed, watch, defineComponent } from '@vue/composition-api';
import Dropdownlist from '@/components/shared/dropdownlist.vue';
import MpsaAsptMasksManager from '@/components/mask/manager/mpsa-aspt-masks-manager.vue';
import SdkuMasksManager from '@/components/mask/manager/sdku-masks-manager.vue';
import SauMasksManager from '@/components/mask/manager/sau-masks-manager.vue';
//import { mapGetters } from 'vuex';

export default defineComponent({
    name: 'masks-manager',
    components: {
        Dropdownlist,
        MpsaAsptMasksManager,
        SdkuMasksManager,
        SauMasksManager,
    },
    setup(props, context) {
        const systems = [
            { key: 'MPSA', name: 'МПСА', needBranchSelect: true, },
            { key: 'ASPT', name: 'АСПТ', needBranchSelect: true, },
            { key: 'SDKU', name: 'СДКУ', needBranchSelect: false, },
            { key: 'SAU', name: 'САУ', needBranchSelect: false, },
            { key: 'CSPA', name: 'ЦСПА', needBranchSelect: false, },
        ];
        let currentSystem = ref(systems[0]);

        const branches = computed(() => context.root.$store.state.branches);
        let currentBranch = ref(branches.value[0]);

        return {
            branches,
            currentBranch,
            systems,
            currentSystem,
        };
    },
})

</script>

<style lang="scss" scoped>

.toolbar {
    flex: 0 0 auto;
    display: flex;
    flex-flow: row nowrap;;

    & > *:not(:first-child) {
        margin-left: 16px;
    }
}

.content {
    flex: 1 1 100%;
    min-height: 0;
}

</style>