<template>

    <vu-modal   :isScroll="false" 
                :center="true" 
                :escapable="true" 
                :dismissable="false" 
                size="xl"
                className="d-modal"
                headerClassName="d-header"
                bodyClassName="d-body"
                class="no-select"
                style="height: 80%; width: 80%; display: flex; flex-flow: column nowrap;">

        <template v-slot:header>
            <div class="h-flex" style="flex: 0 0 auto;">
                <span style="flex: 1 1 auto; margin-top: auto; margin-bottom: auto;">Выбор шаблона</span>
                <div class="d-close-icon" @click="onCancel">
                    <fa icon="times" size="lg" />
                </div>
            </div>
        </template>

        <div v-if="busy" class="busy">
            <busy-indicator name="permitTemplateSelectDialogBusy"></busy-indicator>
        </div>

        <div class="full-size v-flex">
            <div class="d-container" style="flex: 1 1 100%; min-height: 0;">
                <permit-template-catalog 
                    :is-selector="true" 
                    @select="onPermitTemplateSelect"
                    :branch-id="branchId"
                    :department-id="departmentId"
                    style="height: 100%;">
                </permit-template-catalog>
            </div>

            <div class="d-actions">
                <button class='k-button k-primary d-action-button' :disabled="selectedPermitTemplate == null" @click="onConfirm" tabindex="3">Выбрать шаблон</button>
                <button class='k-button k-secondary d-action-button' @click="onCancel" tabindex="4">Отмена</button>
            </div>
        </div>
    </vu-modal>

</template>

<script>

import PermitTemplateCatalog from '@/components/permitTemplate/permit-template-catalog';

export default {
    name: 'permit-template-select-dialog',
    components: {
        PermitTemplateCatalog,
    },
    props: {
        departmentId: { type: Number, default: null },
        branchId: { type: Number, default: null },
    },
    computed: {
    },
    data() {
        return {
            selectedPermitTemplate: null,
            busy: false,
        }
    },
    methods: {
        onConfirm() {
            if(this.selectedPermitTemplate != null) {
                this.$modals.close(this.selectedPermitTemplate);
            }
        },

        onCancel() {
            this.$modals.dismiss();
        },

        onPermitTemplateSelect({ permitTemplate, confirm }) {
            this.selectedPermitTemplate = permitTemplate;
            if(confirm) this.$modals.close(this.selectedPermitTemplate);
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