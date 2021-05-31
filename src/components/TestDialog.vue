<template>
    <vu-modal :center="true" :isScroll="false">
        <template v-slot:header>
            <div>
                HEADER
            </div>
        </template>
        <template v-slot:default>
            <div>
                BODY
            </div>
        </template>
        <template v-slot:footer>
            <div>
                FOOTER
            </div>
        </template>
    </vu-modal>
</template>

<script>
import { ValidationObserver } from 'vee-validate';

    export default {
        name: 'test-dialog',
        components: {
            ValidationObserver,
        },
    }
</script>

<style lang="scss" scoped>

</style>