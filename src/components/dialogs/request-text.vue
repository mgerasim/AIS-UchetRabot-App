<template>
    <vu-modal :isScroll="true" size="p50" :center="true" :escapable="true" :dismissable="false" className="d-modal" headerClassName="d-header">
        <div slot="header">
            <div class="h-flex">
                <span style="flex: 1 1 auto; margin-top: auto; margin-bottom: auto;">{{ title }}</span>
                <div class="d-close-icon" @click="onCancel">
                    <fa icon="times" size="lg" />
                </div>
            </div>
        </div>

        <div class="d-container">

            <div class="form-group">
                <span class="col-12 col-form-label">{{ message }}</span>
                <div class="col-12" style="padding-top: 8px;">
                    <b-form-textarea
                        id="textarea"
                        v-model="text"
                        placeholder=""
                        rows="3"
                        max-rows="6" />
                </div>
            </div>

        </div>

        <div slot="footer">
            <div class="d-actions">
                <button class='btn btn-sm btn-primary d-action-button' :disabled="required && (text == null || text == '')" @click="onConfirm">OK</button>
                <button class='btn btn-sm btn-secondary d-action-button' @click="onCancel">Отмена</button>
            </div>
        </div>

    </vu-modal>
</template>

<script>

export default {
    name: 'request-text',
    props: {
        //обязательный ввод значения
        required: { type: Boolean, default: true },

        //заголовок диалога
        title: { type: String, default: 'Запрос значения' },

        //поясняющий текст
        message: { type: String, default: 'Введите значение' },

        //изменяемый текст
        value: { type: String, default: null },

        //максимальная длина вводимого значения
        // maxLength: { type: Number, default: null },
    },
    data() {
        return {
            text: this.value,     
        };
    },
    methods: {
        onConfirm() {
            this.$modals.close(this.text);
        },

        onCancel() {
            this.$modals.dismiss();
        },
    },
}
</script>

<style scoped lang="scss">

</style>