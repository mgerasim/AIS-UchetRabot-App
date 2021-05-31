<template>

    <vu-modal   :isScroll="false" 
                :center="true" 
                :escapable="true" 
                :dismissable="false" 
                className="d-modal"
                headerClassName="d-header"
                class="no-select">

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

                <div class="container-fluid">
                    <div class="row form-group">
                        <label for="name" class="my-label control-label col-md-3">Имя</label>
                        <div class="col-md-9">
                            <validation-provider name='Имя сотрудника' rules="required" v-slot="{ errors }">
                                <input  name="name" 
                                        v-model="model.name"
                                        :class="{'k-textbox': true, 'is-danger': errors.length > 0 }"
                                        style="width: 100%;"
                                        placeholder="А.А. Иванов"
                                        tabindex="0" />
                            </validation-provider>
                        </div>
                    </div>

                    <div class="row form-group">
                        <label for="position" class="my-label control-label col-md-3">Должность</label>
                        <div class="col-md-9">
                            <validation-provider name='Должность' rules="required" v-slot="{ errors }">
                                <input  name="position" 
                                        v-model="model.position"
                                        :class="{'k-textbox': true, 'is-danger': errors.length > 0 }"
                                        style="width: 100%;"
                                        placeholder="Инженер по КИПиА"
                                        tabindex="1" />
                            </validation-provider>
                        </div>
                    </div>

                    <div class="row form-group" key="phone-row">
                        <label for="phone" class="my-label control-label col-md-3">МАТС</label>
                        <div class="col-md-9">
                            <validation-provider name='МАТС' rules="required" v-slot="{ errors }">
                                <input  name="phone" 
                                        v-model="model.phone"
                                        :class="{'k-textbox': true, 'is-danger': errors.length > 0 }"
                                        style="width: 100%;"
                                        placeholder="6883-5555"
                                        tabindex="1" />
                            </validation-provider>
                        </div>
                    </div>

                    <div class="row form-group" key="branch-row">
                        <label for="branch" class="my-label control-label col-md-3">Подразделение</label>
                        <div class="col-md-9">
                            <kendo-dropdownlist ref="branch"
                                                name="branch"
                                                :data-source="branches"
                                                data-text-field="Name"
                                                data-value-field="Id"
                                                :value="model.branch != null ? model.branch.Id : branchId"
                                                @select="model.branch = $event.dataItem"
                                                style="width: 100%;">
                            </kendo-dropdownlist>
                        </div>
                    </div>

                    <div class="row form-group" key="department-row">
                        <label for="department" class="my-label control-label col-md-3">Отдел</label>
                        <div class="col-md-9">
                            <kendo-dropdownlist ref="department"
                                                name="department"
                                                :data-source="departments"
                                                data-text-field="Name"
                                                data-value-field="Id"
                                                :value="model.department != null ? model.department.Id : departmentId"
                                                @select="model.department = $event.dataItem"
                                                style="width: 100%;">
                            </kendo-dropdownlist>
                        </div>
                    </div>

                    <div class="row form-group">
                        <label for="fired" class="my-label control-label col-md-3">Уволен</label>
                        <div class="col-md-9">
                            <input  id="fired"
                                    name="fired"
                                    type="checkbox"
                                    v-model="model.fired"
                                    tabindex="2"
                                    class="k-checkbox" />
                            <label for="fired" class="k-checkbox-label">{{ model.fired ? 'Да' : 'Нет' }}</label>
                        </div>
                    </div>

                </div>
            </div>

            <div class="d-actions">
                <button class='k-button k-primary d-action-button' @click="onConfirm" tabindex="3">{{isNew ? 'Создать' : 'Обновить'}}</button>
                <button class='k-button d-action-button' @click="onCancel" tabindex="4">Отмена</button>
            </div>

        </ValidationObserver>

    </vu-modal>

</template>

<script>

import { ValidationObserver } from 'vee-validate';
import PersonService from '@/core/services/person-service';
import DepartmentService from '@/core/services/department-service';
import BranchService from '@/core/services/branch-service';
import { mapState } from 'vuex';

export default {
    name: 'person-editor',
    components: {
        ValidationObserver,
    },
    props: {
        id: { type: Number, default: null },
        branchId: { type: Number, default: null },
        departmentId: { type: Number, default: null },
    },
    computed: {
        title() {
            return `${this.isNew ? 'Создание нового сотрудника' : ('Изменение сотрудника ' + this.model.name)}`;
        },

        ...mapState({
            departments: state => [{ Id: null, Name: '-= Выберите отдел =-' }, ...state.departments],
            branches: state => [{ Id: null, Name: '-= Выберите подразделение =-' }, ...state.branches],
        }),
    },
    data() {
        return {
            isNew: true,
            model: {
                id: null,
                name: null,
                position: null,
                phone: null,
                branch: null,
                department: null,
                fired: false,
                isChief: false,
                from: null,
                to: null,
            },
        }
    },
    methods: {
        load() {
            PersonService.getById(this.id)
                .then(response => {
                    if(response.data.HasError) throw response.data.ErrorMessage;
                    const person = response.data.Result;
                    this.isNew = false;
                    this.model.id = person.Id;
                    this.model.name = person.Name;
                    this.model.position = person.Position;
                    this.model.phone = person.Phone;
                    this.model.department = person.Department;
                    this.model.branch = person.Branch;
                    this.model.fired = person.Fired;
                    this.model.isChief = person.IsChief;
                    this.model.from = person.From;
                    this.model.to = person.To;
                })
                .catch(error => {
                    console.log(error);
                    alert(`Ошибка при получении данных о сотруднике: ${error}`);
                });
        },

        _updatePerson() {
            const model = this._getModelFromView();
            PersonService.update(model)
                .then(response => {
                    if(response.data.HasError) throw response.data.ErrorMessage;
                    this.$modals.close(response.data.Result);
                })
                .catch(error => {
                    console.log(error);
                    alert(`Ошибка при ${this.isNew ? 'обновлении' : 'создании' } сотрудника: ${error}`);
                });
        },

        _getModelFromView() {
            return {
                Id: this.model.id,
                Name: this.model.name,
                Position: this.model.position,
                Phone: this.model.isChief ? null : this.model.phone,
                Department: this.model.isChief ? null : this.model.department,
                Branch: this.model.isChief ? null : this.model.branch,
                Fired: this.model.fired,
                IsChief: this.model.isChief,
                From: this.model.from,
                To: this.model.to,
            };
        },

        onConfirm() {
            this.$refs.observer.validate().then(isValid => {
                if(isValid) {
                    this._updatePerson();
                }
            });
        },

        onCancel() {
            this.$modals.dismiss();
        },

    },
    created() {
        if(this.id != null) {
            this.load();
        } else {
            if(this.branchId != null) {
                this.$refs.branch.kendoWidget().select(dataItem => dataItem.Id == this.branchId);
                this.model.branch = this.branches.find(p => p.Id == this.branchId);
            }

            if(this.departmentId != null) {
                this.$refs.department.kendoWidget().select(dataItem => dataItem.Id == this.departmentId);
                this.model.department = this.departments.find(p => p.Id == this.departmentId);
            }
        }
    },
}

</script>

<style scoped>

.field-validation-error {
    margin-top: 8px;
}

.noselect {
    -ms-user-select: none;
    -moz-user-select: none;
    user-select: none;
}

.my-label {
    text-align: right;
}

</style>