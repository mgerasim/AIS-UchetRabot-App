<template>

<div class="v-flex" style="height: 100%;">
    <div class="h-flex toolbar" style="flex: 0 0 auto;">
        <div  style="width: 250px;">
            <kendo-dropdownlist ref="branches"
                                :data-source="branches"
                                data-text-field="Name"
                                data-value-field="Id"
                                :value-primitive="true"
                                option-label="Выберите подразделение"
                                @select="selectedBranch = $event.dataItem"
                                @change="onDropListChange"
                                style="width: 100%;">
            </kendo-dropdownlist>
        </div>
        <div  style="width: 150px;">
            <kendo-dropdownlist ref="departments"
                                :data-source="departments"
                                data-text-field="Name"
                                data-value-field="Id"
                                :value-primitive="true"
                                option-label="Выберите отдел"
                                @select="selectedDepartment = $event.dataItem"
                                @change="onDropListChange"
                                style="width: 100%;">
            </kendo-dropdownlist>
        </div>
    </div>

    <!-- <div v-if="busy" class="busy">
        <busy-indicator name="permitTemplateCatalogBusy"></busy-indicator>
    </div> -->

    <div class="h-flex" style="margin-top: 8px; flex: 1 1 100%; min-height: 0;">
        <div style="height: 100%; flex: 0 0 400px;">
            <catalog-tree   v-if="permitTemplateCatalog != null"
                            :catalog-id="permitTemplateCatalog.Catalog.Id"
                            class="full-size" 
                            @select="selectedCatalogItem = $event"
                            :read-only="isSelector"></catalog-tree>
            <div v-else class="full-size content-center" style="padding: 0 8px; text-align: center; font-size: 1.2rem;">
                Для отображения каталога выберите подразделение и отдел
            </div>
        </div>
        <div style="flex: 1 1 100%; margin-left: 4px;">
            <permit-template-list 
                v-if="selectedCatalogItem != null && permitTemplateCatalog != null" 
                class="full-size" 
                :catalog-item-id="selectedCatalogItem.Id"
                :permit-template-catalog-id="permitTemplateCatalog.Id"
                :is-selector="isSelector"
                @select="$emit('select', $event)">
            </permit-template-list>
        </div>
    </div>
</div>

</template>

<script>

import Vue from 'vue';
import CatalogTree from '@/components/catalog/catalog-tree';
import PermitTemplateList from '@/components/permitTemplate/permit-template-list.vue';
import axios from 'axios';
import { mapState, mapMutations } from 'vuex';

export default {
    name: 'permit-template-catalog',
    components: {
        CatalogTree,
        PermitTemplateList,
    },
    props: {
        isSelector: { type: Boolean, default: false },
        branchId: { type: Number, default: null },
        departmentId: { type: Number, default: null },
    },
    data() {
        return {
            selectedBranch: null,
            selectedDepartment: null,
            permitTemplateCatalog: null,
            selectedCatalogItem: null,

            busy: false,
        };
    },
    computed: {
        isBranchSelected() {
            return this.selectedBranch != null && this.selectedBranch.Id != ''; 
        },

        isDepartmentSelected() {
            return this.selectedDepartment != null && this.selectedDepartment.Id != ''; 
        },

		...mapState({
            departments: state => state.departments,
            branches: state => state.branches,
        }),
    },
    methods: {
        loadCatalog() {
            if(this.selectedBranch == null || this.selectedDepartment == null) return;
            this.busy = true;
            axios.post('../api/permitTemplate/getPermitTemplateCatalogByBranchAndDepartment', { branchId: this.selectedBranch.Id, departmentId: this.selectedDepartment.Id })
                .then(response => {
                    if(response.data.HasError) throw response.data.ErrorMessage;
                    this.permitTemplateCatalog = response.data.Result;
                    this.selectedCatalogItem = null;
                    this.busy = false;
                })
                .catch(error => {
                    this.busy = false;
                    console.log(error);
                    alert(`Ошибка при получении данных: ${error}`);
                });
        },

        ...mapMutations([
            'setLastSelectedBranchId', 
            'setLastSelectedDepartmentId',
        ]),

        onDropListChange() {
            if(this.isBranchSelected && this.isDepartmentSelected) {
                this.loadCatalog();
            } else {
                this.permitTemplateCatalog = null;
                this.selectedCatalogItem = null;
            }

            if(this.selectedBranch != null) this.setLastSelectedBranchId(this.selectedBranch.Id);
            if(this.selectedDepartment != null) this.setLastSelectedDepartmentId(this.selectedDepartment.Id);
        },
    },
    created() {
        //данные уже в store, проставим фильтры, если они переданы снаружи
        if(this.branchId != null) {
            this.selectedBranch = this.branches.find(p => p.Id == this.branchId);
            Vue.nextTick(() => {
                this.$refs.branches.kendoWidget().select(p => p.Id == this.branchId);
            });
        }

        if(this.departmentId != null) {
            this.selectedDepartment = this.departments.find(p => p.Id == this.departmentId);
            Vue.nextTick(() => {
                this.$refs.departments.kendoWidget().select(p => p.Id == this.departmentId);
            });
        }

        if(this.branchId != null && this.departmentId != null) {
            this.loadCatalog();
        }
    },
}

</script>

<style lang="scss" scoped>

.toolbar {
    & > * {
        margin-right: 8px;
    }
}

</style>