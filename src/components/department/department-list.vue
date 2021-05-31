<template>
    <div style="height: 100%;">

        <Grid :style="{height: '100%'}"
            :data-items="items"
            :columns="columns"
            @change="change"
            @remove="remove">

            <grid-toolbar>
                <div style='display: flex;'>
                    <button type='button' v-on:click='onCreateDepartmentCommand' class='k-button k-button-icontext k-grid-add'>
                        <fa icon="plus"></fa>&nbsp;Добавить новый отдел
                    </button>
                </div>
            </grid-toolbar>

        </Grid>

        <action-request ref="actionRequest"></action-request>

    </div>
</template>

<script>

import Vue from 'vue';
import axios from 'axios';
import DepartmentEditor from '@/components/department/department-editor.vue';
import ActionRequest from '@/components/shared/action-request.vue';
import GridCommandCell from '@/components/shared/grid-command-cell';

export default {
    name: 'department-list',
    components: {
        ActionRequest,
    },
    data() {
        return {
            items: [],
            columns: [
                { field: "Name", title: "Наименование", width: 300 },
                { field: "Description", title: "Описание", width: 'auto' },
                { title: " ", cell: GridCommandCell, width: 100 },
            ],
        }
    },
    computed: {
    },
    methods: {
        loadItems() {
            axios.post(`../api/department/read`)
            .then(response => {
                if(!response.data.HasError) {
                    this.items = response.data.Result;
                }
            })
            .catch(e => {
                console.log(e);
            });
        },

        change(dataItem) {
            this.$modals.open({
                component: DepartmentEditor,
                props: {
                    id: dataItem.Id,
                },
                onClose: department => {
                    this.refreshRow(department);
                },
            });
        },

        refreshRow(department) {
            let index = this.items.findIndex(p => p.Id == department.Id);
            if(index == -1) {
                this.items.push(department);
            } else {
                Vue.set(this.items, index, department);
            }
        },

        removeRow(department) {
            let index = this.items.findIndex(p => p.Id == department.Id);
            if(index != -1) {
                this.items.splice(index, 1);
            }
        },

        remove(dataItem) {
            this.$refs.actionRequest.request('Внимание',
                `Вы действительно хотите удалить отдел ${dataItem.Name}?`,
                [{ name: 'no', title: 'Нет' }, { name: 'yes', title: 'Да' }],
                requestResult => {
                    if (requestResult == 'yes') {
                        axios.post(`../api/department/removeDepartment`, { departmentId: dataItem.Id })
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

        onCreateDepartmentCommand() {
            this.$modals.open({
                component: DepartmentEditor,
                props: {
                    id: null,
                },
                onClose: department => {
                    this.refreshRow(department);
                },
            });
        },
    },
    created: function () {
        this.loadItems();
    },
}

</script>