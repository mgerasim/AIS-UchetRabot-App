<template>
    <vu-modal :isScroll="true" size="p50" :center="true" :escapable="true" :dismissable="false" className="d-modal" headerClassName="d-header">
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
                <button class='btn btn-sm btn-secondary d-action-button' @click="onConfirm">OK</button>
            </div>
        </div>

    </vu-modal>
</template>

<script>

export default {
    name: 'message',
    props: {
        //заголовок диалога
        title: { type: String, default: 'Внимание' },

        //сообщение
        message: { type: String, required: true },

        //иконка (info, warning, error)
        icon: { type: String, default: null },
    },
    data() {
        return {
        };
    },
    computed: {
        isIconPresent() {
            return this.icon != null;
        },

        iconName() {
            switch(this.icon) {
                case 'error':
                    return 'exclamation-triangle';
                case 'warning':
                    return 'exclamation-triangle';
                case 'info':
                    return 'info-circle';
                default:
                    return this.icon;
            }
        },
        
        iconClass() {
            switch(this.icon) {
                case 'error':
                    return ['d-icon-error'];
                case 'warning':
                    return ['d-icon-warning'];
                case 'info':
                    return ['d-icon-info'];
                default:
                    return ['d-icon-default'];
            }
        },
    },
    methods: {
        onConfirm() {
            this.$modals.close();
        },

        onCancel() {
            this.$modals.dismiss();
        },
    },
}
</script>

<style scoped lang="scss">

    .d-icon-error {
        color: #c01919;
    }

    .d-icon-warning {
        color: #cec112;
    }

    .d-icon-info {
        color: #04dac8;
    }

    .d-icon-default {
        color: #04dac8;
    }

</style>