<template>

    <div>
        <kendo-window ref="dialog"
                      :animation="false"
                      :width="'500px'"
                      :title="title"
                      :visible="false"
                      :modal="true"
                      :draggable="true"
                      :resizable="false"
                      :scrollable="false"
                      :actions="['Close']"
                      class="noselect">
            <div class="dialog-container">

                <div class="details-container">
                    <span>{{ message }}</span>
                </div>

                <div class="actions-container">
                    <button v-for="(action, index) in actions" :key="'action_' + index" class='k-button k-my-button dialog-action-button' @click="_onActionClick(action.name)">{{ action.title }}</button>
                </div>

            </div>
        </kendo-window>
    </div>

</template>

<script>
    import Vue from 'vue';

    export default {
        name: 'action-request',
        components: {
        },
        data() {
            return {
                title: '',
                message: '',
                actions: [],     //{ name, title }
                callback: null,
            }
        },
        computed: {

        },
        methods: {

            request(title, message, actions, callback) {
                this.title = title;
                this.message = message;
                this.actions = actions;
                this.callback = callback;
                var window = this.$refs.dialog.kendoWidget();
                Vue.nextTick(() => {
                    window.center().open();
                });
            },

            _close() {
                var window = this.$refs.dialog.kendoWidget();
                window.close();
            },

            _onActionClick(actionName) {
                if (this.callback != undefined) {
                    this._close();
                    this.callback(actionName);
                }
            },
        }
    }
</script>

<style scoped>

    .dialog-action-button {
        margin-right: 8px;
    }

    .dialog-container {
        display: flex;
        flex-flow: column nowrap;
    }

    .details-container {
        flex: 0 1 100%;
        margin-top: 16px;
        margin-bottom: 16px;
    }

    .actions-container {
        display: flex;
        flex-flow: row-reverse nowrap;
        flex: 0 1 auto;
    }

    .field-validation-error {
        margin-top: 8px;
    }

    .noselect {
        -ms-user-select: none;
        -moz-user-select: none;
        user-select: none;
    }

    /* reset everything to the default box model */

    *, :before, :after {
        -webkit-box-sizing: content-box;
        -moz-box-sizing: content-box;
        box-sizing: content-box;
    }

    /* set a border-box model only to elements that need it */

    .form-control, /* if this class is applied to a Kendo UI widget, its layout may change */
    .container,
    .container-fluid,
    .row,
    .col-xs-1, .col-sm-1, .col-md-1, .col-lg-1,
    .col-xs-2, .col-sm-2, .col-md-2, .col-lg-2,
    .col-xs-3, .col-sm-3, .col-md-3, .col-lg-3,
    .col-xs-4, .col-sm-4, .col-md-4, .col-lg-4,
    .col-xs-5, .col-sm-5, .col-md-5, .col-lg-5,
    .col-xs-6, .col-sm-6, .col-md-6, .col-lg-6,
    .col-xs-7, .col-sm-7, .col-md-7, .col-lg-7,
    .col-xs-8, .col-sm-8, .col-md-8, .col-lg-8,
    .col-xs-9, .col-sm-9, .col-md-9, .col-lg-9,
    .col-xs-10, .col-sm-10, .col-md-10, .col-lg-10,
    .col-xs-11, .col-sm-11, .col-md-11, .col-lg-11,
    .col-xs-12, .col-sm-12, .col-md-12, .col-lg-12 {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }
</style>