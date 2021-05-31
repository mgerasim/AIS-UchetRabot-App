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
    }
</script>

<style lang="scss">

.commands {
    display: flex;
    flex-flow: row nowrap;
}

.edit-command {
    color: rgb(0, 123, 255);
    min-width: 24px;
    min-height: 24px;

    &:hover {
        color: #0062cc;
    }
}

.remove-command {
    color: rgb(224, 3, 3);
    min-width: 24px;
    min-height: 24px;

    &:hover {
        color: rgb(179, 0, 0);
    }
}

</style>