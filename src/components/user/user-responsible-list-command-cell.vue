<template>
    <td v-if="!dataItem['inEdit']">
        <div class="user-responsible-list-commands">
            <button
                class="btn btn-sm btn-outline-secondary command-button"
                @click="editHandler"
                title='Изменить'>
                <fa icon="pencil-alt"></fa>
            </button>
            <button
                class="btn btn-sm btn-outline-secondary command-button"
                @click="removeHandler"
                title='Удалить'>
                <fa icon="trash"></fa>
            </button>
        </div>
    </td>
    <td v-else>
        <div class="user-responsible-list-commands">
            <button
                class="btn btn-sm btn-outline-secondary command-button"
                @click="addUpdateHandler"
                :title="this.dataItem.Id ? 'Обновить' : 'Добавить'">
                <fa icon="check"></fa>
            </button>
            <button
                class="btn btn-sm btn-outline-secondary command-button"
                @click="cancelDiscardHandler"
                title='Отменить'>
                <fa icon="times"></fa>
            </button>
        </div>
    </td>
</template>

<script>
    export default {
        name: 'user-responsible-list-command-cell',
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
            editHandler: function() {
                this.$emit('edit', this.dataItem);
            },
            removeHandler: function() {
                this.$emit('remove', this.dataItem);
            },
            addUpdateHandler: function() {
                this.$emit('save', this.dataItem);
            },
            cancelDiscardHandler: function() {
                this.$emit('cancel', this.dataItem);
            },
        },
    }
</script>

<style>

.user-responsible-list-commands {
    display: flex;
    flex-flow: row nowrap;
    padding-top: 4px;
    padding-bottom: 4px;
}

.user-responsible-list-commands > .command-button {
    width: 30px;
    min-width: 30px;
    margin-left: 8px;
}

</style>