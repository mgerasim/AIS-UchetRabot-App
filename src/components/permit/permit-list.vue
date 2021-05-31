<template>
    <div class="no-select" style="height: 100%;">

        <div v-if="busy" class="busy">
            <busy-indicator name="permitListBusy"></busy-indicator>
        </div>


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

            <template v-slot:dateTemplate="{props, listeners}">
                <td :class="props.className">
                    {{ formatDate(props.dataItem[props.field]) }}
                </td>
            </template>

            <template v-slot:statusTemplate="{props, listeners}">
                <td :class="[props.className, ...getStatusClasses(props.dataItem.Status)]">
                    {{ props.dataItem.Status.DisplayName }}
                </td>
            </template>

            <grid-toolbar>
                <div class="toolbar">
                    <div class="toolbar-item" style="flex: 0 0 300px;">
                        <kendo-dropdownlist ref="branches"
                                            :data-source="branches"
                                            data-text-field="Name"
                                            data-value-field="Id"
                                            :value-primitive="true"
                                            @select="selectedBranch = $event.dataItem"
                                            @change="onDropListChange"
                                            style="width: 100%;">
                        </kendo-dropdownlist>
                    </div>

                    <div class="toolbar-item" style="flex: 0 0 250px;">
                        <kendo-dropdownlist ref="departments"
                                            :data-source="departments"
                                            data-text-field="Name"
                                            data-value-field="Id"
                                            :value-primitive="true"
                                            class="toolbar-item"
                                            @select="selectedDepartment = $event.dataItem"
                                            @change="onDropListChange"
                                            style="width: 100%;">
                        </kendo-dropdownlist>
                    </div>

                    <div class="toolbar-item" style="flex: 0 0 250px;">
                        <kendo-dropdownlist ref="statuses"
                                            :data-source="statuses"
                                            data-text-field="DisplayName"
                                            data-value-field="Value"
                                            :value-primitive="true"
                                            class="toolbar-item"
                                            @select="selectedStatus = $event.dataItem"
                                            @change="onDropListChange"
                                            style="width: 100%;">
                        </kendo-dropdownlist>
                    </div>

                    <button type='button' v-on:click='onCreatePermitCommand' class='k-button k-button-icontext k-grid-add'>
                        <fa icon="plus"></fa>&nbsp;Добавить новое разрешение
                    </button>

                    <div style="flex: 1 1 100%; min-width: 0;"></div>

                    <button type='button' @click='onRefreshCommand' class='k-button k-button-icontext k-grid-add'>
                        <fa icon="sync-alt"></fa>
                    </button>
                </div>
            </grid-toolbar>

        </Grid>

    </div>
</template>

<script>

import Vue from 'vue';
import axios from 'axios';
import PermitEditor from '@/components/permit/permit-editor.vue';
import moment from 'moment';
import PermitTemplateSelectDialog from '@/components/permitTemplate/permit-template-select-dialog';
import GridCommandCell from '@/components/shared/grid-command-cell';
import { mapState, mapMutations } from 'vuex';
import PermitService from '@/core/services/permit-service';
import { EventBus } from '@/core/event-bus';

export default {
    name: 'permit-list',
    components: {
    },
    data() {
        return {
            busy: false,
            skip: 0,
            take: 20,
            total: 0,
            sort: [
                { field: 'Date', dir: 'desc' }
            ],
            items: [],
            selectedBranch: null,
            selectedDepartment: null,
            selectedStatus: null,
            columns: [
                { field: "Name", title: "Наименование", width: 220 },
                { field: "Description", title: "Описание", width: 'auto' },
                { field: "Date", title: "Дата", width: 220, cell: 'dateTemplate' },
                { field: "Number", title: "Номер", width: 220 },
                { field: "Branch.Name", title: "Подразделение", width: 220 },
                { field: "Department.Name", title: "Отдел", width: 220 },
                { field: "Status", title: "Статус", width: 150, cell: 'statusTemplate' },
                { title: " ", cell: GridCommandCell, width: 100 },
            ],


            clickTimeoutHandler: null,   
            clickCounter: 0, 
        }
    },
    computed: {
		...mapState({
            branches: state => [{ Id: null, Name: '-= Все подразделения =-' }, ...state.branches],
            departments: state => [{ Id: null, Name: '-= Все отделы =-' }, ...state.departments],
            statuses: state => [{ Value: null, DisplayName: '-= Все статусы =-' }, ...state.permitStatuses],
            branchId: state => state.last.selectedBranchId || state.user.branchId,
            departmentId: state => state.last.selectedDepartmentId || state.user.departmentId,
        }),
    },
    methods: {
        ...mapMutations([
            'setLastSelectedBranchId', 
            'setLastSelectedDepartmentId',
        ]),

        loadItems() {
            this.busy = true;
            axios.post(`../api/permit/read`, { request: { take: this.take, skip: this.skip, sort: this.sort, filter: this.getFilter() } })
            .then(response => {
                if(!response.data.HasError) {
                    this.items = response.data.Result.Data;
                    this.total = response.data.Result.Total;
                }
                this.busy = false;
            })
            .catch(e => {
                this.busy = false;
                alert(e);
                console.log(e);
            });
        },

        getFilter() {
            let filter = {
                logic: 'and',
                filters: [
                ],
            };

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

            if(this.selectedStatus && this.selectedStatus.Value != null) {
                filter.filters.push({
                    field: 'status',
                    value: this.selectedStatus.Value,
                    operator: 'eq',
                });
            }

            return filter.filters.length > 0 ? filter : null;
        },

        change(dataItem) {
            this.$modals.open({
                component: PermitEditor,
                props: {
                    id: dataItem.Id,
                },
                onClose: permit => {
                    this.refreshRow(permit);
                },
            });
        },

        refreshRow(permit) {
            let filter = this.getFilter();
            let satisfiesByFilter = true;
            if(satisfiesByFilter && filter && filter.filters.some(p => p.field == 'branchId')) {
                let filterBranchId = (filter.filters.filter(p => p.field == 'branchId'))[0].value;
                if(filterBranchId != null) {
                    if(permit.Branch.Id != filterBranchId) satisfiesByFilter = false; 
                }
            }
            if(satisfiesByFilter && filter && filter.filters.some(p => p.field == 'departmentId')) {
                let filterDepartmentId = (filter.filters.filter(p => p.field == 'departmentId'))[0].value;
                if(filterDepartmentId != null) {
                    if(permit.Department.Id != filterDepartmentId) satisfiesByFilter = false; 
                }
            }
            if(satisfiesByFilter && filter && filter.filters.some(p => p.field == 'status')) {
                let filterStatus = (filter.filters.filter(p => p.field == 'status'))[0].value;
                if(filterStatus != null) {
                    if(permit.Status.Value != filterStatus) satisfiesByFilter = false; 
                }
            }

            let index = this.items.findIndex(p => p.Id == permit.Id);
            if(index == -1) {
                if(satisfiesByFilter) this.items.push(permit);
            } else {
                Vue.set(this.items, index, permit);
            }
        },

        removeRow(permit) {
            let index = this.items.findIndex(p => p.Id == permit.Id);
            if(index != -1) {
                this.items.splice(index, 1);
            }
        },

        remove(dataItem) {
            this.$dialogs.requestAction({
                title: 'Внимание',
                message: `Вы действительно хотите удалить разрешение '${dataItem.Description}'?`,
                actions: [{ key: 'YES_KEY', text: 'Удалить', icon: 'trash' }, { key: 'NO_KEY', text: 'Нет' }],
                defaultActionKey: 'NO_KEY',
                icon: 'question',
            })
            .then(key => {
                if (key == 'YES_KEY') {
                    PermitService.remove(dataItem.Id)
                        .then(response => {
                            if(response.data.HasError) throw response.data.ErrorMessage;
                            this.removeRow(dataItem);
                        })
                        .catch(e => {
                            alert(e);
                            console.log(e);
                        });
                }
            });
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

        onRefreshCommand() {
            this.loadItems();
        },

        onCreatePermitCommand() {
            let actions = [
                { key: 'YES_KEY', text: 'Да, выбрать шаблон', icon: null },
                { key: 'NO_KEY', text: 'Нет, начать с пустого разрешения', icon: null },
            ];
            this.$dialogs.requestAction({ 
                    title: 'Создание нового разрешения на выполнение работ', 
                    message: 'Вы хотите воспользоваться подходящим шаблоном разрешения из каталога типовых работ?', 
                    actions: actions, 
                    defaultActionKey: 'YES_KEY', 
                    icon: 'question' })
                .then(key => {
                    if(key == 'YES_KEY') {
                        this.$modals.open({
                            component: PermitTemplateSelectDialog,
                            props: {
                                branchId: this.selectedBranch != null ? this.selectedBranch.Id : null,
                                departmentId: this.selectedDepartment != null ? this.selectedDepartment.Id : null,
                            },
                            onClose: permitTemplate => {
                                //выбран шаблон, в принципе он уже загружен, но мы передадим Id
                                this.$modals.open({
                                    component: PermitEditor,
                                    props: {
                                        id: null,
                                        branchId: this.selectedBranch != null ? this.selectedBranch.Id : null,
                                        departmentId: this.selectedDepartment != null ? this.selectedDepartment.Id : null,
                                        permitTemplateId: permitTemplate.Id, 
                                    },
                                    onClose: permit => {
                                        this.refreshRow(permit);
                                    },
                                });
                            },
                        });
                    } else if(key == 'NO_KEY') {
                        this.$modals.open({
                            component: PermitEditor,
                            props: {
                                id: null,
                                branchId: this.selectedBranch != null ? this.selectedBranch.Id : null,
                                departmentId: this.selectedDepartment != null ? this.selectedDepartment.Id : null,
                            },
                            onClose: permit => {
                                this.refreshRow(permit);
                            },
                        });
                    }
                });
        },

        onDropListChange(e) {
            if(this.selectedBranch != null) this.setLastSelectedBranchId(this.selectedBranch.Id);
            if(this.selectedDepartment != null) this.setLastSelectedDepartmentId(this.selectedDepartment.Id);
            this.loadItems();
        },

        formatDate(date) {
            if(date == null) return null;
            return moment(date).format('YYYY.MM.DD');
        },

        getStatusClasses(status) {
            if(status.Name == 'Draft') return 'permit-draft';
            if(status.Name == 'Approval') return 'permit-approval';
            if(status.Name == 'Revision') return 'permit-revision';
            if(status.Name == 'Signed') return 'permit-signed';
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

        onServerPermitChanged({ action, permit }) {
            //приходит упрощенная модель, достаточная для списка
            if(action.Name == 'Remove') {
                this.removeRow(permit);
            } else if(action.Name == 'Update' || action.Name == 'Create') {
                this.refreshRow(permit)
            }
        },
    },
    created: function () {
        if(this.branches.length > 0) {
            this.selectedBranch = this.branchId == null ? 
                this.branches[0] : 
                this.branches.find(p => p.Id == this.branchId);
            Vue.nextTick(() => {
                this.$refs.branches.kendoWidget().select(p => p.Id == this.selectedBranch.Id);
            });
        }

        if(this.departments.length > 0) {
            this.selectedDepartment = this.departmentId == null ? 
                this.departments[0] : 
                this.departments.find(p => p.Id == this.departmentId);
            Vue.nextTick(() => {
                this.$refs.departments.kendoWidget().select(p => p.Id == this.selectedDepartment.Id);
            });
        }

        if(this.statuses.length > 0) {
            this.selectedStatus = this.statuses[0];
            Vue.nextTick(() => {
                this.$refs.statuses.kendoWidget().select(p => p.Value == this.statuses[0].Value);
            });
        }

        this.loadItems();

        EventBus.$on('serverPermitChanged', this.onServerPermitChanged);
    },

    destroyed() {
        EventBus.$off('serverPermitChanged', this.onServerPermitChanged);
    },
}

</script>

<style scoped lang="scss">

.toolbar {
    display: flex;

    .toolbar-item {
        padding-right: 16px;
    }
}

.permit-approval {
    //Согласование
    background-color: #f9ff9e;
    border-bottom: 1px solid #dddddd;
    border-right: 1px solid #dddddd;
}

.permit-revision {
    //На доработке
    background-color: #ff8484;
    border-bottom: 1px solid #dddddd;
    border-right: 1px solid #dddddd;
}

.permit-signed {
    //Подписано
    background-color: #baff92;
    border-bottom: 1px solid #dddddd;
    border-right: 1px solid #dddddd;
}

.permit-draft {
    //Подписано
    border-bottom: 1px solid #dddddd;
    border-right: 1px solid #dddddd;
}

</style>