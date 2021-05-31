<template>

    <vu-modal   :isScroll="false" 
                :center="true" 
                :escapable="true" 
                :dismissable="false" 
                className="d-modal"
                headerClassName="d-header"
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

                <div class="container-fluid">
                    <div class="row form-group">
                        <label for="departmentName" class="control-label col-md-3">Наименование</label>
                        <div class="col-md-9">
                            <validation-provider name='Наименование' rules="required" v-slot="{ errors }">
                                <input  name="departmentName" 
                                        v-model="model.name"
                                        :class="{'k-textbox': true, 'is-danger': errors.length > 0 }" 
                                        style="width: 100%;"/>
                                <validation-error class="field-validation-error" v-show="errors.length > 0">
                                    {{ errors[0] }}
                                </validation-error>
                            </validation-provider>
                        </div>
                    </div>

                    <div class="row form-group">
                        <label for="description" class="control-label col-md-3">Описание</label>
                        <div class="col-md-9">
                            <textarea name="description"
                                    rows="3" cols="1"
                                    v-model="model.description"
                                    class="k-textbox"
                                    style="resize: vertical; overflow: auto; width: 100%;"></textarea>
                        </div>
                    </div>
                </div>
            </div>

            <div class="d-actions">
                <button class='k-button k-primary d-action-button' :disabled="invalid" @click="onConfirm">{{isNew ? 'Создать' : 'Обновить'}}</button>
                <button class='k-button d-action-button' @click="onCancel">Отмена</button>
            </div>

        </ValidationObserver>

    </vu-modal>

</template>

<script>

import ValidationError from '@/components/shared/validation-error.vue';
import { ValidationObserver } from 'vee-validate';
import axios from 'axios';

export default {
    name: 'pipeline-editor',
    components: {
        ValidationError,
        ValidationObserver,
    },
    props: {
        id: { type: Number, default: null },
    },
    computed: {
        title() {
            return `${this.isNew ? 'Создание нового отдела' : ('Изменение отдела ' + this.model.name)}`;
        },
    },
    data() {
        return {
            isNew: true,
            model: {
                id: null,
                name: null,
                description: null,
            }
        }
    },
    methods: {
        load() {
            axios.post('../api/department/getDepartment', { departmentId: this.id })
                .then(response => {
                    if(response.data.HasError) throw response.data.ErrorMessage;
                    const department = response.data.Result;
                    this.isNew = false;
                    this.model.id = department.Id;
                    this.model.name = department.Name;
                    this.model.description = department.Description;
                })
                .catch(error => {
                    console.log(error);
                    alert(`Ошибка при получении данных об отделе: ${error}`);
                });
        },

        _clear() {
            this.isNew = true;
            this.model.id = null;
            this.model.name = null;
            this.model.description = null;
        },

        _updateDepartment() {
            const model = this._getModelFromView();
            axios.post('../api/department/updateDepartment', { department: model })
                .then(response => {
                    if(response.data.HasError) throw response.data.ErrorMessage;
                    this.$modals.close(response.data.Result);
                })
                .catch(error => {
                    console.log(error);
                    alert(`Ошибка при ${this.isNew ? 'обновлении' : 'создании' } отдела: ${error}`);
                });
        },

        _getModelFromView() {
            return {
                Id: this.model.id,
                Name: this.model.name,
                Description: this.model.description,
            };
        },

        onConfirm() {
            this.$refs.observer.validate().then(isValid => {
                if(isValid) {
                    this._updateDepartment();
                }
            });
        },

        onCancel() {
            this.$modals.dismiss();
        },

    },
    created() {
        if(this.id != null) this.load();
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

</style>