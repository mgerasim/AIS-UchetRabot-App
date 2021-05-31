<template>

<div class="container">
    <div class="top">
        <div class="top-left"></div>
        <div v-if="title != null || $slots.title != null" class="title">
            <slot name="title"><span>{{ title }}</span></slot>
        </div>
        <div class="top-right"></div>
    </div>
    <div class="group">
        <slot></slot>
    </div>
</div>

</template>

<script>

export default {
    name: 'group',
    props: {
        'title': { type: String, required: false },
    },    
    data() {
        return {};
    },
}

</script>

<style lang="scss" scoped>

$border-color: #d8d8d8;

.container {
    display: flex;
    flex-flow: column nowrap;
}

.group {
    //flex: 1 1 100%;
    //min-height: 0;

    border-left: 1px solid $border-color;
    border-right: 1px solid $border-color;
    border-bottom: 1px solid $border-color;
    border-bottom-left-radius: 4px;

    padding: 0px 16px;
}

.title {
    flex: 0 0 auto;
    transform: translateY(-50%);
    margin-left: 4px;
    margin-right: 4px;
}

.top {
    //flex: 0 0 auto;
    display: flex;
    flex-flow: row nowrap;
    min-height: 4px;
}

.top-left {
    flex: 0 0 16px;
    border-left: 1px solid $border-color;
    border-top: 1px solid $border-color;
    border-top-left-radius: 4px;
}

.top-right {
    flex: 1 1 100%;
    min-width: 0px;
    border-right: 1px solid $border-color;
    border-top: 1px solid $border-color;
    border-top-right-radius: 4px;
}

</style>