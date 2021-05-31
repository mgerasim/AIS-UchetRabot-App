<template>
    <div class="no-select" style="height: 100%;">

        <Grid :style="{height: '100%'}"
            :data-items="items"
            :columns="columns"
            @change="change"
            @remove="remove"
            :sortable="true"
            :sort= "sort"
            :pageable="true"
            :skip="skip"
            :take="take"
            :total="total"
            @pagechange="onPageChange"
            @sortchange="onSortChange"
            @rowclick="onRowClick">

            <grid-toolbar>
                <div class="toolbar">

                    <div style="width: 250px;">
                        <kendo-dropdownlist ref="branch"
                                            :data-source="branches"
                                            data-text-field="Name"
                                            data-value-field="Id"
                                            :value-primitive="true"
                                            @select="selectedBranch = $event.dataItem"
                                            @change="onDropListChange"
                                            style="width: 100%;">
                        </kendo-dropdownlist>
                    </div>

                    <kendo-dropdownlist ref="department"
                                        :data-source="departments"
                                        data-text-field="Name"
                                        data-value-field="Id"
                                        :value-primitive="true"
                                        @select="selectedDepartment = $event.dataItem"
                                        @change="onDropListChange"
                                        style="margin-left: 16px;">
                    </kendo-dropdownlist>

                    <button type='button' v-on:click='onCreatePersonCommand' class='k-button k-button-icontext k-grid-add' style="margin-left: 16px;">
                        <fa icon="plus"></fa>&nbsp;Добавить нового сотрудника
                    </button>
                </div>
            </grid-toolbar>

            <template v-slot:boolTemplate="{props, listeners}">
                <td :class="props.className">
                    <fa v-if="props.dataItem[props.field]" icon="check" />
                </td>
            </template>

        </Grid>

        <action-request ref="actionRequest" name="personListRequest"></action-request>

    </div>
</template>

<script>

import Vue from 'vue';
import axios from 'axios';
import PersonEditor from '@/components/person/person-editor.vue';
import ActionRequest from '@/components/shared/action-request';
import GridCommandCell from '@/components/shared/grid-command-cell.vue';
import PersonService from '@/core/services/person-service';
import DepartmentService from '@/core/services/department-service';
import BranchService from '@/core/services/branch-service';
import { mapState } from 'vuex';

export default {
    name: 'person-list',
    components: {
        ActionRequest,
    },
    data() {
        return {
            skip: 0,
            take: 20,
            total: 0,
            sort: [
                { field: 'Name', dir: 'asc' }
            ],
            items: [],
            selectedBranch: null,
            selectedDepartment: null,
            columns: [
                { field: "Name", title: "Имя сотрудника", width: 220 },
                { field: "Position", title: "Должность", width: 'auto' },
                { field: "Phone", title: "МАТС", width: 220 },
                { field: "Fired", title: "Уволен", width: 80, cell: 'boolTemplate' },
                { field: "Branch.Name", title: "Подразделение", width: 220 },
                { field: "Department.Name", title: "Отдел", width: 100 },
                { title: " ", cell: GridCommandCell, width: 100 },
            ],

            clickTimeoutHandler: null,   
            clickCounter: 0, 
        }
    },
    computed: {
		...mapState({
            departments: state => [{ Id: null, Name: '-= Все отделы =-' }, ...state.departments],
            branches: state => [{ Id: null, Name: '-= Все подразделения =-' }, ...state.branches],
        }),
    },
    methods: {
        loadItems() {
            axios.post(`../api/person/read`, { request: { take: this.take, skip: this.skip, sort: this.sort, filter: this.getFilter() } })
            .then(response => {
                if(!response.data.HasError) {
                    this.items = response.data.Result.Data;
                    this.total = response.data.Result.Total;
                }
            })
            .catch(e => {
                console.log(e);
            });
        },

        loadInitData() {
            return Promise.all([
                BranchService.getAll(), 
                DepartmentService.getAll()])
            .then(responses => {

                let branchesResponse = responses[0];
                let departmentsResponses = responses[1];

                if(branchesResponse.data.HasError) throw branchesResponse.data.ErrorMessage;
                if(departmentsResponses.data.HasError) throw departmentsResponses.data.ErrorMessage;

                this.branches = [{ Id: null, Name: '-= Все подразделения =-' }, ...branchesResponse.data.Result];
                if(this.branches.length > 0) {
                    this.selectedBranch = this.branches[0];
                    Vue.nextTick(() => {
                        this.$refs.branch.kendoWidget().select(p => p.Id == this.branches[0].Id);
                    });
                }

                this.departments = [{ Id: null, Name: '-= Все отделы =-' }, ...departmentsResponses.data.Result];
                if(this.departments.length > 0) {
                    this.selectedDepartment = this.departments[0];
                    Vue.nextTick(() => {
                        this.$refs.department.kendoWidget().select(p => p.Id == this.departments[0].Id);
                    });
                }

                return Promise.resolve();
            })
            .catch(e => {
                console.log(e);
            });
        },

        getFilter() {
            let filter = {
                logic: 'and',
                filters: [
                ],
            };

            filter.filters.push({
                field: 'isChief',
                value: false,
                operator: 'eq',
            });

            if(this.selectedBranch && this.selectedBranch.Id != null) {
                filter.filters.push({
                    field: 'branchId',
                    value: this.selectedBranch.Id,
                    operator: 'eq',
                });
            }

            if(this.selectedDepartment && this.selectedDepartment.Id != null) {
                filter.filters.push({
                    field: 'departmentId',
                    value: this.selectedDepartment.Id,
                    operator: 'eq',
                });
            }

            return filter.filters.length > 0 ? filter : null;
        },

        change(dataItem) {
            this.$modals.open({
                component: PersonEditor,
                props: {
                    id: dataItem.Id,
                },
                onClose: person => {
                    this.refreshRow(person);
                },
            });
        },

        refreshRow(person) {
            let index = this.items.findIndex(p => p.Id == person.Id);
            if(index == -1) {
                this.items.push(person);
            } else {
                Vue.set(this.items, index, person);
            }
        },

        removeRow(person) {
            let index = this.items.findIndex(p => p.Id == person.Id);
            if(index != -1) {
                this.items.splice(index, 1);
            }
        },

        remove(dataItem) {
            this.$refs.actionRequest.request('Внимание',
                `Вы действительно хотите удалить сотрудника ${dataItem.Name}, ${dataItem.Title}?`,
                [{ name: 'no', title: 'Нет' }, { name: 'yes', title: 'Да' }],
                requestResult => {
                    if (requestResult == 'yes') {
                        PersonService.remove(dataItem.Id)
                            .then(response => {
                                if(response.data.HasError) throw response.data.ErrorMessage;
                                this.removeRow(dataItem);
                            })
                            .catch(e => {
                                console.log(e);
                            });
                    }
                }
            );
        },

        onPageChange: function(e) {
            this.skip = e.page.skip;
            this.take = e.page.take;
            this.loadItems();
        },

        onSortChange: function(e) {
            this.sort = e.sort;
            this.loadItems();
        },

        onCreatePersonCommand() {
            this.$modals.open({
                component: PersonEditor,
                props: {
                    id: null,
                    branchId: this.selectedBranch != null ? this.selectedBranch.Id : null,
                    departmentId: this.selectedDepartment != null ? this.selectedDepartment.Id : null,
                },
                onClose: person => {
                    this.refreshRow(person);
                },
            });
        },

        onDropListChange(e) {
            this.loadItems();
        },

        onRowClick (e) {
            clearTimeout(this.clickTimeoutHandler);
            if(this.clickCounter == 0) {
                this.clickCounter++;
                this.clickTimeoutHandler = setTimeout(() => {
                    this.clickCounter = 0;
                    this.clickTimeoutHandler = null;
                    this.onClick(e.dataItem);
                }, 300);
            } else if(this.clickCounter == 1) {
                this.clickCounter = 0;
                this.onDblClick(e.dataItem);
            }
        },

        onClick(dataItem) {
        },

        onDblClick(dataItem) {
            this.change(dataItem);
        },
    },
    created: function () {
        this.loadItems();
    },
}

</script>

<style scoped lang="scss">

.toolbar {
    display: flex;
}

</style>