<template>
    <vu-modal :isScroll="false" size="p50" :center="true" :escapable="true" :dismissable="false" className="d-modal" headerClassName="d-header">

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
                    <multiselect 
                        v-model="value" 
                        :options="items" 
                        :placeholder="title"
                        select-label="Нажмите Enter для выбора" 
                        label="text"
                        :allow-empty="!required"
                        :show-labels="false"
                        :searchable="false"
                        track-by="key"
                        style="margin-top: 16px;">
                    </multiselect>
                </div>
            </div>
        </div>

        <div slot="footer">
            <div class="d-actions">
                <button class='btn btn-sm btn-secondary d-action-button' :disabled="required && value == null" @click="onConfirm">OK</button>
                <button class='btn btn-sm btn-secondary d-action-button' @click="onCancel">Отмена</button>
            </div>
        </div>

    </vu-modal>
</template>

<script>

export default {
    name: 'request-item',
    props: {
        //обязательный ввод значения
        required: { type: Boolean, default: true },

        //заголовок диалога
        title: { type: String, default: 'Запрос значения' },

        //поясняющий текст
        message: { type: String, default: 'Выберите значение' },

        //массив элементов, из которых осуществляется выбор [ {key: object, text: string} ]
        items: { type: Array, required: true },

        //первоначально выбранный элемент {key: object, text: string}
        selected: { type: Object, default: null },
    },
    data() {
        return {
            value: this.selected,
        }
    },
    methods: {

        onConfirm() {
            this.$modals.close(this.value);
        },

        onCancel() {
            this.$modals.dismiss();
        },
    }
}
</script>

<style scoped lang="scss">

</style>