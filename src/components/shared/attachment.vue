<template>

    <a class="attachment" :href='url' target="_blank">
        <i class="fa fa-file-o"></i>
        {{ name }}
    </a>

</template>

<script>
    export default {
        name: 'attachment',
        props: {
            url: String,
            name: String
        },
    }
</script>

<style scoped>

</style>