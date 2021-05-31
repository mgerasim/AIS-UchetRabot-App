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
                v-show='!dataItem.IsDeleted' 
                class="grid-command-cell-command grid-command-cell-remove-command content-center" 
                @click="$emit('remove', dataItem)" title='Удалить'>
                <fa icon="times"></fa>
            </div>
            <div
                v-show='dataItem.IsDeleted' 
                class="grid-command-cell-command grid-command-cell-restore-command content-center" 
                @click="$emit('restore', dataItem)" title='Восстановить'>
                <fa icon="undo"></fa>
            </div>
        </div>
    </td>
</template>

<script>
    export default {
        name: 'pipeline-list-command-cell',
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
            onRestore() {
                this.$emit('restore', this.dataItem);
            },
        },
    }
</script>