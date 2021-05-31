<template>

    <div class="no-select" style="height: 100%;">

        <Grid 
            :style="{ height: '100%' }"
            :data-items="sortedItems"
            :columns="columns">

            <template v-slot:cellTemplate="{props}">
                <td :class="[ props.className, props.dataItem.Type == 'header' ? 'header' : '' ]">
                    {{ props.dataItem[props.field] }}
                </td>
            </template>
        </Grid>

    </div>

</template>

<script>

export default {
    name: 'mask-simple-grouped-list',
    components: {
    },
    props: {
        items: { type: Array, required: true },     // [ NUmber, Header, Items: [ { Number, Mask } ] ]
    },    
    computed: {
        sortedItems() {
            let result = [...this.items].sort((a, b) => {
                if(a.Number == b.Number) return 1;
                return a.Number > b.Number ? 1 : -1;
            }).flatMap(p => {
                return [
                    { Number: p.Number, Card: '', Name: p.Header, Type: 'header' },
                    ...p.Items.sort((l, r) => {
                        if(l.Number == r.Number) return 1;
                        return l.Number > r.Number ? 1 : -1;
                    }).map(q => ({ Number: `${p.Number}.${q.Number}`, Card: q.Mask.CatalogItem.Name, Name: q.Mask.Name, Type: 'mask' })),
                ];
            });
            return result;
        },
    },
    data() {
        return {
            columns: [
                { field: "Number", title: "Номер", width: '70', cell: 'cellTemplate' },
                { field: "Card", title: "Карта защит/готовностей", cell: 'cellTemplate', width: '300' },
                { field: "Name", title: "Наименование", cell: 'cellTemplate', width: 'auto' },
            ],
        }
    },
}

</script>

<style lang="scss" scoped>

.header {
    background-color: #9ac9fff0;
}

</style>