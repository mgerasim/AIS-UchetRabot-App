import Vue from 'vue';
import BusyIndicator from '@/components/shared/busy-indicator';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import File from '@/components/file/file';
import Group from '@/components/shared/group';

//иконки
import '@/include/icons';

Vue.component('busy-indicator', BusyIndicator);
Vue.component('fa', FontAwesomeIcon);
Vue.component('file', File);
Vue.component('group', Group);
