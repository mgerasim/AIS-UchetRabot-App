import Vue from 'vue';
import Router from 'vue-router';

import AdminPage from './views/AdminPage.vue';
import LogsPage from './views/LogsPage.vue';
import JobsPage from './views/JobsPage.vue';
import PermitsPage from './views/PermitsPage.vue';
import PermitTemplatesPage from './views/PermitTemplatesPage.vue';
import TestPage from './views/TestPage.vue';

import Settings from './components/appSettings/settings';
import Pipeline from './components/pipeline/pipeline-list.vue';
import Department from './components/department/department-list.vue';
import User from './components/user/user-list.vue';
import Branch from './components/branch/branch-list.vue';
import ObjectType from './components/objectType/object-type-list.vue';
import Object from './components/object/object-list.vue';
import Person from './components/person/person-list.vue';
import BranchSystem from './components/branchSystem/branch-system-list.vue';
import MasksManager from './components/mask/manager/masks-manager';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/admin',
      component: AdminPage,
      children: [
        {
          path: 'settings',
          component: Settings,
        },
        {
          path: 'pipeline',
          component: Pipeline,
        },
        {
          path: 'department',
          component: Department,
        },
        {
          path: 'user',
          component: User,
        },
        {
          path: 'branch',
          component: Branch,
        },
        {
          path: 'objectType',
          component: ObjectType,
        },
        {
          path: 'object',
          component: Object,
        },
        {
          path: 'person',
          component: Person,
        },
        {
          path: 'branchSystem',
          component: BranchSystem,
        },
        {
          path: 'masksManager',
          component: MasksManager,
        },
      ],
    },
    {
      path: '/LogsPage',
      name: 'LogsPage',
      component: LogsPage,
    },
    {
      path: '/JobsPage',
      name: 'JobsPage',
      component: JobsPage,
    },
    {
      path: '/PermitsPage',
      name: 'PermitsPage',
      component: PermitsPage,
    },
    {
      path: '/PermitTemplatesPage',
      name: 'PermitTemplatesPage',
      component: PermitTemplatesPage,
    },
    {
      path: '/TestPage',
      name: 'TestPage',
      component: TestPage,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
});
