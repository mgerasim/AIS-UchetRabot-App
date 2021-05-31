<template>

    <div class="no-select" style="height: 100%;">

        <div v-if="busy" class="busy">
            <busy-indicator name="permitTemplateListBusy"></busy-indicator>
        </div>

        <Grid :style="{height: '100%'}"
            :data-items="items"
            :columns="columns"
            @change="change"
            @remove="remove"
            :sortable="true"
            :sort= "sort"
            selected-field="selected"
            @sortchange="onSortChange"
            @rowclick="onRowClick">

            <template v-slot:checkTemplate="{props}">
                <td :class="props.className">
                    <div v-if="props.dataItem != null" class="text-center">
                        <fa v-if="props.dataItem[props.field]" icon="check"></fa>
                    </div>
                </td>
            </template>

            <template v-slot:lockTemplate="{props}">
                <td :class="props.className">
                    <div v-if="props.dataItem != null" class="text-center">
                        <fa v-if="props.dataItem[props.field]" icon="lock"></fa>
                    </div>
                </td>
            </template>

            <template v-slot:lockHeaderTemplate >
                <div style="text-align: center;"><fa icon="lock"></fa></div>
            </template>

            <template v-slot:fileTemplate="{props}">
                <td :class="props.className">
                    <div v-if="props.dataItem != null" class="text-center">
                        <fa v-if="props.dataItem[props.field]" icon="paperclip"></fa>
                    </div>
                </td>
            </template>

            <grid-toolbar v-if="!isSelector">
                <div class="toolbar">
                    <button type='button' v-on:click='onCreatePermitTemplateCommand' class='k-button'>
                        <fa icon="plus"></fa>&nbsp;Добавить новый шаблон разрешения
                    </button>
                </div>
            </grid-toolbar>

        </Grid>

        <action-request ref="actionRequest"></action-request>

    </div>

</template>

<script lang="ts">

import Vue from 'vue';
import PermitTemplateEditor from '@/components/permitTemplate/permit-template-editor.vue';
import ActionRequest from '@/components/shared/action-request.vue';
import GridCommandCell from '@/components/shared/grid-command-cell.vue';
import PermitTemplateService from '@/core/services/permit-template-service';
import { EventBus } from '@/core/event-bus';
import ISimplePermitTemplate from '@/core/types/permitTemplate/simplePermitTemplate';
import { ISelectable } from '@/core/types/selectable';
import { IApiResult } from '../../core/types/apiResult';

export default Vue.extend({
    name: 'permit-template-list',
    components: {
        ActionRequest,
    },
    props: {
        'catalogItemId': { type: Number, required: true },
        'permitTemplateCatalogId': { type: Number, required: true },
        'isSelector': { type: Boolean, default: false },
    },    
    watch: {
        catalogItemId(newValue, oldValue) {
            this.loadItems();
        }
    },
    computed: {
        columns() {
            return this.isSelector ? this.columnsAll : [...this.columnsAll, this.commandColumn];  
        },
    },
    data() {
        return {
            sort: [
                { field: 'Name', dir: 'asc' }
            ],
            items: [] as ISelectable<ISimplePermitTemplate>[],
            columnsAll: [
                { field: "IsLocked", title: " ", cell: 'lockTemplate', headerCell: 'lockHeaderTemplate', width: 50 },
                { field: "Name", title: "Наименование", width: 'auto' },
                { title: 'Маскирование', children: [
                    { field: "NeedNpsMask", title: "МПСА+АСПТ", cell:'checkTemplate', width: 110 },
                    { field: "NeedEsuMask", title: "САУ", cell:'checkTemplate', width: 50 },
                    { field: "NeedCspaMask", title: "ЦСПА", cell:'checkTemplate', width: 60 },
                ]},
                { field: "File", title: " ", width: '40', cell: 'fileTemplate' },
            ],
            commandColumn: { title: " ", cell: GridCommandCell, width: 100 },
            selectedItem: undefined as (ISelectable<ISimplePermitTemplate> | undefined),

            clickTimeoutHandler: null as any,   
            clickCounter: 0,   
            busy: false,      
        }
    },
    methods: {
        loadItems() {
            this.busy = true;
            PermitTemplateService.getAllPermitTemplatesByCatalogItem(this.catalogItemId)
                .then(response => {
                    if(response.HasError) throw response.ErrorMessage;
                    this.items = response.Result.map(p => {
                        let casted = p as ISelectable<ISimplePermitTemplate>;
                        casted.selected = false;
                        return casted;
                    });
                    this.busy = false;
                })
                .catch(e => {
                    this.busy = false;
                    alert(e);
                    console.log(e);
                });
        },

        change(dataItem: ISimplePermitTemplate) {
            this.$modals.open({
                component: PermitTemplateEditor,
                props: {
                    id: dataItem.Id,
                    catalogItemId: this.catalogItemId,
                    permitTemplateCatalogId: this.permitTemplateCatalogId,
                },
                onClose: permitTemplate => {
                    Object.assign(permitTemplate, { selected: false });
                    this.refreshRow(permitTemplate);
                },
            });
        },

        refreshRow(permitTemplate: ISimplePermitTemplate) {
            let index = this.items.findIndex(p => p.Id == permitTemplate.Id);
            if(index == -1) {
                this.items.push(permitTemplate as ISelectable<ISimplePermitTemplate>);
            } else {
                Vue.set(this.items, index, permitTemplate);
            }
        },

        removeRow(permitTemplate: ISimplePermitTemplate) {
            let index = this.items.findIndex(p => p.Id == permitTemplate.Id);
            if(index != -1) {
                this.items.splice(index, 1);
            }
        },

        remove(dataItem: ISimplePermitTemplate) {
            this.$refs.actionRequest.request('Внимание',
                `Вы действительно хотите удалить шаблон '${dataItem.Name}'?`,
                [{ name: 'no', title: 'Нет' }, { name: 'yes', title: 'Да' }],
                requestResult => {
                    if (requestResult == 'yes') {
                        PermitTemplateService.removePermitTemplate(dataItem.Id)
                            .then((response: IApiResult<void>) => {
                                if(response.HasError) throw response.ErrorMessage;
                                this.removeRow(dataItem);
                            })
                            .catch(error => {
                                console.log(error);
                                alert(error);
                            });
                    }
                }
            );
        },

        onSortChange: function(e) {
            this.sort = e.sort;
            this.loadItems();
        },

        onCreatePermitTemplateCommand() {
            this.$modals.open({
                component: PermitTemplateEditor,
                props: {
                    catalogItemId: this.catalogItemId,
                    permitTemplateCatalogId: this.permitTemplateCatalogId,
                },
                onClose: permitTemplate => {
                    Object.assign(permitTemplate, { selected: false });
                    this.refreshRow(permitTemplate);
                },
            });
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

        onClick(dataItem: ISimplePermitTemplate) {
            if(!this.isSelector) return;

            if(this.selectedItem != null) {
                this.selectedItem.selected = false;
            }
            this.selectedItem = this.items.find(p => p.Id == dataItem.Id);
            if(this.selectedItem != null) {
                this.selectedItem.selected = true;
            }
            //отправляем выбранный объект и флаг, что выбор промежуточный, пусть родитель считает, что с ним дальше делать
            this.$emit('select', { permitTemplate: this.selectedItem, confirm: false });
        },

        onDblClick(dataItem: ISimplePermitTemplate) {
            if(this.selectedItem != null) {
                this.selectedItem.selected = false;
            }
            this.selectedItem = this.items.find(p => p.Id == dataItem.Id);
            if(this.selectedItem != null) {
                this.selectedItem.selected = true;
            }

            if(this.isSelector) {
                //если интерфейс выбора шаблона - отправляем выбранный объект и флаг, что выбор 100% подтвержден
                this.$emit('select', { permitTemplate: this.selectedItem, confirm: true });
            } else {
                this.change(dataItem);
            }
        },

        serverPermitTemplateChanged({ action, permitTemplate }) {
            if(this.catalogItemId == permitTemplate.CatalogItemId) {
                //наш отображаемый каталог
                if(action.Name == 'Update' || action.Name == 'Remove') {
                    //проверим, что в нашем списке
                    let index = this.items.findIndex(p => p.Id == permitTemplate.Id);
                    if(index == -1) return;
                    if(action.Name == 'Update') {
                        Vue.set(this.items, index, permitTemplate);
                    } else if(action.Name == 'Remove') {
                        this.removeRow(permitTemplate);
                    }
                } else if(action.Name == 'Create') {
                    this.items.push(permitTemplate);
                }
            }
        },
    },
    created() {
        this.loadItems();
        EventBus.$on('serverPermitTemplateChanged', this.serverPermitTemplateChanged);
    },
    beforeDestroy() {
        EventBus.$off('serverPermitTemplateChanged', this.serverPermitTemplateChanged);
    },
})

</script>

<style lang="scss" scoped>

</style>