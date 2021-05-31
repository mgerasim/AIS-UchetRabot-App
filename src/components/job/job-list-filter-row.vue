<template>

<div class="filter-row">

    <div v-if="showDateFilter" style="width: 250px;">
        <daterange-picker 
            class="k-textbox"
            :startDate="startDate"
            :endDate="endDate"
            @apply="applyPeriod"
            @clear="clearPeriod"
            style="width: 100%;">
        </daterange-picker>
    </div>

    <!-- <div style="width: 220px;">
        <ext-dropdown-treeview  :data-source="approvalBranches"
                                data-text-field="Name"
                                data-value-field="Id"
                                @select="onApprovalBranchesSelect"
                                default-label="Уровень утверждения">
        </ext-dropdown-treeview>
    </div> -->

    <div style="width: 220px;">
        <ext-dropdown-treeview  :data-source="branches"
                                data-text-field="Name"
                                data-value-field="Id"
                                @select="onBranchesSelect"
                                default-label="Участок производства работ">
        </ext-dropdown-treeview>

        <!-- <kendo-multiselect  v-model="branchesValue"
                            :data-source="branches"
                            data-text-field="Name"
                            data-value-field="Id"
                            placeholder="Участок производства работ"
                            :filter="'contains'">
        </kendo-multiselect> -->
    </div>

    <div>
        <kendo-dropdownlist ref="departments"
                            :data-source="departments"
                            data-text-field="Name"
                            data-value-field="Id"
                            :value="department != null ? department.Id : null"
                            @select="department = $event.dataItem">
        </kendo-dropdownlist>
    </div>

    <div>
        <kendo-dropdownlist ref="statuses"
                            :data-source="statuses"
                            data-text-field="DisplayName"
                            data-value-field="Value"
                            :value="status != null ? status.Value : null"
                            @select="status = $event.dataItem">
        </kendo-dropdownlist>
    </div>

    <!-- <div>
        <kendo-numerictextbox 
            v-model.number="kmStart"
            :decimals="3"
            :format="'#.000 км'"
            :min="0"
            :round="false"
            :spinners="true"
            placeholder="Начало, км">
        </kendo-numerictextbox>
    </div>

    <div>
        <kendo-numerictextbox 
            v-model.number="kmEnd"
            :decimals="3"
            :format="'#.000 км'"
            :min="0"
            :round="false"
            :spinners="true"
            placeholder="Конец, км">
        </kendo-numerictextbox>
    </div> -->

    <input type="text" v-model="regNumber" class="k-textbox" placeholder="Номер разрешения" style="width: 160px;" />
    <input type="text" v-model="description" class="k-textbox" placeholder="подготовка ИЛИ обслуживание" style="width: 240px;" />

    <button class="k-button" @click="clearFilter"><fa icon="trash"></fa>&nbsp;Очистить</button>
    <button class="k-button k-primary" @click="applyFilter"><fa icon="filter"></fa>&nbsp;Применить</button>
</div>

</template>

<script>

import axios from 'axios';
import Vue from 'vue';
import DaterangePicker from '@/components/shared/daterange-picker';
import ExtDropdownTreeview from '@/components/shared/ext-dropdown-treeview';

export default {
    name: 'job-list-filter-row',
    components: {
        DaterangePicker,
        ExtDropdownTreeview,
    },
    props: {
        showDateFilter: {
            type: Boolean,
            required: true, 
        },
    },
    data() {
        return {
            branches: [],
            departments: [],
            statuses: [],
            approvalBranches: [],

            department: null,
            status: null,
            kmStart: null,
            kmEnd: null,
            regNumber: null,
            description: null,
            approvalBranchesValue: [],
            branchesValue: [],
            startDate: null,
            endDate: null,
        };
    },
    methods: {
        loadInitData() {
            Promise.all([
                axios.post('../api/department/getAll'),
                axios.post('../api/job/getAllJobStatuses'),
                axios.post('../api/branch/getAllApproval'),
                axios.post('../api/branch/getAll'),
            ])
            .then(responses => {
                let departmentsResponse = responses[0];
                let statusesResponse = responses[1];
                let approvalBranchesResponse = responses[2];
                let branchesResponse = responses[3];

                if(departmentsResponse.data.HasError) throw departmentsResponse.data.ErrorMessage;
                if(statusesResponse.data.HasError) throw statusesResponse.data.ErrorMessage;
                if(approvalBranchesResponse.data.HasError) throw approvalBranchesResponse.data.ErrorMessage;
                if(branchesResponse.data.HasError) throw branchesResponse.data.ErrorMessage;

                this.departments = [ { Id: null, Name: '-= Все отделы =-' }, ...departmentsResponse.data.Result ];
                this.statuses = [ { Value: null, DisplayName: '-= Все статусы =-' }, ...statusesResponse.data.Result ];
                this.approvalBranches = approvalBranchesResponse.data.Result;
                this.branches = branchesResponse.data.Result;

                Vue.nextTick(() => {
                    this.$refs.departments.kendoWidget().select(p => p.Id == null);
                    this.$refs.statuses.kendoWidget().select(p => p.Value == null);
                });
            })
            .catch(error => {
                console.log(error);
                alert(error);
            });
        },

        getFilterData() {
            return {
                departmentId: this.department != null ? this.department.Id : null,
                status: this.status != null ? this.status.Value : null,
                kmStart: this.kmStart,
                kmEnd: this.kmEnd,
                regNumber: this.regNumber,
                description: this.description, 
                approvalBranchIds: this.approvalBranchesValue,
                branchIds: this.branchesValue,
                startDate: this.startDate,
                endDate: this.endDate,
            }
        },

        clearFilter() {
            this.department = null;
            this.status = null;
            this.kmStart = null;
            this.kmEnd = null;
            this.regNumber = null;
            this.description = null;
            this.approvalBranchesValue = [];
            this.branchesValue = [];
            this.startDate = null;
            this.endDate = null;

            this.applyFilter();
        },

        applyFilter() {
            this.$emit('apply', this.getFilterData());
        },

        getTagTemplate(e) {
            //var self = this;
            var template = `
                <span>{{ tagString }}</span>
            `;
            var itemTemplate = Vue.component('tag', {
                template: template,
                data() {
                    return {
                        templateArgs: {},
                    }
                },
                computed: {
                    tagString() {
                        if(this.templateArgs == null || this.templateArgs.dataItems == null ||  this.templateArgs.dataItems.length == 0) return null;
                        let result = '';
                        for(let dataItem of this.templateArgs.dataItems) {
                            if(result != '') result += ', ';
                            result += dataItem.Name;
                        }
                        return result;
                    },
                },
                methods: {
                }
            });

            return {
                template: itemTemplate,
                templateArgs: e
            }
        },

        applyPeriod({ startDate, endDate }) {
            this.startDate = startDate;
            this.endDate = endDate;
        },

        clearPeriod() {
            this.startDate = null;
            this.endDate = null;
        },

        getItemRender() {
            return Vue.component('itemRender', {
                props: {
                    id: String,
                    index: Number,
                    dataItem: [Object, String, Number],
                    textField: String,
                    focused: Boolean,
                    selected: Boolean,
                },
                template: `<li class="k-item" @click="handleClick">
                                <span>
                                    <label class="k-checkbox-label" style="display: inline; white-space: nowrap;">
                                        <input type="checkbox" class="k-checkbox" />
                                        {{ dataItem[textField] }}
                                    </label>
                                </span>
                            </li>`,
                methods: {
                    handleClick: function(e) {
                        //this.$emit('click', e);
                    }
                }
            });
        },

        getValueRender() {
            return Vue.component('valueRender', {
                props: {
                    currentValue: String
                },
                template: ` <span class="k-input">
                                <span :style="{
                                    display: 'inline-block',
                                    background: '#333',
                                    color: '#fff',
                                    borderRadius: '50%',
                                    width: '18px',
                                    height: '18px',
                                    textAlign: 'center',
                                    overflow: 'hidden'}">
                                    {{currentValue}}
                                </span>
                                <span>&nbsp;  {{ currentValue.Name }} </span>
                            </span>`
            });
        },

        onApprovalBranchesSelect(selectedIds) {
            this.approvalBranchesValue = selectedIds;
        },

        onBranchesSelect(selectedIds) {
            this.branchesValue = selectedIds;
        },
    },
    created() {
        this.loadInitData();
    },
}
</script>

<style lang="scss" scoped>

.filter-row {
    display: flex;
    flex-flow: row nowrap;

    & > * {
        margin-right: 8px;
    }
}

</style>