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
            selected-field="selected"
            @pagechange="onPageChange"
            @sortchange="onSortChange"
            @rowclick="onRowClick"
            class="no-select">

            <grid-toolbar>
                <div class="toolbar">
                    <div style="width: 250px;">
                        <kendo-dropdownlist ref="pipeline"
                                            :data-source="pipelines"
                                            data-text-field="Name"
                                            data-value-field="Id"
                                            :value-primitive="true"
                                            @select="selectedPipeline = $event.dataItem"
                                            @change="onDropListChange"
                                            style="width: 100%;">
                        </kendo-dropdownlist>
                    </div>

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

                    <div style="width: 250px;">
                        <kendo-dropdownlist ref="objectType"
                                            :data-source="objectTypes"
                                            data-text-field="Name"
                                            data-value-field="Id"
                                            :value-primitive="true"
                                            @select="selectedObjectType = $event.dataItem"
                                            @change="onDropListChange"
                                            style="width: 100%;">
                        </kendo-dropdownlist>
                    </div>

                    <button type='button' v-on:click='onCreateObjectCommand' class='k-button k-button-icontext k-grid-add'>
                        <fa icon="plus"></fa>&nbsp;Добавить новый объект
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
import ObjectEditor from '@/components/object/object-editor.vue';
import ActionRequest from '@/components/shared/action-request.vue';
import CommandCell from '@/components/shared/grid-command-cell';

export default {
    name: 'object-list',
    components: {
        ActionRequest,
    },
    props: {
        isSelector: { type: Boolean, default: false, },
        pipelineId: { type: Number,default: null, },
        branchId: { type: Number, default: null },
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
            selectedItem: null,
            pipelines: [],
            selectedPipeline: null,
            branches: [],
            selectedBranches: null,
            objectTypes: [],
            selectedObjectType: null,
            columns: [
                { field: "Name", title: "Наименование", width: 220 },
                { field: "Description", title: "Описание", width: 'auto' },
                { field: "Pipeline.Name", title: "Участок нефтепровода", width: 220 },
                { field: "Branch.Name", title: "Принадлежность", width: 220 },
                { field: "ObjectType.Name", title: "Тип объекта", width: 220 },
                { title: " ", cell: CommandCell, width: 100 },
            ],

            clickTimeoutHandler: null,
            clickCounter: 0,            
        }
    },
    computed: {
    },
    methods: {
        loadItems() {
            axios.post(`../api/object/read`, { request: { take: this.take, skip: this.skip, sort: this.sort, filter: this.getFilter() } })
            .then(response => {
                if(!response.data.HasError) {
                    this.items = response.data.Result.Data.map(p => Object.assign(p, { selected: false }));
                    this.total = response.data.Result.Total;
                }
            })
            .catch(e => {
                console.log(e);
            });
        },

        loadInitData() {
            return Promise.all([
                axios.post(`../api/pipeline/getAll`),
                axios.post(`../api/branch/getAll`),
                axios.post(`../api/objectType/getAll`),
            ])
            .then(responses => {
                let pipelinesResponse = responses[0];
                let branchesResponse = responses[1];
                let objectTypesResponse = responses[2];

                if(pipelinesResponse.data.HasError) throw pipelinesResponse.data.ErrorMessage;
                if(branchesResponse.data.HasError) throw branchesResponse.data.ErrorMessage;
                if(objectTypesResponse.data.HasError) throw objectTypesResponse.data.ErrorMessage;

                this.pipelines = [{ Id: null, Name: '-= Все участки =-' }, ...pipelinesResponse.data.Result];
                this.branches = [{ Id: null, Name: '-= Все подразделения =-' }, ...branchesResponse.data.Result];
                this.objectTypes = [{ Id: null, Name: '-= Все типы объектов =-' }, ...objectTypesResponse.data.Result];

                Vue.nextTick(() => {
                    if(this.pipelines.length > 0) {
                        this.selectedPipeline = this.pipelineId != null ? this.pipelines.find(p => p.Id == this.pipelineId) : this.pipelines[0];
                        this.$refs.pipeline.kendoWidget().select(p => p.Id == this.selectedPipeline.Id);
                    }

                    if(this.branches.length > 0) {
                        this.selectedBranch = this.branchId != null ? this.branches.find(p => p.Id == this.branchId) : this.branches[0];
                        this.$refs.branch.kendoWidget().select(p => p.Id == this.selectedBranch.Id);
                    }

                    if(this.objectTypes.length > 0) {
                        this.selectedObjectType = this.objectTypes[0];
                        this.$refs.objectType.kendoWidget().select(p => p.Id == this.objectTypes[0].Id);
                    }
                });
            })
            .catch(error => {
                console.log(error);
                alert(`Ошибка при загрузке данных: ${error}`);
            });
        },

        getFilter() {
            let filter = {
                logic: 'and',
                filters: [
                ],
            };

            if(this.selectedPipeline && this.selectedPipeline.Id != null) {
                filter.filters.push({
                    field: 'pipelineId',
                    value: this.selectedPipeline.Id,
                    operator: 'eq',
                });
            }

            if(this.selectedBranch && this.selectedBranch.Id != null) {
                filter.filters.push({
                    field: 'branchId',
                    value: this.selectedBranch.Id,
                    operator: 'eq',
                });
            }

            if(this.selectedObjectType && this.selectedObjectType.Id != null) {
                filter.filters.push({
                    field: 'objectTypeId',
                    value: this.selectedObjectType.Id,
                    operator: 'eq',
                });
            }

            return filter.filters.length > 0 ? filter : null;
        },

        change(dataItem) {
            this.$modals.open({
                component: ObjectEditor,
                props: {
                    id: dataItem.Id,
                },
                onClose: object => {
                    Object.assign(object, { selected: false });
                    this.refreshRow(object);
                },
            });
        },

        refreshRow(object) {
            let index = this.items.findIndex(p => p.Id == object.Id);
            if(index == -1) {
                this.items.push(object);
            } else {
                Vue.set(this.items, index, object);
            }
        },

        removeRow(object) {
            let index = this.items.findIndex(p => p.Id == object.Id);
            if(index != -1) {
                this.items.splice(index, 1);
            }
        },

        remove(dataItem) {
            this.$refs.actionRequest.request('Внимание',
                `Вы действительно хотите удалить объект ${dataItem.Name}?`,
                [{ name: 'no', title: 'Нет' }, { name: 'yes', title: 'Да' }],
                requestResult => {
                    if (requestResult == 'yes') {
                        axios.post(`../api/object/remove`, { id: dataItem.Id })
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

        onCreateObjectCommand() {
            this.$modals.open({
                component: ObjectEditor,
                props: {
                    id: null,
                    pipelineId: this.selectedPipeline != null ? this.selectedPipeline.Id : null,
                },
                onClose: object => {
                    Object.assign(object, { selected: false });
                    this.refreshRow(object);
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
            if(!this.isSelector) return;

            if(this.selectedItem != null) {
                this.selectedItem.selected = false;
            }
            this.selectedItem = this.items.find(p => p.Id == dataItem.Id);
            if(this.selectedItem != null) {
                this.selectedItem.selected = true;
            }
            //отправляем выбранный объект и флаг, что выбор промежуточный, пусть родитель считает, что с ним дальше делать
            this.$emit('select', { object: this.selectedItem, confirm: false });
        },

        onDblClick(dataItem) {
            if(this.isSelector) {
                //подтверждение выбора из справочника
                if(this.selectedItem != null) {
                    this.selectedItem.selected = false;
                }
                this.selectedItem = this.items.find(p => p.Id == dataItem.Id);
                if(this.selectedItem != null) {
                    this.selectedItem.selected = true;
                }
                //отправляем выбранный объект и флаг, что выбор 100% подтвержден
                this.$emit('select', { object: this.selectedItem, confirm: true });
            } else {
                //на редактирование
                this.change(dataItem);
            }
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

    &>*:not(:last-child) {
        margin-right: 8px;
    }
}

</style>