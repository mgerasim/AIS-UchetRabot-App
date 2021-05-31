<template>

<div style="height: 100%;">
    <permit-template-catalog :branchId="branchId" :departmentId="departmentId"></permit-template-catalog>
</div>

</template>

<script>

import PermitTemplateCatalog from '@/components/permitTemplate/permit-template-catalog';
import { mapState } from 'vuex';

export default {
    name: 'permit-templates-page',
    components: {
        PermitTemplateCatalog,
    },
    computed: {
        ...mapState({
            branchId: state => state.last.selectedBranchId || state.user.branchId,
            departmentId: state => state.last.selectedDepartmentId || state.user.departmentId,
        }),
    },
}
</script>

<style lang="scss" scoped>

</style>