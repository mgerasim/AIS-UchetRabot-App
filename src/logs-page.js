import Vue from 'vue';
import LogsPage from '@/views/LogsPage.vue';

import 'bootstrap/scss/bootstrap.scss';
import './styles/site.scss';

import './include/kendo';
import './include/shared';

import VueSelector from '@/components/shared/vue-selector.vue';
import { ValidationProvider, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';

import Dialog from '@/components/dialogs/dialogs';
Vue.use(Dialog);

extend('required', {
    ...required,
    message: 'Поле {_field_} обязательно для заполнения'
});

Vue.component('validation-provider', ValidationProvider);
Vue.component('vue-selector',  VueSelector);

const app = new Vue({
    el: '#app',
    render: h => h(LogsPage)
});