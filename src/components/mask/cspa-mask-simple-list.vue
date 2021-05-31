<template>

    <div class="no-select" style="height: 100%;">

        <div class="h-flex" style="height: 100%;">

            <Grid 
                style="flex: 1 1 100%; min-width: 0;"
                :style="{ height: '100%' }"
                :data-items="sortedItems"
                :columns="columns">

                <template v-slot:outputTemplate="{props}">
                    <td :class="props.className" class="text-center">
                        <input v-if="props.dataItem.output != null" type="checkbox" class="k-checkbox" :checked="true" @change="$emit('unselect', props.dataItem.output.Mask)">
                    </td>
                </template>

                <template v-slot:inputTemplate="{props}">
                    <td :class="props.className">
                        <table>
                            <tr v-for="inputMask in props.dataItem.input" :key="'mask_' + inputMask.Mask.Id">
                                <td style="width: 50px;" class="text-center">
                                    <input type="checkbox" class="k-checkbox" :checked="true" @change="$emit('unselect', inputMask.Mask)">
                                </td>
                                <td>{{ inputMask.Mask.Name }}</td>
                            </tr>
                        </table>
                    </td>
                </template>
            </Grid>

        </div>

    </div>

</template>

<script>

export default {
    name: 'cspa-mask-simple-list',
    components: {
    },
    props: {
        groupNumber: { type: Number, required: false },
        items: { type: Array, required: true },     // [ { Number, Mask } ]
    },    
    computed: {
        sortedItems() {
            var map = this.groupBy([...this.items], item => item.Mask.CatalogItem.Id);
            map = map.map(p => {
                let key = p.key;
                let items = p.items;
                let output = items.find(t => t.Mask.Priority == 1);
                let input = items.filter(t => t.Mask.Priority == 0);
                let catalogItem = items[0].Mask.CatalogItem;
                return {
                    catalogItem: catalogItem,
                    output: output,
                    input: input,
                };
            });
            map.sort((a, b) => {
                if(a.catalogItem.Order == b.catalogItem.Order) return 0;
                return a.catalogItem.Order > b.catalogItem.Order ? 1 : -1;
            });

            return map;
        },
    },
    data() {
        return {
            columns: [
                { field: "catalogItem.Order", title: "Номер", width: '70', headerClassName: 'grid-header' },
                { field: "catalogItem.Name", title: "Наименование защиты", headerClassName: 'grid-header', width: '500' },
                { field: "output.Mask.Name", title: "Маскирование выхода защиты", cell: 'outputTemplate', headerClassName: 'grid-header', width: '130' },
                { field: "input", title: "Маскирование входов защиты", cell: 'inputTemplate', headerClassName: 'grid-header', width: 'auto' },
            ],
        }
    },
    methods: {
        groupBy(list, keyGetter) {
            const map = new Map();
            list.forEach((item) => {
                const key = keyGetter(item);
                const collection = map.get(key);
                if (!collection) {
                    map.set(key, [item]);
                } else {
                    collection.push(item);
                }
            });

            let result = [];
            for(let key of map.keys()) {
                result.push({
                    key: key,
                    items: map.get(key),
                });
            }
            return result;
        },    
    },
    created() {
    },
}

</script>

<style lang="scss" scoped>

</style>