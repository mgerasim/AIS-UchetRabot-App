import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';
Vue.use(VueCompositionApi);

import App from './App.vue';
import router from './router';
import store from './store';

import 'bootstrap/scss/bootstrap.scss';
import './styles/site.scss';

import BootstrapVue from 'bootstrap-vue';
Vue.use(BootstrapVue);

import './include/kendo';
import './include/shared';

import { ValidationProvider, extend } from 'vee-validate';

import './include/validation';

import VueSelector from '@/components/shared/vue-selector.vue';

import '@/libs/vue-universal-modal/src/style.scss';
import { ModalWrapper, Modal } from '@/libs/vue-universal-modal/src/index';
import VuModal from '@/libs/vue-universal-modal/src/index';
Vue.use(VuModal);

import Dialog from '@/components/dialogs/dialogs';
Vue.use(Dialog);


Vue.component('validation-provider', ValidationProvider);
Vue.component('vue-selector',  VueSelector);
Vue.component('vu-modal-wrapper', ModalWrapper);
Vue.component('vu-modal', Modal);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
  created() {
    this.$store.dispatch('initApplication');
  },
}).$mount('#app');
