<template>
    <div class="user-list-commands">
        <button 
            type='button' 
            class='btn btn-sm btn-outline-secondary command-button' 
            @click='onChange' 
            title='Изменить'>
            <fa icon="pencil-alt"></fa>
        </button>
    </div>
</template>

<script>
    export default {
        name: 'user-list-command-cell',
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
        },
    }
</script>

<style>

.user-list-commands {
    padding-top: 4px;
    padding-bottom: 4px;
}

.user-list-commands > .command-button {
    width: 30px;
    min-width: 30px;
    margin-left: 8px;
}

</style>