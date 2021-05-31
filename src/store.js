import Vue from 'vue';
import Vuex from 'vuex';
import BranchService from '@/core/services/branch-service';
import DepartmentService from '@/core/services/department-service';
import PermitService from '@/core/services/permit-service';
import MaskService from '@/core/services/mask-service';
import { hubConnection } from 'signalr-no-jquery';
import { EventBus } from '@/core/event-bus';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    connectionId: null,     //SignalR connection Id

    departments: [],
    branches: [],
    permitStatuses: [],
    equipmentTypes: [],
    workTypes: [],
    maskTypes: [],
    maskSystems: [],
    maskSourceEngines: [],


    user: {
      branchId: null,
      departmentId: null,
    },

    last: {
      selectedBranchId: null,
      selectedDepartmentId: null,
    },

    initialized: false,
  },
  mutations: {
    setInitialized(state) {
      state.initialized = true;
      EventBus.$emit('initialized');
    },

    setDepartments(state, departments) {
      state.departments = departments;
    },

    setBranches(state, branches) {
      state.branches = branches;
    },

    setPermitStatuses(state, permitStatuses) {
      state.permitStatuses = permitStatuses;
    },

    setEquipmentTypes(state, equipmentTypes) {
      state.equipmentTypes = equipmentTypes;
    },

    setWorkTypes(state, workTypes) {
      state.workTypes = workTypes;
    },

    setMaskTypes(state, maskTypes) {
      state.maskTypes = maskTypes;
    },

    setMaskSystems(state, maskSystems) {
      state.maskSystems = maskSystems;
    },

    setMaskSourceEngines(state, maskSourceEngines) {
      state.maskSourceEngines = maskSourceEngines;
    },

    setLastSelectedBranchId(state, branchId) {
      state.last.selectedBranchId = branchId;
    },

    setLastSelectedDepartmentId(state, departmentId) {
      state.last.selectedDepartmentId = departmentId;
    },

    setConnectionId(state, connectionId) {
      state.connectionId = connectionId;
    },
  },
  actions: {
    initApplication({ commit, dispatch, state }) {
        console.log('initApplication');
        //загрузим все необходимые данные

        Promise.all([
          DepartmentService.getAll(),
          BranchService.getAll(),
          PermitService.getAllStatuses(),
          PermitService.getAllEquipmentTypes(),
          PermitService.getAllWorkTypes(),
          MaskService.getAllMaskTypes(),
          MaskService.getAllMaskSystems(),
          MaskService.getAllMaskSourceEngines(),
        ])
        .then(responses => {
          const departmentResponse = responses[0];
          const branchResponse = responses[1];
          const permitStatusResponse = responses[2];
          const equipmentTypeResponse = responses[3];
          const workTypeResponse = responses[4];
          const maskTypeResponse = responses[5];
          const maskSystemResponse = responses[6];
          const maskSourceEngineResponse = responses[7];
          if(departmentResponse.data.HasError) throw departmentResponse.data.ErrorMessage;
          if(branchResponse.data.HasError) throw branchResponse.data.ErrorMessage;
          if(permitStatusResponse.data.HasError) throw permitStatusResponse.data.ErrorMessage;
          if(equipmentTypeResponse.data.HasError) throw equipmentTypeResponse.data.ErrorMessage;
          if(workTypeResponse.data.HasError) throw workTypeResponse.data.ErrorMessage;
          if(maskTypeResponse.HasError) throw maskTypeResponse.ErrorMessage;
          if(maskSystemResponse.HasError) throw maskSystemResponse.ErrorMessage;
          if(maskSourceEngineResponse.HasError) throw maskSourceEngineResponse.ErrorMessage;
          commit('setDepartments', departmentResponse.data.Result);
          commit('setBranches', branchResponse.data.Result);
          commit('setPermitStatuses', permitStatusResponse.data.Result);
          commit('setEquipmentTypes', equipmentTypeResponse.data.Result);
          commit('setWorkTypes', workTypeResponse.data.Result);
          commit('setMaskTypes', maskTypeResponse.Result);
          commit('setMaskSystems', maskSystemResponse.Result);
          commit('setMaskSourceEngines', maskSourceEngineResponse.Result);
          commit('setInitialized');
        })
        .catch(error => {
          console.log(error);
        });

        dispatch('connectToSignalR');
    },  

    connectToSignalR({ commit, dispatch, state }) {
      const connection = hubConnection();
      const hubProxy = connection.createHubProxy('AppHub');

      hubProxy.on('notify', function(message, type) {
        console.log('SignalR - Notify', `message: ${message}, type: ${type}`);
        EventBus.$emit('serverNotify', { message, type });
      });

      hubProxy.on('maskStatesChanged', maskStates => {
        EventBus.$emit('serverMaskStatesChanged', { maskStates });
      });

      hubProxy.on('permitTemplateChanged', (action, permitTemplate) => {
        //приходит упрощенная модель, достаточная для списка
        console.log('SignalR - PermitTemplateChanged', `action: ${action.Name}, permitTemplateId: ${permitTemplate.Id}`);
        EventBus.$emit('serverPermitTemplateChanged', { action, permitTemplate });
      });

      hubProxy.on('permitChanged', (action, permit) => {
        //приходит упрощенная модель, достаточная для списка
        EventBus.$emit('serverPermitChanged', { action, permit });
      });

      hubProxy.on('sedDocumentChanged', (permitId, sedDocument) => {
        //для тестирования создания документа в СЭД
        EventBus.$emit('sedDocumentChanged', { permitId, sedDocument });
      });

      connection.start({ jsonp: true })
          .done(() => {
              console.log("SignalR now connected to AppHub, connection Id is " + connection.id);
              commit('setConnectionId', connection.id);
          })
          .fail(() => {
              console.log("SignalR could not connect to AppHub");
              commit('setConnectionId', null);
          });

      connection.disconnected(() => {
          console.log("SignalR disconnected from AppHub");
          setTimeout(() => {
              console.log("SignalR retry connect to AppHub");
              connection.start({ jsonp: true })
                  .done(() => {
                      console.log("SignalR now connected to AppHub, connection Id is " + connection.id);
                      commit('setConnectionId', connection.id);
                  })
                  .fail(() => {
                      console.log("SignalR could not connect to AppHub");
                      commit('setConnectionId', null);
                  });
              }, 5000);
      });
    },


    
  }
});
