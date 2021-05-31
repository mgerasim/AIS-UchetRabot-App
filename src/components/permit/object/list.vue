<template>

<div>
    <Grid :style="{height: '100%'}"
        :data-items="items"
        :columns="columns"
        @change="change"
        @remove="remove">

        <template v-slot:dateTemplate="{props, listeners}">
            <td :class="props.className">
                {{ formatDate(props.dataItem[props.field]) }}
            </td>
        </template>

        <grid-toolbar v-if="!readOnly">
            <div class="toolbar">
                <button type='button' v-on:click='onCreatePermitObjectCommand' class='k-button k-button-icontext k-grid-add'>
                    <fa icon="plus"></fa>&nbsp;Добавить объект
                </button>
            </div>
        </grid-toolbar>

    </Grid>
</div>

</template>

<script>

import CommandCell from '@/components/permit/object/list-command-cell';
import Editor from '@/components/permit/object/editor';
import Vue from 'vue';

export default {
    name: 'permit-object-list',
    props: {
        value: { type: Array, required: true },
        readOnly: { type: Boolean, default: true },
    },
    computed: {
        items() {
            return this.value.map(p => {
                return {
                    guid: p.Guid,
                    display: this.formatDisplay(p),
                };
            });
        },

        columns() {
            return this.readOnly ? 
                    this.staticColumns : 
                    [   ...this.staticColumns,
                        { title: " ", cell: CommandCell, width: 90 },
                    ];
        },
    },
    data() {
        return {
            staticColumns: [
                { field: "display", title: " ", width: 'auto' },
            ],
        };
    },
    methods: {
        onCreatePermitObjectCommand() {
            this.$modals.open({
                component: Editor,
                props: {
                },
                onClose: permitObject => {
                    if(permitObject instanceof Array) {
                        this.$emit('input', [ ...this.value, ...permitObject ]);
                    } else {
                        this.$emit('input', [ ...this.value, permitObject ]);
                    }
                },
            });
        },

        change(dataItem) {
            let sourcePermitObject = this.value.find(p => p.Guid == dataItem.guid);
            this.$modals.open({
                component: Editor,
                props: {
                    permitObject: sourcePermitObject,
                },
                onClose: permitObject => {
                    let result = [ ...this.value ];
                    let index = result.findIndex(p => p.Guid == permitObject.Guid);
                    if(index > -1) Vue.set(result, index, permitObject);
                    this.$emit('input', result);
                },
            });
        },

        remove(dataItem) {
            let result = [ ...this.value ];
            let index = result.findIndex(p => p.Guid == dataItem.guid);
            if(index > -1) result.splice(index, 1);
            this.$emit('input', result);
        },

        formatDisplay(dataItem) {
            if(dataItem == null) return '';
            let result = '';
            if(dataItem.Object != null) result += dataItem.Object.Name;
            if(result != '') result += ', ';
            if(dataItem.Km == dataItem.KmStart && dataItem.Km == dataItem.KmEnd) {
                result += `км ${dataItem.Km}`;
            } else {
                result += `км ${dataItem.KmStart} - ${dataItem.KmEnd}`;
            }
            return result;
        },
    },
}

</script>

<style lang="scss" scoped>

</style>