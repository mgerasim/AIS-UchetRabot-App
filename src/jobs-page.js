import Vue from 'vue';
import JobsPage from '@/views/JobsPage.vue';

import 'bootstrap/scss/bootstrap.scss';
import './styles/site.scss';

import './include/kendo';
import './include/shared';

import VueSelector from '@/components/shared/vue-selector.vue';
import { ValidationProvider, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';

import '@/libs/vue-universal-modal/src/style.scss';
import { ModalWrapper, Modal } from '@/libs/vue-universal-modal/src/index';
import VuModal from '@/libs/vue-universal-modal/src/index';
Vue.use(VuModal);

import Dialog from '@/components/dialogs/dialogs';
Vue.use(Dialog);

//иконки
import './include/icons';

import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

extend('required', {
    ...required,
    message: 'Поле {_field_} обязательно для заполнения'
});

Vue.component('validation-provider', ValidationProvider);
Vue.component('vue-selector',  VueSelector);
Vue.component('vu-modal-wrapper', ModalWrapper);
Vue.component('vu-modal', Modal);

const app = new Vue({
    el: '#app',
    render: h => h(JobsPage)
})