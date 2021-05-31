<template>

<div class="k-widget k-grid v-flex no-select">

    <!-- <div v-if="busy" class="busy">
        <busy-indicator name="catalogTreeBusy"></busy-indicator>
    </div> -->

    <div v-if="!readOnly" class="h-flex toolbar k-header k-grid-toolbar">
        <button 
            class="k-button"
            @click="onSiblingAdd"
            title="Добавить ветку на том же уровне">
            <fa icon="plus"></fa>&nbsp;
        </button>

        <button 
            class="k-button"
            @click="onChildAdd"
            title="Добавить дочернюю ветку к выбранной">
            <fa icon="plus"></fa>&nbsp;
        </button>

        <button 
            class="k-button"
            @click="onChange"
            title="Изменить выбранную ветку"
            :disabled="selectedCatalogItem == null">
            <fa icon="pencil-alt"></fa>&nbsp;
        </button>

        <button 
            class="k-button"
            @click="onRemove"
            title="Удалить выбранную ветку"
            :disabled="selectedCatalogItem == null">
            <fa icon="trash"></fa>&nbsp;
        </button>
    </div>

    <kendo-treelistdatasource   ref="dataSource"
                                :data="items"
                                :schema="schema"
                                :sort="sort">
    </kendo-treelistdatasource>

    <div class="tree" style="flex: 1 1 100%; min-height: 0;">

        <kendo-treelist 
            ref="treeView"
            data-source-ref="dataSource"
            :selectable="true"
            :navigatable="true"
            :scrollable="true"
            :editable-move="true"
            @change="onTreeViewChange"
            @dragstart="onTreeViewDragStart"
            @dragend="onTreeViewDragEnd"
            @expand="onTreeViewExpand"
            @collapse="onTreeViewCollapse"
            style="height: 100%;"
            height="100%">

            <kendo-treelist-column field="Name" title="Наименование" :width="200"></kendo-treelist-column>
        </kendo-treelist>
    </div>

    <action-request ref="actionRequest"></action-request>

</div>

</template>

<script>

import ActionRequest from '@/components/shared/action-request.vue';
import CatalogItemEditor from '@/components/catalog/catalog-item-editor';
import axios from 'axios';
import Vue from 'vue';

export default {
    name: 'catalog-tree',
    props: {
        'catalogId': { type: Number, required: true },
        readOnly: { type: Boolean, default: false },
    },
    components: {
        ActionRequest,
    },
    data() {
        return {
            items: [],
            selectedCatalogItem: null,
            schema: {
                model: {
                    id: 'Id',
                    parentId: 'ParentId',
                    expanded: false,
                    fields: {
                        Id: { field: 'Id', type: 'number', nullable: false },
                        ParentId: { field: 'ParentId', type: 'number', nullable: true },
                        Name: { field: 'Name', type: 'string', nullable: true },
                    },
                }
            },
            expanded: [],
            sort: { field: "Order", dir: "asc" },
            busy: false,
        };
    }, 
    watch: {
        catalogId(newValue, oldValue) {
            this.selectedCatalogItem = null;
            this.expanded = [];
            this.loadItems();
        }
    },
    methods: {
        loadItems() {
            this.busy = true;
            axios.post(`../api/catalog/getCatalogItemsByCatalog`, { catalogId: this.catalogId })
            .then(response => {
                if(!response.data.HasError) {
                    this.items = response.data.Result;
                    Vue.nextTick(() => {
                        if(this.$refs.treeView == null) return;

                        this.$refs.treeView.kendoWidget().resize();

                        if(this.items.length > 0) {
                            let firstDataItem = this.$refs.treeView.kendoWidget().dataSource.get(this.items[0].Id);
                            let firstRow = this.$refs.treeView.kendoWidget().itemFor(firstDataItem);
                            this.$refs.treeView.kendoWidget().select(firstRow);
                        } else {
                            this.$refs.treeView.kendoWidget().clearSelection();
                            this.selectedCatalogItem = null;
                            this.$emit('select', null);
                        }
                    });
                }
                this.busy = false;
            })
            .catch(e => {
                this.busy = false;
                console.log(e);
            });
        },

        refreshRow(catalogItem) {
            let index = this.items.findIndex(p => p.Id == catalogItem.Id);
            if(index == -1) {
                this.items.push(catalogItem);
            } else {
                Vue.set(this.items, index, catalogItem);
            }
            this.applyExpanded();
        },

        removeRow(catalogItem) {
            let index = this.items.findIndex(p => p.Id == catalogItem.Id);
            this.items.splice(index, 1);
            index = this.expanded.findIndex(p => p == catalogItem.Id);
            if(index > -1) this.expanded.splice(index, 1);
            this.applyExpanded();
            this.selectedCatalogItem = null;
        },

        onSiblingAdd() {
            this.$modals.open({
                component: CatalogItemEditor,
                props: {
                    catalogId: this.catalogId,
                    parentId: this.selectedCatalogItem == null ? null : this.selectedCatalogItem.ParentId,
                },
                onClose: catalogItem => {
                    this.refreshRow(catalogItem);
                    this.selectedCatalogItem = catalogItem;
                },
            });
        },

        onChildAdd() {
            this.$modals.open({
                component: CatalogItemEditor,
                props: {
                    catalogId: this.catalogId,
                    parentId: this.selectedCatalogItem == null ? null : this.selectedCatalogItem.Id,
                },
                onClose: catalogItem => {
                    this.refreshRow(catalogItem);
                    this.selectedCatalogItem = catalogItem;
                },
            });
        },

        onChange() {
            this.$modals.open({
                component: CatalogItemEditor,
                props: {
                    id: this.selectedCatalogItem == null ? null : this.selectedCatalogItem.Id,
                    catalogId: this.catalogId,
                    parentId: this.selectedCatalogItem == null ? null : this.selectedCatalogItem.ParentId,
                },
                onClose: catalogItem => {
                    this.refreshRow(catalogItem);
                },
            });
        },

        onRemove() {
            if(this.selectedCatalogItem == null) return;
            this.$refs.actionRequest.request('Внимание',
                `Вы действительно хотите удалить ветку ${this.selectedCatalogItem.Name}?`,
                [{ name: 'no', title: 'Нет' }, { name: 'yes', title: 'Да' }],
                requestResult => {
                    if (requestResult == 'yes') {
                        axios.post(`../api/catalog/removeCatalogItem`, { id: this.selectedCatalogItem.Id })
                            .then(response => {
                                if(response.data.HasError) throw response.data.ErrorMessage;
                                this.removeRow(this.selectedCatalogItem);
                            })
                            .catch(e => {
                                alert(e);
                                console.log(e);
                            });
                    }
                }
            );
        },

        onTreeViewChange(e) {
            let selectedRow = this.$refs.treeView.kendoWidget().select();
            let dataItem = this.$refs.treeView.kendoWidget().dataItem(selectedRow);
            this.selectedCatalogItem = dataItem;
            this.$emit('select', this.selectedCatalogItem);
        },

        onTreeViewDragStart(e) {
            //e.source
            //e.destination
            //в e.source.ParentId уже проставлено корректное значение
            if(this.readOnly) e.preventDefault();
        },

        onTreeViewDragEnd(e) {
            //e.source
            //e.destination
            //в e.source.ParentId уже проставлено корректное значение
            this.updateObject(e.source)
                .then(dataItem => {
                    this.refreshRow(dataItem);
                });
        },

        updateObject(dataItem) {
            return axios.post('../api/catalog/updateCatalogItem', { model: dataItem })
                .then(response => {
                    if(response.data.HasError) throw response.data.ErrorMessage;
                    return response.data.Result;
                })
                .catch(error => {
                    console.log(error);
                    alert(`Ошибка при обновлении элемента каталога: ${error}`);
                });
        },

        onTreeViewExpand(e) {
            //e.model
            this.expanded.push(e.model.Id);
        },

        onTreeViewCollapse(e) {
            //e.model
            let index = this.expanded.findIndex(p => p == e.model.Id);
            if(index > -1) this.expanded.splice(index, 1);
        },
        
        applyExpanded() {
            Vue.nextTick(() => {
                for(let exp of this.expanded) {
                    let row = this.$refs.treeView.kendoWidget().itemFor(exp);
                    this.$refs.treeView.kendoWidget().expand(row);
                }
            });
        },
    },
    created() {
        this.loadItems();
    },
}

</script>

<style lang="scss" scoped>

.toolbar {
    border-bottom-width: 0;
}

.k-treelist {
    display: flex !important;
    flex-flow: column nowrap;
}

.k-grid-header {
    flex: 0 0 auto;
}

.k-grid-content {
    flex: 1 1 100%;
    min-height: 0;
}

</style>

