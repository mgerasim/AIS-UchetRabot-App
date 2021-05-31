<template>
    <div style="height: 100%;">

        <kendo-treelistdatasource ref="remoteDataSource"
            :data="items"
            :schema-model="model">
        </kendo-treelistdatasource>

        <kendo-treelist
            ref="branchTreeList"
            style="height: 100%;"
            height="100%"
            data-source-ref="remoteDataSource"
            :editable-move="true"
            @drop="onDrop"
            :toolbar="[{ name: 'AddCommand', text: 'Добавить новое подразделение', imageClass: 'k-icon k-i-plus', click: onCreateBranchCommand }]">
            <kendo-treelist-column field="Name" title="Наименование" width="auto"></kendo-treelist-column>
            <kendo-treelist-column title=" " :template="getCommandCellTemplate" :width="110"></kendo-treelist-column>
        </kendo-treelist>

        <action-request ref="actionRequest"></action-request>

    </div>
</template>

<script>

import Vue from 'vue';
import axios from 'axios';
import BranchEditor from '@/components/branch/branch-editor.vue';
import ActionRequest from '@/components/shared/action-request.vue';
import ResizeMixin from 'vue-resize-mixin';

export default {
    name: 'branch-list',
    mixins: [ResizeMixin],
    components: {
        ActionRequest,
    },
    data() {
        return {
            items: [],
            model: {
                id: 'Id',
                parentId: 'ParentId',
                fields: {
                    Id: { field: 'Id', type: 'number' },
                    ParentId: { field: 'ParentId', type: 'number', nullable: true },
                },
                expanded: true
            },
        }
    },
    computed: {
    },
    methods: {
        loadItems() {
            axios.post(`../api/branch/read`)
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
                component: BranchEditor,
                props: {
                    id: dataItem.Id,
                },
                onClose: branch => {
                    this.refreshRow(branch);
                },
            });
        },

        refreshRow(branch) {
            let index = this.items.findIndex(p => p.Id == branch.Id);
            if(index == -1) {
                this.items.push(branch);
            } else {
                Vue.set(this.items, index, branch);
            }
        },

        removeRow(branch) {
            let index = this.items.findIndex(p => p.Id == branch.Id);
            if(index != -1) {
                this.items.splice(index, 1);
            }
        },

        remove(dataItem) {
            this.$refs.actionRequest.request('Внимание',
                `Вы действительно хотите удалить подразделение ${dataItem.Name}?`,
                [{ name: 'no', title: 'Нет' }, { name: 'yes', title: 'Да' }],
                requestResult => {
                    if (requestResult == 'yes') {
                        axios.post(`../api/branch/removeBranch`, { branchId: dataItem.Id })
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

        onCreateBranchCommand() {
            this.$modals.open({
                component: BranchEditor,
                props: {
                    id: null,
                },
                onClose: branch => {
                    this.refreshRow(branch);
                },
            });
        },

        onDrop(e) {
            const oldParentId = e.source.ParentId;
            e.source.ParentId = !e.destination ? null : e.destination.Id;
            const newParentId = e.source.ParentId;
            if(oldParentId != newParentId && newParentId != e.source.Id) this._updateBranch(e.source);
        },

        _updateBranch(branch) {
            axios.post('../api/branch/updateBranch', { branch: branch })
                .then(response => {
                    if(response.data.HasError) throw response.data.ErrorMessage;
                    this.$modals.close(response.data.Result);
                })
                .catch(error => {
                    console.log(error);
                    alert(`Ошибка при обновлении подразделения: ${error}`);
                });
        },

        getCommandCellTemplate(dataItem) {
            let template = `
                <td>
                    <div v-if="templateArgs != null" class="grid-command-cell-commands">
                        <div 
                            class='grid-command-cell-command grid-command-cell-edit-command content-center' 
                            @click="onChange" 
                            title='Изменить'>
                            <fa icon="pencil-alt"></fa>
                        </div>
                        <div
                            class="grid-command-cell-command grid-command-cell-remove-command content-center" 
                            @click="onRemove" title='Удалить'>
                            <fa icon="times"></fa>
                        </div>
                    </div>
                </td>
            `;

            const self = this;

            var itemTemplate = Vue.component('name-component', {
                template: template,
                data() {
                    return {
                        templateArgs: {},
                    };
                },
                computed: {
                },
                methods: {
                    onChange(e) { self.change(dataItem); },
                    onRemove(e) { self.remove(dataItem); },
                }
            });

            return {
                template: itemTemplate,
                templateArgs: dataItem
            }
        },

        onWindowResize(event) {
            var tree = this.$refs.branchTreeList.kendoWidget();
            tree.resize();
        },
    },

    created: function () {
        this.$on('resize', this.onWindowResize);
        this.loadItems();
    },

    beforeDestroy: function () {
        this.$off('resize');
    },
}

</script>

<style scoped>

.list-commands > .command-button {
    width: 30px;
    min-width: 30px;
    margin-left: 8px;
}

</style>