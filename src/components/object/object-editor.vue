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
                        <label for="departmentName" class="control-label col-md-5">Наименование</label>
                        <div class="col-md-6">
                            <validation-provider name='Наименование' rules="required" v-slot="{ errors }">
                                <input  name="departmentName" 
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
                        <label for="pipeline" class="control-label col-md-5">Участок нефтепровода</label>
                        <div class="col-md-6">
                            <kendo-dropdownlist ref="pipeline"
                                                name="pipeline"
                                                :data-source="pipelines"
                                                data-text-field="Name"
                                                data-value-field="Id"
                                                :value="model.pipeline != null ? model.pipeline.Id : pipelineId"
                                                @select="model.pipeline = $event.dataItem">
                            </kendo-dropdownlist>
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

                    <div class="row form-group">
                        <label for="pipeline" class="control-label col-md-5">Тип объекта</label>
                        <div class="col-md-6">
                            <kendo-dropdownlist ref="objectType"
                                                name="objectType"
                                                :data-source="objectTypes"
                                                data-text-field="Name"
                                                data-value-field="Id"
                                                :value="model.objectType != null ? model.objectType.Id : null"
                                                @select="model.objectType = $event.dataItem">
                            </kendo-dropdownlist>
                        </div>
                    </div>

                    <div class="row form-group" v-if="model.objectType != null && model.objectType.Extended">
                        <label for="kmStart" class="control-label col-md-5">Расположение начало, км</label>
                        <div class="col-md-6">
                            <numerictextbox
                                name="kmStart"
                                v-model="model.kmStart"
                                format="n3"
                                :min="0"
                                :spinners="true"
                                :disabled="model.pipeline == null">
                            </numerictextbox>
                        </div>
                    </div>

                    <div class="row form-group">
                        <label for="km" class="control-label col-md-5">Расположение центр, км</label>
                        <div class="col-md-6">
                            <numerictextbox
                                name="km"
                                v-model="model.km"
                                format="n3"
                                :min="0"
                                :spinners="true"
                                :disabled="model.pipeline == null">
                            </numerictextbox>
                        </div>
                    </div>

                    <div class="row form-group" v-if="model.objectType != null && model.objectType.Extended">
                        <label for="kmEnd" class="control-label col-md-5">Расположение конец, км</label>
                        <div class="col-md-6">
                            <numerictextbox
                                name="kmEnd"
                                v-model="model.kmEnd"
                                format="n3"
                                :min="0"
                                :spinners="true"
                                :disabled="model.pipeline == null">
                            </numerictextbox>
                        </div>
                    </div>

                </div>
            </div>

            <div class="d-actions">
                <button class='k-button k-primary d-action-button' :disabled="invalid" @click="onConfirm" tabindex="3">{{isNew ? 'Создать' : 'Обновить'}}</button>
                <button class='k-button k-secondary d-action-button' @click="onCancel" tabindex="4">Отмена</button>
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
    name: 'object-editor',
    components: {
        ValidationError,
        ValidationObserver,
    },
    props: {
        id: { type: Number, default: null },
        pipelineId: { type: Number, default: null }
    },
    computed: {
        title() {
            return `${this.isNew ? 'Создание нового объекта' : ('Изменение объекта ' + this.model.name)}`;
        },
    },
    data() {
        return {
            isNew: true,
            model: {
                id: null,
                name: null,
                description: null,
                pipeline: null,
                objectType: null,
                branch: null,
                km: 0,
                kmStart: 0,
                kmEnd: 0,
            },
            pipelines: [],
            objectTypes: [],
            branches: [],
        }
    },
    methods: {
        load() {
            axios.post('../api/object/getById', { id: this.id })
                .then(response => {
                    if(response.data.HasError) throw response.data.ErrorMessage;
                    const object = response.data.Result;
                    this.isNew = false;
                    this.model.id = object.Id;
                    this.model.name = object.Name;
                    this.model.description = object.Description;
                    this.model.pipeline = object.Pipeline;
                    this.model.objectType = object.ObjectType;
                    this.model.branch = object.Branch;
                    this.model.km = object.Km;
                    this.model.kmStart = object.KmStart;
                    this.model.kmEnd = object.KmEnd;
                })
                .catch(error => {
                    console.log(error);
                    alert(`Ошибка при получении данных об объекте: ${error}`);
                });
        },

        loadInitData() {
            return Promise.all([
                axios.post('../api/pipeline/getAll'),
                axios.post('../api/objectType/getAll'),
                axios.post('../api/branch/getAll'),
            ]).then(responses => {
                    let pipelinesResponse = responses[0];
                    let objectTypesResponse = responses[1];
                    let branchesResponse = responses[2];

                    if(pipelinesResponse.data.HasError) throw pipelinesResponse.data.ErrorMessage;
                    if(objectTypesResponse.data.HasError) throw objectTypesResponse.data.ErrorMessage;
                    if(branchesResponse.data.HasError) throw branchesResponse.data.ErrorMessage;

                    this.pipelines = pipelinesResponse.data.Result;
                    this.objectTypes = objectTypesResponse.data.Result;
                    this.branches = branchesResponse.data.Result;

                    return Promise.resolve();
                })
                .catch(error => {
                    console.log(error);
                    alert(`Ошибка при получении данных: ${error}`);
                });
        },

        _updateObject() {
            const model = this._getModelFromView();
            axios.post('../api/object/update', { object: model })
                .then(response => {
                    if(response.data.HasError) throw response.data.ErrorMessage;
                    this.$modals.close(response.data.Result);
                })
                .catch(error => {
                    console.log(error);
                    alert(`Ошибка при ${this.isNew ? 'обновлении' : 'создании' } объекта: ${error}`);
                });
        },

        _getModelFromView() {
            return {
                Id: this.model.id,
                Name: this.model.name,
                Description: this.model.description,
                Pipeline: this.model.pipeline,
                ObjectType: this.model.objectType,
                Branch: this.model.branch,
                Km: this.model.km,
                KmStart: this.model.kmStart,
                KmEnd: this.model.kmEnd,
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
                    if(this.pipelineId != null) {
                        this.$refs.pipeline.kendoWidget().select(dataItem => dataItem.Id == this.pipelineId);
                        this.model.pipeline = this.pipelines.find(p => p.Id == this.pipelineId);
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