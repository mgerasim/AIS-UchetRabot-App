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
                                        placeholder="Начальник ОТК"
                                        tabindex="1" />
                            </validation-provider>
                        </div>
                    </div>

                    <div class="row form-group" key="to-row">
                        <label class="control-label col-md-3 form-label">Кому</label>
                        <div class="col-md-9">
                            <validation-provider name='Кому' rules="required" v-slot="{ errors }">
                                <textarea name="to"
                                        rows="3" cols="1"
                                        v-model="model.to"
                                        placeholder="Начальнику ОТК РНУ «Белогорск» А.А. Иванову"
                                        tabindex="1"
                                        :class="{'k-textarea': true, 'is-danger': errors.length > 0 }"
                                        style="resize: vertical; overflow: auto; width: 100%;"></textarea>
                            </validation-provider>
                        </div>
                    </div>

                    <div class="row form-group" key="from-row">
                        <label class="control-label col-md-3 form-label">От кого</label>
                        <div class="col-md-9">
                            <validation-provider name='От кого' rules="required" v-slot="{ errors }">
                                <textarea name="from"
                                        rows="3" cols="1"
                                        v-model="model.from"
                                        placeholder="Начальника ОТК РНУ «Белогорск» А.А. Иванова"
                                        tabindex="1"
                                        :class="{'k-textarea': true, 'is-danger': errors.length > 0 }"
                                        style="resize: vertical; overflow: auto; width: 100%;"></textarea>
                            </validation-provider>
                        </div>
                    </div>

                    <div class="row form-group">
                        <label for="fired" class="my-label control-label col-md-3">Уволен</label>
                        <div class="col-md-9 h-flex">
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

export default {
    name: 'person-editor',
    components: {
        ValidationObserver,
    },
    props: {
        id: { type: Number, default: null },
    },
    computed: {
        title() {
            return `${this.isNew ? 'Создание нового сотрудника' : ('Изменение сотрудника ' + this.model.name)}`;
        },
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
                isChief: true,
                from: null,
                to: null,
            },
            departments: [],
            branches: [],
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

        loadInitData() {
            return Promise.all([
                DepartmentService.getAll(),
                BranchService.getAll(),
            ]).then(responses => {
                    let departmentsResponse = responses[0];
                    let branchesResponse = responses[1];

                    if(departmentsResponse.data.HasError) throw departmentsResponse.data.ErrorMessage;
                    if(branchesResponse.data.HasError) throw branchesResponse.data.ErrorMessage;

                    this.departments = departmentsResponse.data.Result;
                    this.branches = branchesResponse.data.Result;

                    return Promise.resolve();
                })
                .catch(error => {
                    console.log(error);
                    alert(`Ошибка при получении данных: ${error}`);
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
        this.loadInitData()
            .then(() => {
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
            });
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