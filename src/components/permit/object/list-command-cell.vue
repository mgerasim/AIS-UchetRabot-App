<template>
    <td>
        <div class="commands">
            <div 
                class='command content-center edit-command' 
                @click="$emit('change', dataItem)" 
                title='Изменить'>
                <fa icon="pencil-alt"></fa>
            </div>
            <div
                class="command content-center remove-command" 
                @click="$emit('remove', dataItem)" title='Удалить'>
                <fa icon="times"></fa>
            </div>
        </div>
    </td>
</template>

<script>
    export default {
        name: 'command-cell',
        props: {
            field: String,
            dataItem: Object,
            format: String,
            className: String,
            columnIndex: Number,
            columnsCount: Number,
            rowType: String,
            level: Number,
            expanded: Boolean,
            editor: String
        },
        data() {
            return {};
        },
        methods: {
            onChange() {
                this.$emit('change', this.dataItem);
            },
            onRemove() {
                this.$emit('remove', this.dataItem);
            },
        },
    }
</script>

<style>

.list-commands {
    padding-top: 4px;
    padding-bottom: 4px;
}

.list-commands > .command-button {
    width: 30px;
    min-width: 30px;
    margin-left: 8px;
}

</style>