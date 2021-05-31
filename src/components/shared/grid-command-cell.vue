<template>
    <td>
        <div class="grid-command-cell-commands">
            <div 
                class='grid-command-cell-command grid-command-cell-edit-command content-center' 
                @click="$emit('change', dataItem)" 
                title='Изменить'>
                <fa icon="pencil-alt"></fa>
            </div>
            <div
                class="grid-command-cell-command grid-command-cell-remove-command content-center" 
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
    }
</script>