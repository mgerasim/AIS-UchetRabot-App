<template>

    <vu-modal   :isScroll="false" 
                :center="true" 
                :escapable="true" 
                :dismissable="false" 
                size="xl"
                className="d-modal"
                headerClassName="d-header"
                class="no-select">

        <template v-slot:header>
            <div class="h-flex">
                <span style="flex: 1 1 auto; margin-top: auto; margin-bottom: auto;">Выбор объекта</span>
                <div class="d-close-icon" @click="onCancel">
                    <fa icon="times" size="lg" />
                </div>
            </div>
        </template>

        <div class="d-container">
            <object-list 
                :is-selector="true" 
                @select="onObjectSelect"
                :pipeline-id="pipelineId"
                :branch-id="branchId"></object-list>
        </div>

        <div class="d-actions">
            <button class='k-button k-primary d-action-button' :disabled="selectedObject == null" @click="onConfirm" tabindex="3">Выбрать объект</button>
            <button class='k-button k-secondary d-action-button' @click="onCancel" tabindex="4">Отмена</button>
        </div>

    </vu-modal>

</template>

<script>

import ObjectList from '@/components/object/object-list';

export default {
    name: 'object-editor',
    components: {
        ObjectList,
    },
    props: {
        pipelineId: { type: Number, default: null },
        branchId: { type: Number, default: null },
    },
    computed: {
    },
    data() {
        return {
            selectedObject: null,
        }
    },
    methods: {
        onConfirm() {
            if(this.selectedObject != null) {
                this.$modals.close(this.selectedObject);
            }
        },

        onCancel() {
            this.$modals.dismiss();
        },

        onObjectSelect({ object, confirm }) {
            this.selectedObject = object;
            if(confirm) this.$modals.close(this.selectedObject);
        },
    },
    created() {
    },
}

</script>

<style scoped>

    .field-validation-error {
        margin-top: 8px;
    }

    .noselect {
        -ms-user-select: none;
        -moz-user-select: none;
        user-select: none;
    }

</style>