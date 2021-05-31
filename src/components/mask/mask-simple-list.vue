<template>

    <div class="no-select" style="height: 100%;">

        <div class="h-flex" style="height: 100%;">

            <Grid 
                style="flex: 1 1 100%; min-width: 0;"
                :style="{ height: '100%' }"
                :data-items="sortedItems"
                :columns="columns"
                :selected-field="selectedField"
                @rowclick="onRowClick">

                <template v-slot:checkBoxTemplate="{props}">
                    <td :class="props.className" :key="props.dataItem.Mask.Id">
                        <input type="checkbox" class="k-checkbox" :checked="true" @change="$emit('unselect', props.dataItem.Mask)">
                    </td>
                </template>

                <template v-slot:numberTemplate="{props}">
                    <td :class="props.className">
                        {{ `${groupNumber}.${props.dataItem.Number}` }}
                    </td>
                </template>

            </Grid>

            <div class="v-flex" style="flex: 1 1 auto; justify-content: center; margin-left: 4px;">
                <button class="k-button" style="margin-button: 16px;" 
                        :disabled="selectedItem == null || selectedItem.Number <= 1"
                        title="Преместить выше"
                        @click="$emit('maskUp', selectedId)">
                    <fa icon="angle-up"></fa>
                </button>
                <button class="k-button" style="margin-top: 16px;" 
                        :disabled="selectedItem == null || selectedItem.Number >= items.length"
                        title="Преместить ниже"
                        @click="$emit('maskDown', selectedId)">
                    <fa icon="angle-down"></fa>
                </button>
            </div>

        </div>

    </div>

</template>

<script>

export default {
    name: 'mask-simple-list',
    components: {
    },
    props: {
        groupNumber: { type: Number, required: false },
        items: { type: Array, required: true },     // [ { Number, Mask } ]
    },    
    computed: {
        sortedItems() {
            let result = [...this.items].sort((a, b) => {
                if(a.Number == b.Number) return 1;
                return a.Number > b.Number ? 1 : -1;
            }).map(p => ({ ...p, selected: p.Mask.Id == this.selectedId }));
            return result;
        },

        selectedItem () {
            return this.items.find(item => item.Mask.Id === this.selectedId);
        },

    },
    data() {
        return {
            selectedField: 'selected',
            selectedId: null,

            columns: [
                { field: 'selectedOther', title: ' ', width: '50px', cell: 'checkBoxTemplate' },
                { field: "Number", title: "Номер", width: '70', cell: 'numberTemplate' },
                { field: "Mask.CatalogItem.Name", title: "Карта защит/готовностей", width: '300' },
                { field: "Mask.Name", title: "Наименование", width: 'auto' },
            ],
        }
    },
    methods: {
        onRowClick (event) {
            this.selectedId = event.dataItem.Mask.Id;
        },
    },
    created() {
    },
}

</script>

<style lang="scss" scoped>

</style>