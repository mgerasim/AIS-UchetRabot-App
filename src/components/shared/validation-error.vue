<template>

<span class="k-widget k-tooltip k-tooltip-validation k-invalid-msg">
    <span class="k-icon k-i-warning"></span>
    <slot>Ошибка валидации</slot>
</span>

</template >

<script>

export default {
    name: 'validationError',
}

</script>

<style scoped>

</style>