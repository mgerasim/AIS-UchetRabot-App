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

            <template v-slot:stateTemplate="{props}">
                <td :class="[ props.className, props.dataItem.Type == 'header' ? 'header' : '' ]">
                    <div :id="'row_' + props.dataItem.Number">{{ formatState(props.dataItem[props.field]) }}</div>
                    <b-popover v-if="props.dataItem.Type == 'mask'" :target="'row_' + props.dataItem.Number" triggers="hover" placement="top">
                        <template v-slot:title>Информация</template>
                        <div class="v-flex container">
                            <div class="row form-group">
                                <span class="col-md-6">Последнее чтение OPC</span>
                                <span class="col-md-6">{{ formatDateTime(props.dataItem.Payload.State.LastOpcDateUtc) }}</span>
                            </div>
                            <div class="row form-group">
                                <span class="col-md-6">Последнее <b>корректное</b> чтение OPC</span>
                                <span class="col-md-6" :class="[ props.dataItem.Payload.State.LastOpcGood ? 'last-opc-good' : 'last-opc-bad' ]">
                                    {{ formatDateTime(props.dataItem.Payload.State.LastGoodOpcDateUtc) }}
                                </span>
                            </div>
                            <div class="row form-group">
                                <span class="col-md-6">Последнее изменение состояния</span>
                                <span class="col-md-6">{{ formatDateTime(props.dataItem.Payload.State.DateUtc) }}</span>
                            </div>
                        </div>
                    </b-popover>
                </td>
              </template>

        </Grid>

    </div>

</template>

<script>

import moment from 'moment';

export default {
    name: 'mask-with-state-list',
    components: {
    },
    props: {
        system: { type: String, required: true },   // 'MPSA', 'ESU', 'CSPA'
        items: { type: Array, required: true },     // [ Number, Header, Items: [ { Number, Mask } ] ]
    },    
    computed: {
        sortedItems() {
            let result = [...this.items.filter(p => p.System.Name == this.system)].sort((a, b) => {
                if(a.Number == b.Number) return 1;
                return a.Number > b.Number ? 1 : -1;
            }).flatMap(p => {
                return [
                    { 
                        Number: p.Number, 
                        Card: '', Name: p.Header, 
                        Type: 'header',
                        Payload: null, 
                    },
                    ...p.Items.sort((l, r) => {
                        if(l.Number == r.Number) return 1;
                        return l.Number > r.Number ? 1 : -1;
                    }).map(q => ({ 
                        Number: `${p.Number}.${q.Number}`, 
                        Card: q.Mask.CatalogItem.Name, 
                        Name: q.Mask.Name, Type: 'mask',
                        Payload: q.Payload, 
                    })),
                ];
            });
            return result;
        },

        columns() {
            if(this.system == 'NPS') return [this.numberColumn, this.cardColumn, this.nameColumn, this.stateColumn];
            if(this.system == 'ESU') return [this.numberColumn, this.cardColumn, this.nameColumn, this.stateColumn];
            if(this.system == 'CSPA') return [this.numberColumn, this.cardColumn, this.nameColumn, this.stateColumn];
            return [];
        },
    },
    data() {
        return {
            numberColumn: { field: "Number", title: "Номер", width: '70', cell: 'cellTemplate' },
            cardColumn:  { field: "Card", title: "Карта защит/готовностей", cell: 'cellTemplate', width: '300' },
            nameColumn: { field: "Name", title: "Наименование", cell: 'cellTemplate', width: 'auto' },
            stateColumn: { field: "Payload", title: "Состояние", cell: 'stateTemplate', width: 'auto' },
        }
    },
    methods: {
        formatState(payload) {
            if(payload == null) return '';
            if(payload.State.State.Name == 'Set') return 'Установлена';
            if(payload.State.State.Name == 'Unset') return 'Снята';
            return '';
        },

        formatDateTime(date) {
            if(date == null) return '';
            return moment(date).format('DD.MM.YYYY HH:mm');
        },
    },
}

</script>

<style lang="scss" scoped>

.header {
    background-color: #9ac9fff0;
}

.last-opc-good {
}

.last-opc-bad {
    color: #ff0000f0;
}

</style>