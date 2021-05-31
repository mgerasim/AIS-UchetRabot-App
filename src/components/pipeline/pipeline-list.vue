<template>
    <div style="height: 100%;">

        <Grid :style="{height: '100%'}"
            :data-items="filteredItems"
            selected-field="selected"
            :columns="columns"
            @change="change"
            @remove="remove"
            @restore="restore"
            @rowclick="onRowClick">

            <grid-toolbar>
                <div class="h-flex toolbar">
                    <button type='button' v-on:click='onCreatePipelineCommand' class='k-button k-button-icontext'>
                        <fa icon="plus"></fa>&nbsp;Добавить участок нефтепровода
                    </button>
                    <file-upload-button @upload="onImportCoordinatesCommand" :disabled='selectedId == null' class='k-button k-button-icontext'>
                        <fa icon="file-import"></fa>&nbsp;Импортировать координаты
                    </file-upload-button>
                    <!-- <button type='button' @click='onImportCoordinatesCommand' > -->
                        
                    <div style='align-self:center; margin-left: auto; margin-right: 8px;'>
                        <input id='filter-deleted' type='checkbox' v-model="showDeleted" class="k-checkbox" />
                        <label for='filter-deleted' title='Показать удаленные' style='margin-left: 4px;' class="k-checkbox-label">
                            <span>также показать удаленные</span>
                        </label>
                    </div>
                </div>
            </grid-toolbar>

            <template v-slot:isDeletedHeaderTemplate="{props, listeners}" >
                <div style="text-align: center;"><fa icon="trash"></fa></div>
            </template>

            <template v-slot:isDeletedCellTemplate="{props}">
                <td :class="props.className">
                    <div v-if="props.dataItem != null" class="text-center">
                        <fa v-if="props.dataItem[props.field]" icon="trash"></fa>
                    </div>
                </td>
            </template>

        </Grid>

        <action-request ref="actionRequest"></action-request>
        <!-- <file-request ref="fileRequest"></file-request> -->

    </div>
</template>

<script>

import Vue from 'vue';
import axios from 'axios';
import PipelineEditor from '@/components/pipeline/pipeline-editor.vue';
//import ResizeMixin from 'vue-resize-mixin';
import ActionRequest from '@/components/shared/action-request.vue';
import CommandCell from '@/components/pipeline/pipeline-list-command-cell';
import FileUploadButton from '@/components/shared/file-upload-button';

export default {
    name: 'pipeline-list',
    components: {
        ActionRequest,
        FileUploadButton,
    },
//    mixins: [ResizeMixin],
    data() {
        return {
            selectedId: null,
            items: [],
            showDeleted: false,
            columns: [
                { field: "IsDeleted", title: " ", width: 50, cell: 'isDeletedCellTemplate', headerCell: 'isDeletedHeaderTemplate' },
                { field: "Name", title: "Наименование", width: 'auto' },
                { field: "KmStart", title: "Расположение (начало), км", format:"{0:0.000}", width: 220 },
                { field: "KmEnd", title: "Расположение (конец), км", format: "{0:0.000}", width: 220 },
                { title: " ", cell: CommandCell, width: 100 },
            ],
        }
    },
    computed: {
        filteredItems() {
            return this.showDeleted ? this.items : this.items.filter(p => !p.IsDeleted).map(p => ({...p, selected: p.Id == this.selectedId}));
        },

        selectedItem() {
            return this.items.find(p => p.Id == this.selectedId);
        }
    },
    methods: {
        //onWindowResize: function(event) {
            //var width = event.width;
            //var height = event.height;
            //var grid = this.$refs.pipelineGrid.kendoWidget();
            //grid.resize();
        //},

        loadItems() {
            axios.post(`../api/pipeline/read`)
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
                component: PipelineEditor,
                props: {
                    id: dataItem.Id,
                },
                onClose: pipeline => {
                    this.refreshRow(pipeline);
                },
            });
        },

        refreshRow(pipeline) {
            let index = this.items.findIndex(p => p.Id == pipeline.Id);
            if(index == -1) {
                this.items.push(pipeline);
            } else {
                Vue.set(this.items, index, pipeline);
            }
        },

        remove(dataItem) {
            this.$refs.actionRequest.request('Внимание',
                `Вы действительно хотите удалить участок нефтепровода ${dataItem.Name}?`,
                [{ name: 'no', title: 'Нет' }, { name: 'yes', title: 'Да' }],
                requestResult => {
                    if (requestResult == 'yes') {
                        axios.post(`../api/pipeline/removePipeline`, { pipelineId: dataItem.Id })
                            .then(response => {
                                if(response.data.HasError) throw response.data.ErrorMessage;
                                this.refreshRow(response.data.Result);
                            })
                            .catch(e => {
                                console.log(e);
                            });
                    }
                }
            );
        },

        restore(dataItem) {
            axios.post(`../api/pipeline/restorePipeline`, { pipelineId: dataItem.Id })
                .then(response => {
                    if(response.data.HasError) throw response.data.ErrorMessage;
                    this.refreshRow(response.data.Result);
                })
                .catch(e => {
                    console.log(e);
                });
        },

        onCreatePipelineCommand() {
            this.$modals.open({
                component: PipelineEditor,
                props: {
                    id: null,
                },
                onClose: pipeline => {
                    this.refreshRow(pipeline);
                },
            });
        },

        onImportCoordinatesCommand(file) {
            if(this.selectedItem == null) return;
//            this.$refs.fileRequest.request('Выберите файл Excel с координатами', files => {
//                var file = files[0];
                axios.post(`../api/pipeline/importCoordinates`, { pipelineId: this.selectedItem.Id, fileName: file.name, content: file.content })
                    .then(response => {
                        if(response.data.HasError) throw response.data.ErrorMessage;
                    })
                    .catch(e => {
                        console.log(e);
                        alert(e);
                    });
//            });
        },

        onRowClick(e) {
            this.selectedId = e.dataItem.Id;
        }
    },
    created: function () {
        //this.$on('resize', this.onWindowResize);
        this.loadItems();
    },
    beforeDestroy: function () {
        //this.$off('resize');
    }
}

</script>

<style scoped>

.toolbar > * {
    margin-right: 8px;
}

</style>