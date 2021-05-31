<template>

<div>
    <div ref="content">
        <slot></slot>
    </div>
    <b-tooltip
        placement="right"
        :target="getTarget">
        <slot name="tooltip"></slot>
    </b-tooltip>
</div>

</template>

<script>

import { BTooltip } from 'bootstrap-vue';

export default {
    name: 'tooltip',
    components: {
        BTooltip,
    },    
    methods: {
        getTarget() {
            console.log(this.$scopedSlots.default()[0]);
            
            return this.$refs['content'];
        },
    },
}

</script>

<style lang="scss" scoped>

</style>