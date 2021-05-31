import Vue from 'vue';
import AdminPage from '@/views/AdminPage.vue';
import router from './router';
import store from './store';

import 'bootstrap/scss/bootstrap.scss';
import './styles/site.scss';

import './include/kendo';

import VueSelector from '@/components/shared/vue-selector.vue';
import { ValidationProvider, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import '@/libs/vue-universal-modal/src/style.scss';
import { ModalWrapper, Modal } from '@/libs/vue-universal-modal/src/index';
import VuModal from '@/libs/vue-universal-modal/src/index';
Vue.use(VuModal);

import Dialog from '@/components/dialogs/dialogs';
Vue.use(Dialog);

//иконки
import './include/icons';

extend('required', {
  ...required,
  message: 'Поле {_field_} обязательно для заполнения'
});

Vue.component('validation-provider', ValidationProvider);
Vue.component('vue-selector',  VueSelector);
Vue.component('fa', FontAwesomeIcon);
Vue.component('vu-modal-wrapper', ModalWrapper);
Vue.component('vu-modal', Modal);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(AdminPage)
}).$mount('#app');
