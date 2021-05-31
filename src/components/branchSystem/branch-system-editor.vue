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
                        <label for="name" class="control-label col-md-5">Наименование</label>
                        <div class="col-md-6">
                            <validation-provider name='Наименование' rules="required" v-slot="{ errors }">
                                <input  name="name" 
                                        v-model="model.name"
                                        :class="{'k-textbox': true, 'is-danger': errors.length > 0 }"
                                        tabindex="0" />
                                <validation-error class="field-validation-error" v-show="errors.length > 0">
                                    {{ errors[0] }}
                                </validation-error>
                            </validation-provider>
                        </div>
                    </div>

                    <div class="row form-group">
                        <label for="description" class="control-label col-md-5">Описание</label>
                        <div class="col-md-6">
                            <textarea name="description"
                                    rows="3" cols="1"
                                    v-model="model.description"
                                    tabindex="1"
                                    class="k-textbox"
                                    style="resize: vertical; overflow: auto;"></textarea>
                        </div>
                    </div>

                    <div class="row form-group">
                        <label for="pipeline" class="control-label col-md-5">Принадлежность</label>
                        <div class="col-md-6">
                            <kendo-dropdownlist ref="branch"
                                                name="branch"
                                                :data-source="branches"
                                                data-text-field="Name"
                                                data-value-field="Id"
                                                :value="model.branch != null ? model.branch.Id : null"
                                                @select="model.branch = $event.dataItem">
                            </kendo-dropdownlist>
                        </div>
                    </div>

                </div>
            </div>

            <div class="d-actions">
                <button class='btn btn-sm btn-primary d-action-button' :disabled="invalid" @click="onConfirm" tabindex="3">{{isNew ? 'Создать' : 'Обновить'}}</button>
                <button class='btn btn-sm btn-secondary d-action-button' @click="onCancel" tabindex="4">Отмена</button>
            </div>

        </ValidationObserver>

    </vu-modal>

</template>

<script>

import ValidationError from '@/components/shared/validation-error.vue';
import { ValidationObserver } from 'vee-validate';
import axios from 'axios';
import Vue from 'vue';

export default {
    name: 'branch-system-editor',
    components: {
        ValidationError,
        ValidationObserver,
    },
    props: {
        id: { type: Number, default: null },
        branchId: { type: Number, default: null }
    },
    computed: {
        title() {
            return `${this.isNew ? 'Создание новой системы' : ('Изменение системы ' + this.model.name)}`;
        },
    },
    data() {
        return {
            isNew: true,
            model: {
                id: null,
                name: null,
                description: null,
                branch: null,
            },
            branches: [],
        }
    },
    methods: {
        load() {
            axios.post('../api/branchSystem/getById', { id: this.id })
                .then(response => {
                    if(response.data.HasError) throw response.data.ErrorMessage;
                    const object = response.data.Result;
                    this.isNew = false;
                    this.model.id = object.Id;
                    this.model.name = object.Name;
                    this.model.description = object.Description;
                    this.model.branch = object.Branch;
                })
                .catch(error => {
                    console.log(error);
                    alert(`Ошибка при получении данных о системе: ${error}`);
                });
        },

        loadInitData() {
            return Promise.all([
                axios.post('../api/branch/getAll'),
            ]).then(responses => {
                    let branchesResponse = responses[0];

                    if(branchesResponse.data.HasError) throw branchesResponse.data.ErrorMessage;

                    this.branches = branchesResponse.data.Result;

                    return Promise.resolve();
                })
                .catch(error => {
                    console.log(error);
                    alert(`Ошибка при получении данных: ${error}`);
                });
        },

        _clear() {
            this.isNew = true;
            this.model.id = null;
            this.model.name = null;
            this.model.description = null;
            this.model.branch = null;
        },

        _updateObject() {
            const model = this._getModelFromView();
            axios.post('../api/branchSystem/update', { branchSystem: model })
                .then(response => {
                    if(response.data.HasError) throw response.data.ErrorMessage;
                    this.$modals.close(response.data.Result);
                })
                .catch(error => {
                    console.log(error);
                    alert(`Ошибка при ${this.isNew ? 'обновлении' : 'создании' } системы: ${error}`);
                });
        },

        _getModelFromView() {
            return {
                Id: this.model.id,
                Name: this.model.name,
                Description: this.model.description,
                Branch: this.model.branch,
            };
        },

        onConfirm() {
            this.$refs.observer.validate().then(isValid => {
                if(isValid) {
                    this._updateObject();
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

</style>