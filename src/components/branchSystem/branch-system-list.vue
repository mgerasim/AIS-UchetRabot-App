<template>
    <div style="height: 100%;">

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
            @sortchange="onSortChange">

            <grid-toolbar>
                <div class="toolbar">
                    <div class="toolbar-item" style="width: 300px;">
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

                    <button type='button' v-on:click='onCreateSystemCommand' class='k-button k-button-icontext k-grid-add' style="margin-left: 16px;">
                        <fa icon="plus"></fa>&nbsp;Добавить новую систему
                    </button>
                </div>
            </grid-toolbar>

            <template v-slot:boolTemplate="{props, listeners}">
                <td :class="props.className">
                    <fa v-if="props.dataItem[props.field]" icon="check" />
                </td>
            </template>

        </Grid>

        <action-request ref="actionRequest"></action-request>

    </div>
</template>

<script>

import Vue from 'vue';
import axios from 'axios';
import BranchSystemEditor from '@/components/branchSystem/branch-system-editor.vue';
import ActionRequest from '@/components/shared/action-request.vue';
import GridCommandCell from '@/components/shared/grid-command-cell';

export default {
    name: 'branch-system-list',
    components: {
        ActionRequest,
    },
    data() {
        return {
            skip: 0,
            take: 10,
            total: 0,
            sort: [
                { field: 'Name', dir: 'asc' }
            ],
            items: [],
            branches: [],
            selectedBranch: null,
            columns: [
                { field: "Name", title: "Наименование", width: 220 },
                { field: "Description", title: "Описание", width: 'auto' },
                { field: "Branch.Name", title: "Принадлежность", width: 220 },
                { title: " ", cell: GridCommandCell, width: 100 },
            ],
        }
    },
    computed: {
    },
    methods: {
        loadItems() {
            axios.post(`../api/branchSystem/read`, { request: { take: this.take, skip: this.skip, sort: this.sort, filter: this.getFilter() } })
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
            return axios.post(`../api/branch/getAll`)
            .then(response => {
                if(response.data.HasError) throw response.data.ErrorMessage;

                this.branches = [{ Id: null, Name: '-= Все подразделения =-' }, ...response.data.Result];
                if(this.branches.length > 0) {
                    this.selectedBranch = this.branches[0];
                    Vue.nextTick(() => {
                        this.$refs.branch.kendoWidget().select(p => p.Id == this.branches[0].Id);
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

            if(this.selectedBranch && this.selectedBranch.Id != null) {
                filter.filters.push({
                    field: 'branchId',
                    value: this.selectedBranch.Id,
                    operator: 'eq',
                });
            }

            return filter.filters.length > 0 ? filter : null;
        },

        change(dataItem) {
            this.$modals.open({
                component: BranchSystemEditor,
                props: {
                    id: dataItem.Id,
                },
                onClose: system => {
                    this.refreshRow(system);
                },
            });
        },

        refreshRow(system) {
            let index = this.items.findIndex(p => p.Id == system.Id);
            if(index == -1) {
                this.items.push(system);
            } else {
                Vue.set(this.items, index, system);
            }
        },

        removeRow(system) {
            let index = this.items.findIndex(p => p.Id == system.Id);
            if(index != -1) {
                this.items.splice(index, 1);
            }
        },

        remove(dataItem) {
            this.$refs.actionRequest.request('Внимание',
                `Вы действительно хотите удалить систему ${dataItem.Name}?`,
                [{ name: 'no', title: 'Нет' }, { name: 'yes', title: 'Да' }],
                requestResult => {
                    if (requestResult == 'yes') {
                        axios.post(`../api/branchSystem/remove`, { id: dataItem.Id })
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

        onCreateSystemCommand() {
            this.$modals.open({
                component: BranchSystemEditor,
                props: {
                    id: null,
                    branchId: this.selectedBranch != null ? this.selectedBranch.Id : null,
                },
                onClose: system => {
                    this.refreshRow(system);
                },
            });
        },

        onDropListChange(e) {
            this.loadItems();
        },
    },
    created: function () {
        this.loadInitData()
            .then(() => {
                this.loadItems();
            });
    },
}

</script>

<style scoped lang="scss">

.toolbar {
    display: flex;
}

</style>