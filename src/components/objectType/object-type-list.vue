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
                <div style='display: flex;'>
                    <button type='button' v-on:click='onCreateObjectTypeCommand' class='k-button k-button-icontext k-grid-add'>
                        <fa icon="plus"></fa>&nbsp;Добавить новый тип объекта
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
import ObjectTypeEditor from '@/components/objectType/object-type-editor.vue';
import ActionRequest from '@/components/shared/action-request.vue';
import CommandCell from '@/components/objectType/object-type-list-command-cell.vue';

export default {
    name: 'object-type-list',
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
            columns: [
                { field: "Name", title: "Наименование", width: 220 },
                { field: "Description", title: "Описание", width: 'auto' },
                { field: "Extended", title: "Протяженный", cell: "boolTemplate",  width: 150 },
                { title: " ", cell: CommandCell, width: 100 },
            ],
        }
    },
    computed: {
    },
    methods: {
        loadItems() {
            axios.post(`../api/objectType/read`, { request: { take: this.take, skip: this.skip, sort: this.sort } })
            .then(response => {
                console.log(response);
                
                if(!response.data.HasError) {
                    this.items = response.data.Result.Data;
                    this.total = response.data.Result.Total;
                }
            })
            .catch(e => {
                console.log(e);
            });
        },

        change(dataItem) {
            this.$modals.open({
                component: ObjectTypeEditor,
                props: {
                    id: dataItem.Id,
                },
                onClose: objectType => {
                    this.refreshRow(objectType);
                },
            });
        },

        refreshRow(objectType) {
            let index = this.items.findIndex(p => p.Id == objectType.Id);
            if(index == -1) {
                this.items.push(objectType);
            } else {
                Vue.set(this.items, index, objectType);
            }
        },

        removeRow(objectType) {
            let index = this.items.findIndex(p => p.Id == objectType.Id);
            if(index != -1) {
                this.items.splice(index, 1);
            }
        },

        remove(dataItem) {
            this.$refs.actionRequest.request('Внимание',
                `Вы действительно хотите удалить тип объекта ${dataItem.Name}?`,
                [{ name: 'no', title: 'Нет' }, { name: 'yes', title: 'Да' }],
                requestResult => {
                    if (requestResult == 'yes') {
                        axios.post(`../api/objectType/remove`, { id: dataItem.Id })
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
            console.log(e);
            this.skip = e.page.skip;
            this.take = e.page.take;
            this.loadItems();
        },

        onSortChange: function(e) {
            console.log(e);
            this.sort = e.sort;
            this.loadItems();
        },

        onCreateObjectTypeCommand() {
            this.$modals.open({
                component: ObjectTypeEditor,
                props: {
                    id: null,
                },
                onClose: objectType => {
                    this.refreshRow(objectType);
                },
            });
        },
    },
    created: function () {
        this.loadItems();
    },
}

</script>