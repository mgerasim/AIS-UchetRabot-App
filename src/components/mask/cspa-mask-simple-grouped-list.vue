<template>

    <div class="no-select" style="height: 100%;">

        <Grid 
            :style="{ height: '100%' }"
            :data-items="sortedItems"
            :columns="columns">

            <template v-slot:numberTemplate="{props}">
                <td :class="props.className">
                    {{ props.dataItem.number }}
                </td>
            </template>

            <template v-slot:nameTemplate="{props}">
                <td :class="props.className">
                    {{ props.dataItem.name }}
                </td>
            </template>

            <template v-slot:outputTemplate="{props}">
                <td :class="props.className">
                    {{ props.dataItem.output }}
                </td>
            </template>

            <template v-slot:inputTemplate="{props}">
                <td :class="props.className">
                    <table>
                        <tr v-for="inputMask in props.dataItem.input" :key="'mask_' + inputMask.Mask.Id">
                            <td>{{ inputMask.Mask.Name }}</td>
                        </tr>
                    </table>
                </td>
            </template>
        </Grid>

    </div>

</template>

<script>

export default {
    name: 'cspa-mask-simple-grouped-list',
    components: {
    },
    props: {
        items: { type: Array, required: true },     // [ NUmber, Header, Items: [ { Number, Mask } ] ]
    },    
    computed: {
        sortedItems() {
            let result = [...this.items].sort((a, b) => {
                if(a.Number == b.Number) return 0;
                return a.Number > b.Number ? 1 : -1;
            }).flatMap(p => {

                var map = this.groupBy([...p.Items], item => item.Mask.CatalogItem.Id);
                map = map.map(p => {
                    let key = p.key;
                    let items = p.items;
                    let output = items.find(t => t.Mask.Priority == 1);
                    let input = items.filter(t => t.Mask.Priority == 0);
                    let catalogItem = items[0].Mask.CatalogItem;
                    return {
                        catalogItem: catalogItem,
                        output: output != null ? '+' : '',
                        input: input,
                    };
                });
                map.sort((a, b) => {
                    if(a.catalogItem.Order == b.catalogItem.Order) return 0;
                    return a.catalogItem.Order > b.catalogItem.Order ? 1 : -1;
                });

                return [
                    ...map.map(q => ({
                        number: q.catalogItem.Order,
                        name: q.catalogItem.Name,
                        type: 'mask',
                        ...q,
                    })),
                ];
            });

            return result;
        },
    },
    data() {
        return {
            columns: [
                { field: "number", title: "Номер", width: '70', cell: 'numberTemplate', headerClassName: 'grid-header' },
                { field: "name", title: "Наименование защиты", cell: 'nameTemplate', headerClassName: 'grid-header', width: '500' },
                { field: "output", title: "Маскирование выхода защиты", cell: 'outputTemplate', className: 'text-center', headerClassName: 'grid-header', width: '130' },
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
}

</script>

<style lang="scss" scoped>

</style>