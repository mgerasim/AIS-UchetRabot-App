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
                        <label for="pipeline" class="my-label control-label col-md-6">Участок нефтепровода</label>
                        <div class="col-md-6">
                            <kendo-dropdownlist ref="pipeline"
                                                name="pipeline"
                                                :data-source="pipelines"
                                                data-text-field="Name"
                                                data-value-field="Id"
                                                :value="model.pipeline != null ? model.pipeline.Id : null"
                                                @select="model.pipeline = $event.dataItem"
                                                @change="onPipelineChange"
                                                style="width: 100%;">
                            </kendo-dropdownlist>
                        </div>
                    </div>

                    <div class="row form-group">
                        <label for="object" class="my-label control-label col-md-6">Объект</label>
                        <div class="col-md-6">
                            <div class="h-flex">
                                <div style="flex: 1 1 100%; min-width: 0;">{{ formatObject() }}</div>
                                <button class="k-button" @click="onObjectSelect" style="flex: 0 0 auto;" title="Выбрать объект из справочника">
                                    <fa icon="ellipsis-h"></fa>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="row form-group">
                        <label for="extended" class="my-label control-label col-md-6">Протяженный участок работ</label>
                        <div class="col-md-6 h-flex">
                            <input  id="extended"
                                    name="extended"
                                    type="checkbox"
                                    v-model="model.extended"
                                    tabindex="2"
                                    class="k-checkbox" />
                            <label for="extended" class="k-checkbox-label">{{ model.extended ? 'Да' : 'Нет' }}</label>
                        </div>
                    </div>

                    <div v-if="!model.extended" class="row form-group">
                        <label for="km" class="my-label control-label col-md-6">Место выполнения работ, км</label>
                        <div class="col-md-6">
                            <numerictextbox
                                name="km"
                                v-model="model.km"
                                format="n3"
                                :min="0"
                                :spinners="true"
                                style="width: 100%;"
                                :disabled="model.pipeline == null">
                            </numerictextbox>
                        </div>
                    </div>

                    <div v-if="model.extended" class="row form-group">
                        <label class="my-label control-label col-md-6">Участок выполнения работ, км</label>
                        <div class="col-md-3">
                            <numerictextbox
                                name="kmStart"
                                v-model="model.kmStart"
                                format="n3"
                                :min="0"
                                :spinners="true"
                                style="width: 100%;"
                                :disabled="model.pipeline == null">
                            </numerictextbox>
                        </div>
                        <div class="col-md-3">
                            <numerictextbox
                                name="kmEnd"
                                v-model="model.kmEnd"
                                format="n3"
                                :min="0"
                                :spinners="true"
                                style="width: 100%;"
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

import Vue from 'vue';
import ValidationError from '@/components/shared/validation-error.vue';
import { ValidationObserver } from 'vee-validate';
import axios from 'axios';
import ObjectSelectDialog from '@/components/object/object-select-dialog';
import Guid from '@/core/helpers/guid';

export default {
    name: 'permit-object-editor',
    components: {
        ValidationError,
        ValidationObserver,
    },
    props: {
        permitObject: { type: Object, default: null },
    },
    computed: {
        title() {
            return `${this.isNew ? 'Создание нового объекта выполнения работ' : 'Изменение объекта выполнения работ'}`;
        },
    },
    data() {
        return {
            isNew: true,
            model: {
                pipeline: this.permitObject != null ? this.permitObject.Pipeline : null,
                object: this.permitObject != null ? this.permitObject.Object : null,
                extended: this.permitObject != null ? !(this.permitObject.Km == this.permitObject.KmStart && this.permitObject.Km == this.permitObject.KmEnd) : false,
                km: this.permitObject != null ? this.permitObject.Km : null,
                kmStart: this.permitObject != null ? this.permitObject.KmStart : null,
                kmEnd: this.permitObject != null ? this.permitObject.KmEnd : null,
            },
            pipelines: [],
        }
    },
    methods: {
        loadInitData() {
            return Promise.all([
                axios.post('../api/pipeline/getAll'),
            ]).then(responses => {
                    let pipelinesResponse = responses[0];
                    if(pipelinesResponse.data.HasError) throw pipelinesResponse.data.ErrorMessage;
                    this.pipelines = pipelinesResponse.data.Result;
                    return Promise.resolve();
                })
                .catch(error => {
                    console.log(error);
                    alert(`Ошибка при получении данных: ${error}`);
                });
        },

        _getModelFromView() {
            return {
                Id: this.permitObject != null ? this.permitObject.Id : null,
                Guid: this.permitObject != null ? this.permitObject.Guid : Guid.generate(),
                Pipeline: this.model.pipeline,
                Object: this.model.object,
                Km: this.model.km,
                KmStart: this.model.extended ? this.model.kmStart : this.model.km,
                KmEnd: this.model.extended ? this.model.kmEnd : this.model.km,
            };
        },

        onConfirm() {
            this.$refs.observer.validate().then(isValid => {
                if(isValid) this.$modals.close(this._getModelFromView());
            });
        },

        onCancel() {
            this.$modals.dismiss();
        },

        onPipelineChange() {
        },

        onObjectSelect() {
            this.$modals.open({
                component: ObjectSelectDialog,
                props: {
                    pipelineId: this.model.pipeline != null ? this.model.pipeline.Id : null,
                },
                onClose: object => {
                    if(this.model.pipeline == null) {
                        this.model.pipeline = this.pipelines.find(p => p.Id == object.Pipeline.Id);
                    }
                    this.model.object = object;
                    this.model.extended = object.ObjectType.Extended;
                    this.model.km = object.Km;
                    this.model.kmStart = object.KmStart;
                    this.model.kmEnd = object.KmEnd;
                },
            });
        },

        formatObject() {
            if(this.model.object == null) return null;
            return `${this.model.object.Name}`;
        },
    },
    created() {
        this.loadInitData()
            .then(() => {
                if(this.permitObject != null && this.permitObject.Pipeline != null) {
                    Vue.nextTick(() => {
                        this.$refs.pipeline.kendoWidget().select(p => p.Id == this.permitObject.Pipeline.Id);
                        this.model.pipeline = this.pipelines.find(p => p.Id == this.permitObject.Pipeline.Id);
                    });
                }
            });
    },
}

</script>

<style scoped>

    .field-validation-error {
        margin-top: 8px;
    }

    .my-label {
        text-align: right;
    }

</style>