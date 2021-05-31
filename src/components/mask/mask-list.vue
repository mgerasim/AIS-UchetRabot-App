<template>

    <div class="no-select" style="height: 100%;">

        <Grid :style="{height: '100%'}"
            :data-items="filteredItems"
            :columns="columns"
            :sortable="false"
            selected-field="selected"
            @selectionchange="onSelectionChange"
            @headerselectionchange="onHeaderSelectionChange"
            @rowclick="onRowClick">

            <template v-slot:checkBoxTemplate="{props, listeners}">
                <td :class="props.className">
                    {{ props.dataItem[props.field] ? 'Да' : '' }}
                </td>
            </template>

            <template v-slot:nameTemplate="{props, listeners}">
                <td :class="props.className" :style="{ 'font-weight': props.dataItem.Priority > 0 ? 'bold' : 'unset' }">
                    {{ props.dataItem.Name }}
                </td>
            </template>

            <grid-toolbar>
                <div class="toolbar">
                    <search-box  
                            @search="onSearch($event)"
                            @change="onSearch($event)"
                            @clear="onSearch(null)" />
                </div>
            </grid-toolbar>

        </Grid>

    </div>

</template>

<script>

import SearchBox from '@/components/shared/search-box';
import MaskService from '@/core/services/mask-service';
import { orderBy } from '@progress/kendo-data-query';
import { debounce } from '@/core/helpers/utils';

export default {
    name: 'mask-list',
    components: {
        SearchBox,
    },
    props: {
        'catalogItemId': { type: Number, required: true },
        'maskCatalogId': { type: Number, required: true },
        'isSelector': { type: Boolean, default: false },
        'selectedItems': { type: Array, default: () => [] },
    },    
    watch: {
        catalogItemId(newValue, oldValue) {
            this.loadItems();
        }
    },
    computed: {
        filteredItems() {
            let result = this.items;
            
            //строка фильтра
            if(this.searchString != null && this.searchString.trim() != '') {
                let splitted = this.searchString.split(' ').filter(p => p.trim() != '').map(p => p.toLowerCase());
                result = result.filter(p => splitted.every(t => p.Name.toLowerCase().includes(t)));
            }

            //выбранные маски
            result = result.map(p => {
                return {
                    selected: this.selectedItems.some(t => t.Id == p.Id),
                    ...p,
                };
            });

            return result.sort((left, right) => {
                if(left.Priority > right.Priority) return -1;
                if(left.Priority < right.Priority) return +1;
                if(left.Number > right.Number) return +1;
                if(left.Number < right.Number) return -1;
                if(left.Id > right.Id) return +1;
                if(left.Id < right.Id) return -1;
                return 0;
            });
        },

        allSelected() {
            return this.filteredItems.findIndex(item => item.selected === false) === -1;
        },

        columns() {
            return this.isSelector ? [
                { field: 'selected', width: '50px', headerSelectionValue: this.allSelected },
                ...this.staticColumns,
            ] : this.staticColumns;
        },
    },
    data() {
        return {
            items: [],
            staticColumns: [
                { field: "Name", title: "Наименование", cell: 'nameTemplate', width: 'auto', sortable: false },
            ],
            searchString: null,
        }
    },
    methods: {
        loadItems() {
            MaskService.getAllByCatalogItem(this.catalogItemId)
                .then(response => {
                    if(response.data.HasError) throw response.data.ErrorMessage;
                    this.items = response.data.Result;
                })
                .catch(e => {
                    alert(e);
                    console.log(e);
                });
        },

        onRowClick (event) {
            if(!this.isSelector) return;

            if(event.dataItem.selected) {
                this.$emit('unselect', event.dataItem);
            } else {
                this.$emit('select', event.dataItem);
            }
        },

        onSelectionChange(event) {
            if(!this.isSelector) return;

            if(event.dataItem.selected) {
                this.$emit('unselect', event.dataItem);
            } else {
                this.$emit('select', event.dataItem);
            }
        },

        onHeaderSelectionChange(event) {
            if(!this.isSelector) return;

            if(event.event.target.checked) {
                this.$emit('select', this.filteredItems);
            } else {
                this.$emit('unselect', this.filteredItems);
            }
        },

        onSearch: debounce(function(value) {
            this.searchString = value;
        }, 500),
    },
    created() {
        this.loadItems();
    },
}

</script>

<style lang="scss" scoped>

</style>