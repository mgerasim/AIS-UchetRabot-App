<template>
    <vu-modal   :isScroll="true" 
                size="p50" 
                :center="true" 
                :escapable="true" 
                :dismissable="false" 
                className="d-modal" 
                headerClassName="d-header">
        <div slot="header">
            <div class="h-flex">
                <fa v-if="isIconPresent" class="d-icon" :class="iconClass" :icon="iconName" size="lg" />
                <span style="flex: 1 1 auto; margin-top: auto; margin-bottom: auto;">{{ title }}</span>
                <div class="d-close-icon" @click="onCancel">
                    <fa icon="times" size="lg" />
                </div>
            </div>
        </div>

        <div class="d-container">
            <div class="form-group">
                <span class="col-12 col-form-label">{{ message }}</span>
            </div>
        </div>

        <div slot="footer">
            <div class="d-actions">
                <button v-for="(action, index) in actions" :key="index" class='k-button d-action-button' :class="[action.key == defaultActionKey ? 'k-primary' : 'k-secondary']" @click="onActionClick(action.key)">
                    <fa v-if="action.icon != null" :icon="action.icon" size="sm" style="margin-right: 4px;" />
                    {{ action.text }}
                </button>
            </div>
        </div>

    </vu-modal>
</template>

<script>

export default {
    name: 'request-action',
    props: {
        //заголовок диалога
        title: { type: String, default: 'Запрос действия' },

        //поясняющий текст
        message: { type: String, default: 'Выберите действие' },

        //массив отображаемых кнопок [ {key: string, text: string, icon: string } ]
        actions: { type: Array, default: () => [] },

        //действие по умолчанию
        defaultActionKey: { type: String, default: null },

        //иконка (question)
        icon: { type: String, default: null }
    },
    data() {
        return {};
    },
    computed: {
        isIconPresent() {
            return this.icon != null;
        },

        iconName() {
            switch(this.icon) {
                case 'question':
                    return 'question-circle';
                default:
                    return this.icon;
            }
        },
        
        iconClass() {
            switch(this.icon) {
                case 'question':
                    return ['d-icon-question'];
                default:
                    return ['d-icon-default'];
            }
        },
    },
    methods: {
        onActionClick(key) {
            this.$modals.close(key);
        },

        onCancel() {
            this.$modals.dismiss();
        },
    }
}
</script>

<style scoped lang="scss">

    .d-icon-question {
        color: #004e3b;
    }

    .d-icon-default {
        color: #04dac8;
    }

</style>