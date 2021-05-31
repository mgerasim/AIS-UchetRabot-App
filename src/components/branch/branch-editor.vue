<template>

    <vu-modal   :isScroll="false" 
                :center="true" 
                :escapable="true" 
                :dismissable="false" 
                className="d-modal"
                class="no-select"
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

        <ValidationObserver v-if="model != null" ref="observer" tag="div" slim>

            <div class="d-container">

                <div class="container-fluid">

                    <div class="row form-group">
                        <label for="name" class="control-label col-md-6">Наименование</label>
                        <div class="col-md-6">
                            <validation-provider name='Наименование' rules="required" v-slot="{ errors }">
                                <input  name="name" 
                                        v-model="model.name"
                                        :class="{'k-textbox': true, 'is-danger': errors.length > 0 }"
                                        style="width: 100%;" />
                                <validation-error class="field-validation-error" v-show="errors.length > 0">
                                    {{ errors[0] }}
                                </validation-error>
                            </validation-provider>
                        </div>
                    </div>

                    <div class="row form-group">
                        <label for="shortName" class="control-label col-md-6">Сокращенное наименование</label>
                        <div class="col-md-6">
                            <validation-provider name='Наименование' rules="required" v-slot="{ errors }">
                                <input  name="shortName" 
                                        v-model="model.shortName"
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

                    <div class="row form-group">
                        <label for="pipeline" class="control-label col-md-6">Участок нефтепровода</label>
                        <div class="col-md-6">
                            <kendo-dropdownlist name="pipeline"
                                                :data-source="pipelines"
                                                data-text-field="Name"
                                                data-value-field="Id"
                                                :value="!!model.pipeline ? model.pipeline.Id : null"
                                                :value-primitive="true"
                                                @select="model.pipeline = $event.dataItem"
                                                style="width: 100%;">
                            </kendo-dropdownlist>
                        </div>
                    </div>

                    <div class="row form-group">
                        <label for="branchType" class="control-label col-md-6">Тип объекта</label>
                        <div class="col-md-6">
                            <dropdownlist   name="branchType"
                                            :data-source="branchTypes"
                                            data-text-field="DisplayName"
                                            data-value-field="Value"
                                            v-model="model.branchType"
                                            style="width: 100%;">
                            </dropdownlist>
                        </div>
                    </div>

                    <div class="row form-group">
                        <label for="km" class="control-label col-md-6">Расположение, км</label>
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

                    <div class="row form-group">
                        <label for="kmStart" class="control-label col-md-6">Начало зоны ответственности, км</label>
                        <div class="col-md-6">
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
                    </div>

                    <div class="row form-group">
                        <label for="kmEnd" class="control-label col-md-6">Конец зоны ответственности, км</label>
                        <div class="col-md-6">
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

                    <group title="Хранилище исторических данных" style="padding: 0; margin: 16px 0;">
                        <div class="row form-group">
                            <label for="historyLinkedServer" class="control-label col-md-6">Linked Server</label>
                            <div class="col-md-6">
                                <input  name="historyLinkedServer" 
                                        v-model="model.historyLinkedServer"
                                        placeholder="10.244.10.13\SQLEXPRESS"
                                        class="k-textbox"
                                        style="width: 100%;" />
                            </div>
                        </div>

                        <div class="row form-group">
                            <label for="historyDatabaseName" class="control-label col-md-6">MPSA Database Name</label>
                            <div class="col-md-6">
                                <input  name="historyDatabaseName" 
                                        v-model="model.historyDatabaseName"
                                        placeholder="AELogMPSA"
                                        class="k-textbox"
                                        style="width: 100%;" />
                            </div>
                        </div>

                        <div class="row form-group">
                            <label for="historyTableType" class="control-label col-md-6">Тип таблицы</label>
                            <div class="col-md-6">
                                <dropdownlist   name="historyTableType"
                                                :data-source="historyTableTypes"
                                                data-text-field="Name"
                                                data-value-field="Value"
                                                v-model="model.historyTableType"
                                                style="width: 100%;">
                                </dropdownlist>
                            </div>
                        </div>
                    </group>

                    <div class="row form-group">
                        <label for="opcPathPrefix" class="control-label col-md-6">Общая часть дерева OPC</label>
                        <div class="col-md-6">
                            <input  name="opcPathPrefix" 
                                    v-model="model.opcPathPrefix"
                                    placeholder="пример: AK.DMN.NPS34.MPSA.mpsa.plc_nps34"
                                    class="k-textbox"
                                    style="width: 100%;" />
                        </div>
                    </div>

                </div>
            </div>

            <div class="d-actions">
                <button class='k-button k-primary d-action-button' @click="onConfirm">{{isNew ? 'Создать' : 'Обновить'}}</button>
                <button class='k-button d-action-button' @click="onCancel">Отмена</button>
            </div>

        </ValidationObserver>

    </vu-modal>

</template>

<script>

import ValidationError from '@/components/shared/validation-error.vue';
import Group from '@/components/shared/group';
import { ValidationObserver } from 'vee-validate';
import axios from 'axios';
import Dropdownlist from '@/components/shared/dropdownlist';

export default {
    name: 'branch-editor',
    components: {
        ValidationError,
        ValidationObserver,
        Group,
        Dropdownlist,
    },
    props: {
        id: { type: Number, default: null },
    },
    computed: {
        title() {
            return `${this.isNew ? 'Создание нового подразделения' : ('Изменение подразделения ' + (this.model && this.model.name))}`;
        },
    },
    data() {
        return {
            isNew: true,
            pipelines: [],
            branchTypes: [],
            historyTableTypes: [],
            model: {
                id: null,
                parentId: null,
                name: null,
                shortName: null,
                code: null,
                description: null,
                pipeline: null,
                km: null,
                kmStart: null,
                kmEnd: null,
                historyLinkedServer: null,
                historyDatabaseName: null,
                historyTableType: null,
                opcPathPrefix: null,
            }
        }
    },
    methods: {
        loadInitData() {
            Promise.all([
                    axios.post('../api/pipeline/getAll'), 
                    axios.post('../api/branch/getBranchTypes'),
                    axios.post('../api/branch/getHistoryTableTypes'),
                ])
                .then(responses => {
                    const getPipelinesResponse = responses[0];
                    const getBranchTypesResponse = responses[1];
                    const getHistoryTableTypesResponse = responses[2];
                    if(getPipelinesResponse.data.HasError) throw getPipelinesResponse.data.ErrorMessage;
                    if(getBranchTypesResponse.data.HasError) throw getBranchTypesResponse.data.ErrorMessage;
                    if(getHistoryTableTypesResponse.data.HasError) throw getHistoryTableTypesResponse.data.ErrorMessage;
                    this.pipelines = getPipelinesResponse.data.Result;
                    this.branchTypes = getBranchTypesResponse.data.Result;
                    this.historyTableTypes = getHistoryTableTypesResponse.data.Result;
                })
                .catch(error => {
                    console.log(error);
                    alert(`Ошибка при получении данных: ${error}`);
                });
        },

        loadBranch() {
            axios.post('../api/branch/getBranch', { branchId: this.id })
                .then(response => {
                    if(response.data.HasError) throw response.data.ErrorMessage;
                    const branch = response.data.Result;
                    this.isNew = false;
                    this.model.id = branch.Id;
                    this.model.parentId = branch.ParentId;
                    this.model.name = branch.Name;
                    this.model.shortName = branch.ShortName;
                    this.model.code = branch.Code;
                    this.model.description = branch.Description;
                    this.model.pipeline = branch.Pipeline;
                    this.model.km = branch.Km;
                    this.model.kmStart = branch.KmStart;
                    this.model.kmEnd = branch.KmEnd;
                    this.model.branchType = this.branchTypes.find(p => p.Value == branch.BranchType);
                    this.model.historyLinkedServer = branch.HistoryLinkedServer;
                    this.model.historyDatabaseName = branch.HistoryDatabaseName;
                    this.model.historyTableType = branch.HistoryTableType;
                    this.model.opcPathPrefix = branch.OpcPathPrefix;
                })
                .catch(error => {
                    console.log(error);
                    alert(`Ошибка при получении данных о подразделении: ${error}`);
                });
        },

        _updateBranch() {
            const model = this._getModelFromView();
            axios.post('../api/branch/updateBranch', { branch: model })
                .then(response => {
                    if(response.data.HasError) throw response.data.ErrorMessage;
                    this.$modals.close(response.data.Result);
                })
                .catch(error => {
                    console.log(error);
                    alert(`Ошибка при ${this.isNew ? 'обновлении' : 'создании' } подразделения: ${error}`);
                });
        },

        _getModelFromView() {
            return {
                Id: this.model.id,
                ParentId: this.model.parentId,
                Name: this.model.name,
                ShortName: this.model.shortName,
                Code: this.model.code,
                Description: this.model.description,
                Pipeline: this.model.pipeline,
                BranchType: !this.model.branchType ? null : this.model.branchType.Value,
                Km: this.model.km,
                KmStart: this.model.kmStart,
                KmEnd: this.model.kmEnd,
                HistoryLinkedServer: this.model.historyLinkedServer,
                HistoryDatabaseName: this.model.historyDatabaseName,
                HistoryTableType: this.model.historyTableType,
                OpcPathPrefix: this.model.opcPathPrefix,
            };
        },

        onConfirm() {
            this.$refs.observer.validate().then(isValid => {
                if(isValid) {
                    this._updateBranch();
                }
            });
        },

        onCancel() {
            this.$modals.dismiss();
        },

    },
    created() {
        this.loadInitData();
        if(this.id != null) this.loadBranch();
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