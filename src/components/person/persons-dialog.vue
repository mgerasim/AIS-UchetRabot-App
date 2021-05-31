<template>

    <vu-modal   :isScroll="false" 
                :center="true" 
                :escapable="true" 
                :dismissable="false"
                selected-field="selected"
                size="xl" 
                className="d-modal"
                headerClassName="d-header"
                bodyClassName="d-body"
                class="no-select"
                style="height: 80%; width: 80%;">

        <template v-slot:header>
            <div class="h-flex">
                <span style="flex: 1 1 auto; margin-top: auto; margin-bottom: auto;">Сотрудники</span>
                <div class="d-close-icon" @click="onCancel">
                    <fa icon="times" size="lg" />
                </div>
            </div>
        </template>

        <div class="full-size v-flex">
            <div class="d-container" style="flex: 1 1 100%; min-height: 0;">
                <person-list></person-list>
            </div>

            <div class="d-actions">
                <button class='k-button d-action-button' @click="onCancel" tabindex="4">Закрыть</button>
            </div>
        </div>

    </vu-modal>

</template>

<script>

import PersonList from '@/components/person/person-list';

export default {
    name: 'persons-dialog',
    components: {
        PersonList,
    },
    data() {
        return {
        };
    },
    methods: {
        onCancel() {
            this.$modals.dismiss();
        },
    },
    created() {
    },
}

</script>

<style scoped lang="scss">

.toolbar {
    display: flex;
}

</style>