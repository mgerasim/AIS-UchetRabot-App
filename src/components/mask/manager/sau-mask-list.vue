<template>

    <div class="no-select" style="height: 100%;">

        <Grid :style="{height: '100%'}"
            :data-items="filteredItems"
            :columns="columns"
            :sortable="false"
            selected-field="selected"
            @rowclick="onRowClick">

            <template v-slot:nameTemplate="{props}">
                <td :class="[props.className, props.dataItem.IsDeleted && 'removed-item' ]" :style="{ 'font-weight': props.dataItem.Priority > 0 ? 'bold' : 'unset' }">
                    {{ props.dataItem.Name }}
                </td>
            </template>

            <grid-toolbar>
                <div class="toolbar">
                    <div class="search">
                        <search-box  
                                @search="onSearch($event)"
                                @change="onSearch($event)"
                                @clear="onSearch(null)" />
                    </div>
                    <div class="actions">
                        <button class="k-button" title="Добавить защиту" @click="onCreate">
                            <fa icon="plus"></fa>
                        </button>
                        <button :disabled="!hasSelected" class="k-button" title="Редактировать защиту" @click="onChange(selectedItem)">
                            <fa icon="pencil-alt"></fa>
                        </button>
                        <button v-if="!hasSelected || !selectedItem.IsDeleted" :disabled="!hasSelected" class="k-button" title="Удалить защиту" @click="onRemove(selectedItem)">
                            <fa icon="trash"></fa>
                        </button>
                        <button v-else class="k-button" title="Восстановить удаленную защиту" @click="onRestore(selectedItem)">
                            <fa icon="trash-restore"></fa>
                        </button>
                        <div style="flex: 1 1 100%; min-width: 0;"></div>
                        <button class="k-button" 
                                :title="showDeleted ? 'Скрыть удаленные' : 'Показать удаленные'"
                                @click="showDeleted = !showDeleted">
                            <fa v-if="showDeleted" icon="eye"></fa>
                            <fa v-else icon="eye-slash"></fa>
                        </button>
                    </div>
                </div>
            </grid-toolbar>

        </Grid>

    </div>

</template>

<script lang="ts">

import SearchBox from '@/components/shared/search-box.vue';
import SauMaskEditor from '@/components/mask/manager/sau-mask-editor.vue';
import MaskService from '@/core/services/mask-service';
import { ref, computed, watch, defineComponent } from '@vue/composition-api'
import { orderBy } from '@progress/kendo-data-query';
import { debounce } from '@/core/helpers/utils';
import IFullMask from '@/core/types/mask/fullMask';
import ISimpleMask from '@/core/types/mask/simpleMask';

export default defineComponent({
    name: 'sau-mask-list',
    components: {
        SearchBox,
    },
    props: {
        'catalogItemId': { type: Number, required: true },
        'maskCatalogId': { type: Number, required: true },
    },    
    setup(props, context) {
        let items = ref<ISimpleMask[]>([]);
        let selectedItem = ref<ISimpleMask | null>(null);
        let hasSelected = computed(() => selectedItem.value != null);

        let showDeleted = ref(false);

        let searchString = ref<String | null>(null);

        let columns = [
            { field: "Name", title: "Наименование", cell: 'nameTemplate', width: 'auto', sortable: false },
        ];

        watch(() => props.catalogItemId, () => {
            loadItems();
        });

        let filteredItems = computed(() => {
            let result = items.value;
            
            //строка фильтра
            if(searchString.value != null && searchString.value.trim() != '') {
                let splitted = searchString.value.split(' ')
                                            .filter(p => p.trim() != '')
                                            .map(p => p.toLowerCase());
                result = result.filter(p => splitted.every(t => p.Name.toLowerCase().includes(t)));
            }

            result = result.filter(p => showDeleted.value ? true : !p.IsDeleted).map(p => {
                return {
                    selected: selectedItem.value != null && selectedItem.value.Id == p.Id,
                    ...p,
                };
            });

            return result.sort((left, right) => {
                if(left.Priority > right.Priority) return -1;
                if(left.Priority < right.Priority) return +1;
                if(left.Number != null && right.Number != null) {
                    if(left.Number > right.Number) return +1;
                    if(left.Number < right.Number) return -1;
                }
                if(left.Id != null && right.Id != null) {
                    if(left.Id > right.Id) return +1;
                    if(left.Id < right.Id) return -1;
                }
                return 0;
            });
        });

        function loadItems() {
            MaskService.getAllByCatalogItem(props.catalogItemId, true)
                .then(response => {
                    if(response.data.HasError) throw response.data.ErrorMessage;
                    items.value = response.data.Result;
                    selectedItem.value = null;
                })
                .catch(e => {
                    alert(e);
                    console.log(e);
                });
        }

        let onRowClick = (event) => {
            selectedItem.value = event.dataItem;            
        };

        let onSearch = debounce(function(value: String) {
            searchString.value = value;
        }, 500);

        function updateItem(item: ISimpleMask) {
            items.value = [ ...items.value.filter(p => p.Id != item.Id), item ];
            selectedItem.value = (!item.IsDeleted || showDeleted.value) ? item : null;
        }

        let onRemove = (item: ISimpleMask) => {
            context.root.$dialogs.requestAction({
                title: 'Внимание',
                message: `Вы действительно хотите удалить защиту '${item.Name}'?`,
                actions: [{ key: 'YES_KEY', text: 'Удалить', icon: 'trash' }, { key: 'NO_KEY', text: 'Нет' }],
                defaultActionKey: 'NO_KEY',
                icon: 'question',
            })
            .then((key: String) => {
                if (key == 'YES_KEY') {
                    MaskService.remove(item.Id)
                        .then(response => {
                            if(response.HasError) throw response.ErrorMessage;
                            updateItem(response.Result);
                        })
                        .catch(e => {
                            alert(e);
                            console.log(e);
                        });
                }
            });
        };

        let onRestore = (item: ISimpleMask) => {
            MaskService.restore(item.Id)
                .then(response => {
                    if(response.HasError) throw response.ErrorMessage;
                    updateItem(response.Result);
                })
                .catch(e => {
                    alert(e);
                    console.log(e);
                });
        };

        function onChange(item: ISimpleMask) {
            context.root.$modals.open({
                component: SauMaskEditor,
                props: {
                    id: item.Id,
                    catalogItemId: props.catalogItemId,
                    maskCatalogId: props.maskCatalogId,
                },
                onClose: (mask: IFullMask) => {
                    updateItem(mask);
                },
            });
        }

        function onCreate() {
            context.root.$modals.open({
                component: SauMaskEditor,
                props: {
                    id: null,
                    catalogItemId: props.catalogItemId,
                    maskCatalogId: props.maskCatalogId,
                },
                onClose: (mask: IFullMask) => {
                    updateItem(mask);
                },
            });
        }

        loadItems();

        return {
            columns,
            items,
            showDeleted,
            selectedItem,
            hasSelected,
            searchString,
            filteredItems,
            onRowClick,
            onSearch,
            onRemove,
            onRestore,
            onChange,
            onCreate,
        };
    },
})

</script>

<style lang="scss" scoped>

.toolbar {
    display: flex;
    flex-flow: column nowrap;

    .actions {
        display: flex;
        flex-flow:  row nowrap;
        margin-top: 4px;

        button:not(:first-child) {
            margin-left: 4px;
        }
    }

}

.removed-item {
    text-decoration: line-through;
    color: gray;
}

</style>