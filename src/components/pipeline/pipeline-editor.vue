<template>

<!-- <ValidationObserver ref="observer" v-slot="{ invalid }" tag="div" slim> -->
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
                    <label for="pipelineName" class="control-label col-md-6">Наименование</label>
                    <div class="col-md-6">
                        <validation-provider name='Наименование' rules="required" v-slot="{ errors }">
                            <input  name="pipelineName" 
                                    v-model="model.pipelineName" 
                                    :class="{'k-textbox': true, 'is-danger': errors.length > 0 }"
                                    style="width: 100%;" />
                            <validation-error class="field-validation-error" v-show="errors.length > 0">
                                {{ errors[0] }}
                            </validation-error>
                        </validation-provider>
                    </div>
                </div>

                <div class="row form-group">
                    <label for="description" class="control-label col-md-6">Описание</label>
                    <div class="col-md-6">
                        <textarea name="description"
                                rows="3" cols="1"
                                v-model="model.description"
                                class="k-textbox"
                                style="resize: vertical; overflow: auto; width: 100%;"></textarea>
                    </div>
                </div>

                <div v-if="!isNew" class="row form-group">
                    <label for="kmStart" class="control-label col-md-6">Расположение (начало), км</label>
                    <div class="col-md-6">
                        <span name="kmStart">{{ _formatNumber('{0:0.000} км', model.kmStart) }}</span>
                    </div>
                </div>

                <div v-if="!isNew" class="row form-group">
                    <label for="kmEnd" class="control-label col-md-6">Расположение (конец), км</label>
                    <div class="col-md-6">
                        <span name="kmEnd">{{ _formatNumber('{0:0.000} км', model.kmEnd) }}</span>
                    </div>
                </div>

                <div v-if="!isNew && model.isDeleted" class="row form-group">
                    <label class="control-label col-md-6">Удален</label>
                </div>
            </div>

        </div>

        <div class="d-actions">
            <button class='k-button k-primary d-action-button' :disabled="invalid" @click="onConfirm">{{isNew ? 'Создать' : 'Обновить'}}</button>
            <button class='k-button d-action-button' @click="onCancel">Отмена</button>
        </div>

    </ValidationObserver>

    </vu-modal>

<!-- </ValidationObserver> -->

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
            return `${this.isNew ? 'Создание нового участка нефтепровода' : ('Изменение участка нефтепровода ' + this.model.pipelineName)}`;
        },

        // invalid() {
        //     const isValid = this.$refs.observer.validate();
        //     return isValid;
        // },
    },
    data() {
        return {
            isNew: true,
            model: {
                id: null,
                pipelineName: null,
                description: null,
                kmStart: null,
                kmEnd: null,
                isDeleted: false,
            }
        }
    },
    methods: {
        load() {
            axios.post('../api/pipeline/getPipeline', { pipelineId: this.id })
                .then(response => {
                    if(response.data.HasError) throw response.data.ErrorMessage;
                    const pipeline = response.data.Result;
                    this.isNew = false;
                    this.model.id = pipeline.Id;
                    this.model.pipelineName = pipeline.Name;
                    this.model.description = pipeline.Description;
                    this.model.kmStart = pipeline.KmStart;
                    this.model.kmEnd = pipeline.KmEnd;
                    this.model.isDeleted = pipeline.IsDeleted;
                })
                .catch(error => {
                    console.log(error);
                    alert(`Ошибка при получении данных об участке нефтепровода: ${error}`);
                });
        },

        _clear() {
            this.isNew = true;
            this.model.id = null;
            this.model.pipelineName = null;
            this.model.description = null;
            this.model.kmStart = null;
            this.model.kmEnd = null;
            this.model.isDeleted = false;
        },

        _updatePipeline() {
            const model = this._getModelFromView();
            axios.post('../api/pipeline/updatePipeline', { pipeline: model })
                .then(response => {
                    if(response.data.HasError) throw response.data.ErrorMessage;
                    this.$modals.close(response.data.Result);
                })
                .catch(error => {
                    console.log(error);
                    alert(`Ошибка при ${this.isNew ? 'обновлении' : 'создании' } участка нефтепровода: ${error}`);
                });
        },

        _getModelFromView() {
            return {
                Id: this.model.id,
                Name: this.model.pipelineName,
                Description: this.model.description,
            };
        },

        _formatNumber(format, num) {
            return kendo.format(format, num);
        },

        onConfirm() {
            this.$refs.observer.validate().then(isValid => {
                if(isValid) {
                    this._updatePipeline();
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