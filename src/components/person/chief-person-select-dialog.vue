<template>

    <vu-modal   :isScroll="false" 
                :center="true" 
                :escapable="true" 
                :dismissable="false"
                selected-field="selected"
                size="xl" 
                className="d-modal"
                headerClassName="d-header"
                bodyClassName="d-body"
                class="no-select"
                style="height: 600px;">

        <template v-slot:header>
            <div class="h-flex">
                <span style="flex: 1 1 auto; margin-top: auto; margin-bottom: auto;">Выбор сотрудника</span>
                <div class="d-close-icon" @click="onCancel">
                    <fa icon="times" size="lg" />
                </div>
            </div>
        </template>

        <div class="full-size v-flex">
            <div class="d-container" style="flex: 1 1 100%; min-height: 0;">
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
                    @rowclick="onRowClick">

                    <grid-toolbar>
                        <div class="toolbar">
                            <button type='button' v-on:click='onCreatePersonCommand' class='k-button k-button-icontext k-grid-add'>
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
            </div>

            <div class="d-actions">
                <button class='k-button k-primary d-action-button' :disabled="selectedItem == null" @click="onConfirm" tabindex="3">Выбрать сотрудника</button>
                <button class='k-button d-action-button' @click="onCancel" tabindex="4">Отмена</button>
            </div>
        </div>

        <action-request ref="actionRequest"></action-request>

    </vu-modal>

</template>

<script>

import Vue from 'vue';
import axios from 'axios';
import ChiefPersonEditor from '@/components/person/chief-person-editor.vue';
import ActionRequest from '@/components/shared/action-request.vue';
import GridCommandCell from '@/components/shared/grid-command-cell.vue';

export default {
    name: 'chief-person-select-dialog',
    components: {
        ActionRequest,
    },
    data() {
        return {
            selectedItem: null,

            skip: 0,
            take: 20,
            total: 0,
            sort: [
                { field: 'Name', dir: 'asc' }
            ],
            items: [],
            columns: [
                { field: "Name", title: "Имя сотрудника", width: 220 },
                { field: "Position", title: "Должность", width: 'auto' },
                { field: "Fired", title: "Уволен", width: 80, cell: 'boolTemplate' },
                { title: " ", cell: GridCommandCell, width: 100 },
            ],

            clickTimeoutHandler: null,   
            clickCounter: 0, 
        }
    },
    computed: {
    },
    methods: {
        loadItems() {
            axios.post(`../api/person/read`, { request: { take: this.take, skip: this.skip, sort: this.sort, filter: this.getFilter() } })
            .then(response => {
                if(!response.data.HasError) {
                    this.items = response.data.Result.Data.map(p => {
                        return {
                            ...p,
                            selected: false,
                        };
                    });
                    this.total = response.data.Result.Total;
                }
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
                value: true,
                operator: 'eq',
            });

            return filter.filters.length > 0 ? filter : null;
        },

        change(dataItem) {
            this.$modals.open({
                component: ChiefPersonEditor,
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
                        axios.post(`../api/person/remove`, { id: dataItem.Id })
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
                component: ChiefPersonEditor,
                props: {
                    id: null,
                },
                onClose: person => {
                    this.refreshRow(person);
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

        onClick(dataItem) {
            if(this.selectedItem != null) {
                this.selectedItem.selected = false;
            }
            this.selectedItem = this.items.find(p => p.Id == dataItem.Id);
            if(this.selectedItem != null) {
                this.selectedItem.selected = true;
            }
        },

        onDblClick(dataItem) {
            if(this.selectedItem != null) {
                this.selectedItem.selected = false;
            }
            this.selectedItem = this.items.find(p => p.Id == dataItem.Id);
            if(this.selectedItem != null) {
                this.selectedItem.selected = true;
                this.onConfirm();
            }
        },

        onConfirm() {
            this.$modals.close(this.selectedItem);
        },

        onCancel() {
            this.$modals.dismiss();
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