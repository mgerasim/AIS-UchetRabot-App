<template>

    <vu-modal   :isScroll="false" 
                :center="true" 
                :escapable="true" 
                :dismissable="false" 
                className="d-modal"
                headerClassName="d-header"
                style="width: 900px;"
                >

        <template v-slot:header>
            <div class="h-flex">
                <span style="flex: 1 1 auto; margin-top: auto; margin-bottom: auto;">{{ title }}</span>
                <div class="d-close-icon" @click="onCancel">
                    <fa icon="times" size="lg" />
                </div>
            </div>
        </template>

        <ValidationObserver ref="observer" v-slot="{ invalid }" tag="div" slim>

            <div class="d-container">

                <kendo-tabstrip>
                    <ul>
                        <li class="k-state-active">
                            Информация
                        </li>
                        <li>
                            Ответственность
                        </li>
                    </ul>
                        <!-- Информация о пользователе -->
                        <div>
                            <div class="container-fluid">
                                <div class="row form-group">
                                    <label for="displayName" class="control-label col-md-3">Отображаемое имя</label>
                                    <div class="col-md-6">
                                        <span name="displayName">{{ model.displayName }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="container-fluid">
                                <div class="row form-group">
                                    <label for="email" class="control-label col-md-3">Адрес электронной почты</label>
                                    <div class="col-md-6">
                                        <span name="email">{{ model.email }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="container-fluid">
                                <div class="row form-group">
                                    <label for="phoneNumber" class="control-label col-md-3">Телефонный номер</label>
                                    <div class="col-md-6">
                                        <span name="phoneNumber">{{ model.phoneNumber }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="container-fluid">
                                <div class="row form-group">
                                    <label for="userName" class="control-label col-md-3">Имя пользователя</label>
                                    <div class="col-md-6">
                                        <span name="userName">{{ model.userName }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="container-fluid">
                                <div class="row form-group">
                                    <label for="tabNumber" class="control-label col-md-3">Табельный номер</label>
                                    <div class="col-md-6">
                                        <span name="tabNumber">{{ model.tabNumber }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="container-fluid">
                                <div class="row form-group">
                                    <label for="departmentName" class="control-label col-md-3">Отдел</label>
                                    <div class="col-md-6">
                                        <span name="departmentName">{{ model.departmentName }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="container-fluid">
                                <div class="row form-group">
                                    <label for="positionName" class="control-label col-md-3">Должность</label>
                                    <div class="col-md-6">
                                        <span name="positionName">{{ model.positionName }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="container-fluid">
                                <div class="row form-group">
                                    <label for="lastRequest" class="control-label col-md-3">Последняя авторизация</label>
                                    <div class="col-md-6">
                                        <span name="lastRequest">{{ model.lastRequest }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="container-fluid">
                                <div class="row form-group">
                                    <label for="enabled" class="control-label col-md-3">Доступ разрешен</label>
                                    <div class="col-md-6">
                                        <kendo-dropdownlist name="enabled"
                                                            :data-source="yesNoItems"
                                                            data-text-field="display"
                                                            data-value-field="value"
                                                            :value="!!model.enabled"
                                                            :value-primitive="true"
                                                            @select="model.enabled = $event.dataItem.value">
                                        </kendo-dropdownlist>
                                    </div>
                                </div>
                            </div>

                            <div class="container-fluid">
                                <div class="row form-group">
                                    <label for="role" class="control-label col-md-3">Роль</label>
                                    <div class="col-md-6">
                                        <kendo-dropdownlist name="role"
                                                            :data-source="roles"
                                                            data-text-field="DisplayName"
                                                            data-value-field="Value"
                                                            :value="!!model.role ? model.role.Value : null"
                                                            :value-primitive="true"
                                                            @select="model.role = $event.dataItem">
                                        </kendo-dropdownlist>
                                    </div>
                                </div>
                            </div>

                        </div>
                    <div>
                        <!-- Ответственность (что бы это не значило) -->
                        <Grid :style="{height: '100%'}"
                            :data-items="model.responsiblesList"
                            :columns="columns"
                            :sortable="false"
                            :pageable="false"
                            edit-field="inEdit"
                            @edit="editResponsible"
                            @remove="removeResponsible"
                            @save="saveResponsible"
                            @cancel="cancelResponsible">
                        </Grid>
                    </div>
                </kendo-tabstrip>

            </div>

            <div class="d-actions">
                <button class='btn btn-sm btn-primary d-action-button' :disabled="invalid" @click="onConfirm">Обновить</button>
                <button class='btn btn-sm btn-secondary d-action-button' @click="onCancel">Отмена</button>
            </div>

        </ValidationObserver>

    </vu-modal>
</template>

<script>

import CommandCell from '@/components/user/user-responsible-list-command-cell';
import { ValidationObserver } from 'vee-validate';
import axios from 'axios';
import Vue from 'vue';

const DepartmentDropDownCell = Vue.component('dropdowncell-component', {
    props: {
        field: String,
        dataItem: Object,
        className: String,
    },
    template: ` <td v-if="!dataItem.inEdit" :class="className">{{ dataItem.Department.Name }}</td>
                <td v-else>
                    <kendo-dropdownlist :data-source="items"
                                        data-text-field="Name"
                                        data-value-field="Id"
                                        :value-primitive="true"
                                        :value="dataItem.Department.Id"
                                        @select="select">
                    </kendo-dropdownlist>
                </td>`,
    data() {
        return {
            items: [],
            value: null,
        }
    },
    methods: {
        load() {
            axios.post('../api/department/getAll')
                .then(response => {
                    if(response.data.HasError) throw response.data.ErrorMessage;
                    this.items = [{ Id: null, Name: '-= ВСЕ =-' }, ...(response.data.Result)];
                })
                .catch(error => {
                    console.log(error);
                    alert(`Ошибка при получении списка отделов: ${error}`);
                });
        },

        select(e) {
            this.$emit('select', e.dataItem);
        },
    },
    created() {
        this.load();
    },
});

const BranchDropDownCell = Vue.component('dropdowncell-component', {
    props: {
        field: String,
        dataItem: Object,
        className: String,
    },
    template: ` <td v-if="!dataItem.inEdit" :class="className">{{ dataItem.Branch.Name }}</td>
                <td v-else>
                    <kendo-dropdownlist :data-source="items"
                                        data-text-field="Name"
                                        data-value-field="Id"
                                        :value="dataItem.Department.Id"
                                        :value-primitive="true"
                                        @select="select($event.dataItem)">
                    </kendo-dropdownlist>
                </td>`,
    data() {
        return {
            items: [],
        }
    },
    methods: {
        load() {
            axios.post('../api/branch/getAll')
                .then(response => {
                    if(response.data.HasError) throw response.data.ErrorMessage;
                    this.items = [{ Id: null, Name: '-= ВСЕ =-'}, ...(response.data.Result)];
                })
                .catch(error => {
                    console.log(error);
                    alert(`Ошибка при получении списка подразделений: ${error}`);
                });
        },

        select(dataItem) {
            this.$emit('select', dataItem);
        },
    },
    created() {
        this.load();
    },
});

export default {
    name: 'user-editor',
    components: {
        ValidationObserver,
    },
    props: {
        id: { type: String, default: null },
    },
    computed: {
        title() {
            return `Редактирование пользователя ${this.model.displayName}`;
        },
    },
    data() {
        return {
            roles: [],
            departments: [],
            branches: [],
            yesNoItems: [
                { value: false, display: 'Нет' },
                { value: true, display: 'Да' },
            ],
            model: {
                id: null,
                displayName: null,
                email: null,
                phoneNumber: null,
                userName: null,
                tabNumber: null,
                departmentName: null,
                positionName: null,
                lastRequest: null,
                enabled: null,
                role: null,
                responsiblesList: [],
            },
            columns: [
                { field: "Department", title: "Ответственная служба", cell: DepartmentDropDownCell, width: 'auto' },
                { field: "Branch", title: "Участок производства работ", cell: BranchDropDownCell, width: 'auto' },
                { title: " ", cell: CommandCell, width: 100 },
            ],
        };
    },
    methods: {
        load() {
            let getDepartments = axios.post('../api/department/getAll');
            let getBranches = axios.post('../api/branch/getAll');
            let getRoles = axios.post('../api/user/getRoles');

            Promise.all([getDepartments, getBranches, getRoles])
                .then(response => {
                    let departmentsResponse = response[0];
                    let branchesResponse = response[1];
                    let rolesResponse = response[2];
                    if(departmentsResponse.data.HasError) throw departmentsResponse.data.ErrorMessage;
                    if(branchesResponse.data.HasError) throw branchesResponse.data.ErrorMessage;
                    if(rolesResponse.data.HasError) throw rolesResponse.data.ErrorMessage;
                    this.roles = rolesResponse.data.Result;
                    this.departments = departmentsResponse.data.Result;
                    this.branches = branchesResponse.data.Result;
                    return axios.post('../api/user/getUser', { userId: this.id });
                })
                .then(response => {
                    if(response.data.HasError) throw response.data.ErrorMessage;
                    const user = response.data.Result;
                    this.model.id = user.Id;
                    this.model.displayName = user.DisplayName;
                    this.model.email = user.Email;
                    this.model.phoneNumber = user.PhoneNumber;
                    this.model.userName = user.UserName;
                    this.model.tabNumber = user.TabNumber;
                    this.model.departmentName = user.DepartmentName;
                    this.model.positionName = user.PositionName;
                    this.model.lastRequest = user.LastRequest;
                    this.model.enabled = user.Enabled;
                    this.model.role = user.Role;
                    this.model.responsiblesList = user.ResponsiblesList;
                })
                .catch(error => {
                    console.log(error);
                    alert(`Ошибка при получении данных о пользователе: ${error}`);
                });
        },

        _getModelFromView() {
            return {
                Id: this.model.id,
                Role: this.model.role,
                Enabled: this.model.enabled,
            };
        },

        _updateUser() {
            const model = this._getModelFromView();
            axios.post('../api/user/updateUser', { user: model })
                .then(response => {
                    if(response.data.HasError) throw response.data.ErrorMessage;
                    this.$modals.close(response.data.Result);
                })
                .catch(error => {
                    console.log(error);
                    alert(`Ошибка при обновлении пользователя: ${error}`);
                });
        },

        onConfirm() {
            this.$refs.observer.validate().then(isValid => {
                if(isValid) {
                    this._updateUser();
                }
            });
        },

        onCancel() {
            this.$modals.dismiss();
        },

        removeResponsible(responsible) {
            let index = this.model.responsiblesList.findIndex(p => p.Id == responsible.Id);
            this.model.responsiblesList.splice(index, 1);
        },

        editResponsible(responsible) {
            Vue.set(responsible, 'inEdit', true);
        },

        saveResponsible(responsible) {
        },

        cancelResponsible(responsible) {
        },
    },
    created() {
        if(this.id != null) this.load();
    },
}
</script>

<style lang="scss" scoped>

</style>