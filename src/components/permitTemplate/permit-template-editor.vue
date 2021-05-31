<template>

    <vu-modal   :isScroll="false" 
                :escapable="true" 
                :dismissable="false"
                size="xl" 
                className="d-modal"
                headerClassName="d-header"
                bodyClassName="d-body"
                class="no-select"
                style="height: 95%; width: 90%; display: flex; flex-flow: column nowrap;">

        <template v-slot:header>
            <div class="h-flex" style="flex: 0 0 auto;">
                <span style="flex: 1 1 auto; margin-top: auto; margin-bottom: auto;">{{ title }}</span>
                <div class="d-close-icon" @click="onCancel">
                    <fa icon="times" size="lg" />
                </div>
            </div>
        </template>

        <div v-if="busy" class="busy">
            <busy-indicator name="permitTemplateEditorBusy"></busy-indicator>
        </div>

        <ValidationObserver ref="observer" v-slot="{ invalid }" tag="div" class="full-size v-flex" slim>

            <div v-if="!ready" class="d-container" style="flex: 1 1 100%; min-height: 0;">
            </div>

            <div v-if="ready" class="d-container" style="flex: 1 1 100%; min-height: 0;">

                <div v-if="userHasAllowLockPermitTemplateRight" style="flex: 0 0 auto; width: 100%; margin-bottom: 8px;">
                    <button class="k-button" @click="model.isLocked = !model.isLocked">
                        <fa :icon="model.isLocked ? 'lock' : 'lock-open'"></fa>
                        <span style="margin-left: 8px;">{{ model.isLocked ? 'Разрешить редактирование' : 'Закрыть редактирование' }}</span>
                    </button>
                </div>
                <div v-else style="flex: 0 0 auto; width: 100%; margin-bottom: 8px;">
                    <fa :icon="model.isLocked ? 'lock' : 'lock-open'"></fa>
                    <span style="margin-left: 8px;">{{ model.isLocked ? 'Закрыт для редактирования' : 'Редактирование разрешено' }}</span>
                </div>

                <b-tabs content-class="mt-3 my-tab-content v-flex" class="full-size v-flex">
                    
                    <b-tab title="Основная информация" active class="my-tab">

                        <div class="container-fluid full-size scroll-y">

                            <div class="row form-group">

                                <label class="control-label col-md-3 form-label">Файл текста разрешения</label>
                                <div class="col-md-9 h-flex">
                                    <div style="flex: 1 1 100%; win-width: 0;">
                                        <file   v-if="model.file != null" 
                                                :file="model.file"
                                                @rename="onFileRename"
                                                @remove="onFileRemove"
                                                @replace="onFileReplace"
                                                :readonly="isLocked"></file>
                                    </div>
                                    <div style="flex: 0 0 auto;">
                                        <file-upload-button v-if="!isLocked && model.file == null" 
                                                            class="k-button k-primary" 
                                                            :filters="filters" 
                                                            :multiple="false" 
                                                            title="Загрузить файл текста разрешения"
                                                            @upload="onFileUpload">
                                            <fa icon="download"></fa>&nbsp;Загрузить
                                        </file-upload-button>
                                    </div>
                                </div>

                            </div>

                            <div class="row form-group">
                                <label class="control-label col-md-3 form-label">Наименование</label>
                                <div class="col-md-9">
                                    <validation-provider name='Наименование' rules="required" v-slot="{ errors }">
                                        <input  name="name" 
                                                v-model="model.name"
                                                :class="{'k-textbox': true, 'is-danger': errors.length > 0 }"
                                                style="width: 100%;"
                                                :disabled="isLocked"
                                                tabindex="0" />
                                        <validation-error class="field-validation-error" v-show="errors.length > 0">
                                            {{ errors[0] }}
                                        </validation-error>
                                    </validation-provider>
                                </div>
                            </div>

                            <div class="row form-group">
                                <label class="control-label col-md-3 form-label">Краткое описание выполняемых работ (для табличной части разрешения)</label>
                                <div class="col-md-9">
                                    <validation-provider name='Описание' rules="required" v-slot="{ errors }" :disabled="!needBaseValidation">
                                        <textarea name="description"
                                                rows="3" cols="1"
                                                v-model="model.description"
                                                :disabled="isLocked"
                                                tabindex="1"
                                                class="k-textarea"
                                                style="resize: vertical; overflow: auto; width: 100%;"
                                                :class="{ 'is-danger': errors.length > 0 }"></textarea>
                                    </validation-provider>
                                </div>
                            </div>

                            <div class="row form-group">
                                <label class="control-label col-md-3 form-label">Полное описание выполняемых работ (для текста запроса в разрешении, если не указывать - будет использоваться краткое описание)</label>
                                <div class="col-md-9">
                                    <textarea name="fullDescription"
                                            rows="3" cols="1"
                                            v-model="model.fullDescription"
                                            tabindex="1"
                                            class="k-textarea"
                                            :disabled="isLocked"
                                            style="resize: vertical; overflow: auto; width: 100%;"></textarea>
                                </div>
                            </div>

                            <div class="row form-group">

                                <label class="control-label col-md-3 form-label">Тип оборудования</label>
                                <div class="col-md-3">
                                    <kendo-dropdownlist ref="equipmentType"
                                                        name="equipmentType"
                                                        :data-source="equipmentTypes"
                                                        data-text-field="DisplayName"
                                                        data-value-field="Value"
                                                        :value="model.equipmentType != null ? model.equipmentType.Value : null"
                                                        @select="model.equipmentType = $event.dataItem"
                                                        :disabled="isLocked"
                                                        style="width: 100%;">
                                    </kendo-dropdownlist>
                                </div>

                                <label class="control-label col-md-3 form-label">Вид работ</label>
                                <div class="col-md-3">
                                    <kendo-dropdownlist ref="workType"
                                                        name="workType"
                                                        :data-source="workTypes"
                                                        data-text-field="DisplayName"
                                                        data-value-field="Value"
                                                        :value="model.workType != null ? model.workType.Value : null"
                                                        @select="model.workType = $event.dataItem"
                                                        :disabled="isLocked"
                                                        style="width: 100%;">
                                    </kendo-dropdownlist>
                                </div>

                            </div>

                            <div class="row form-group">

                                <label class="form-label control-label col-md-3">Объект производства работ НПС (КП), км</label>
                                <div class="col-md-9">
                                    <permit-object-list
                                        v-model="model.permitTemplateObjects"
                                        :readOnly="isLocked">
                                    </permit-object-list>
                                </div>

                            </div>

                            <div class="row form-group">
                                <label class="form-label control-label col-md-3">Необходимость маскирования защит</label>
                                <group class="col-md-9">
                                    <div class="container" style="margin-top: 0.5rem;">
                                        <div class="row">
                                            <label for="needNpsMask" class="control-label col-md-2 form-label">Защиты МПСА + АСПТ</label>
                                            <div class="col-md-2 h-flex">
                                                <input  id="needNpsMask"
                                                        name="needNpsMask"
                                                        type="checkbox"
                                                        v-model="model.needNpsMask"
                                                        :disabled="isLocked"
                                                        tabindex="2"
                                                        class="k-checkbox" />
                                                <label for="needNpsMask" class="k-checkbox-label">{{ model.needNpsMask ? 'Да' : 'Нет' }}</label>
                                            </div>
                                            <label for="needEsuMask" class="control-label col-md-2 form-label">Защиты ЕСУ</label>
                                            <div class="col-md-2 h-flex">
                                                <input  id="needEsuMask"
                                                        name="needEsuMask"
                                                        type="checkbox"
                                                        v-model="model.needEsuMask"
                                                        :disabled="isLocked"
                                                        tabindex="2"
                                                        class="k-checkbox" />
                                                <label for="needEsuMask" class="k-checkbox-label">{{ model.needEsuMask ? 'Да' : 'Нет' }}</label>
                                            </div>
                                            <label for="needCspaMask" class="control-label col-md-2 form-label">Защиты ЦСПА</label>
                                            <div class="col-md-2 h-flex">
                                                <input  id="needCspaMask"
                                                        name="needCspaMask"
                                                        type="checkbox"
                                                        v-model="model.needCspaMask"
                                                        :disabled="isLocked"
                                                        tabindex="2"
                                                        class="k-checkbox" />
                                                <label for="needCspaMask" class="k-checkbox-label">{{ model.needCspaMask ? 'Да' : 'Нет' }}</label>
                                            </div>
                                        </div>
                                    </div>    
                                </group>
                            </div>

                            <div class="row form-group ">
                                <label class="control-label col-md-3 form-label">Линейная часть</label>
                                <div class="col-md-1 h-flex">
                                    <input  id="isLinearPart"
                                            name="isLinearPart"
                                            type="checkbox"
                                            v-model="model.isLinearPart"
                                            :disabled="isLocked"
                                            tabindex="2"
                                            class="k-checkbox" />
                                    <label for="isLinearPart" class="k-checkbox-label">{{ model.isLinearPart ? 'Да' : 'Нет' }}</label>
                                </div>

                                <div class="col-md-4">
                                    <div v-if="!model.isLinearPart" class="container">
                                        <div class="row form-group ">
                                            <label for="hasMna" class="control-label col-md-9 form-label">Наличие МНА</label>
                                            <div class="col-md-3 h-flex">
                                                <input  id="hasMna"
                                                        name="hasMna"
                                                        type="checkbox"
                                                        v-model="model.hasMna"
                                                        :disabled="true"
                                                        tabindex="2"
                                                        class="k-checkbox" />
                                                <label for="hasMna" class="k-checkbox-label">{{ model.hasMna ? 'Да' : 'Нет' }}</label>
                                            </div>
                                        </div>
                                        <div v-if="model.hasMna" class="row form-group ">
                                            <label for="needOutputToRepairMna" class="control-label col-md-9 form-label">Необходимость вывода МНА в ремонт</label>
                                            <div class="col-md-3 h-flex">
                                                <input  id="needOutputToRepairMna"
                                                        name="needOutputToRepairMna"
                                                        type="checkbox"
                                                        v-model="model.needOutputToRepairMna"
                                                        :disabled="isLocked"
                                                        tabindex="2"
                                                        class="k-checkbox" />
                                                <label for="needOutputToRepairMna" class="k-checkbox-label">{{ model.needOutputToRepairMna ? 'Да' : 'Нет' }}</label>
                                            </div>
                                        </div>
                                        <div v-if="model.hasMna" class="row form-group ">
                                            <label for="hasAvrMna" class="control-label col-md-9 form-label">Наличие АВР МНА</label>
                                            <!-- Выбор только если необходимо выводить МНА в ремонт -->
                                            <div v-if="model.needOutputToRepairMna" class="col-md-3 h-flex">
                                                <input  id="hasAvrMna"
                                                        name="hasAvrMna"
                                                        type="checkbox"
                                                        v-model="model.hasAvrMna"
                                                        :disabled="isLocked"
                                                        tabindex="2"
                                                        class="k-checkbox" />
                                                <label for="hasAvrMna" class="k-checkbox-label">{{ model.hasAvrMna ? 'Да' : 'Нет' }}</label>
                                            </div>
                                            <div v-else class="col-md-3 h-flex">
                                                <span>Не требуется</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-md-4">
                                    <div v-if="!model.isLinearPart" class="container">
                                        <div class="row form-group ">
                                            <label for="hasPna" class="control-label col-md-9 form-label">Наличие ПНА</label>
                                            <div class="col-md-3 h-flex">
                                                <input  id="hasPna"
                                                        name="hasPna"
                                                        type="checkbox"
                                                        v-model="model.hasPna"
                                                        :disabled="isLocked"
                                                        tabindex="2"
                                                        class="k-checkbox" />
                                                <label for="hasPna" class="k-checkbox-label">{{ model.hasPna ? 'Да' : 'Нет' }}</label>
                                            </div>
                                        </div>                                        
                                        <div v-if="model.hasPna" class="row form-group ">
                                            <label for="needOutputToRepairPna" class="control-label col-md-9 form-label">Необходимость вывода ПНА в ремонт</label>
                                            <div class="col-md-3 h-flex">
                                                <input  id="needOutputToRepairPna"
                                                        name="needOutputToRepairPna"
                                                        type="checkbox"
                                                        v-model="model.needOutputToRepairPna"
                                                        :disabled="isLocked"
                                                        tabindex="2"
                                                        class="k-checkbox" />
                                                <label for="needOutputToRepairPna" class="k-checkbox-label">{{ model.needOutputToRepairPna ? 'Да' : 'Нет' }}</label>
                                            </div>
                                        </div>
                                        <div v-if="model.hasPna" class="row form-group ">
                                            <label for="hasAvrPna" class="control-label col-md-9 form-label">Наличие АВР ПНА</label>
                                            <!-- Выбор только если необходимо выводить ПНА в ремонт -->
                                            <div v-if="model.needOutputToRepairPna" class="col-md-3 h-flex">
                                                <input  id="hasAvrPna"
                                                        name="hasAvrPna"
                                                        type="checkbox"
                                                        v-model="model.hasAvrPna"
                                                        :disabled="isLocked"
                                                        tabindex="2"
                                                        class="k-checkbox" />
                                                <label for="hasAvrPna" class="k-checkbox-label">{{ model.hasAvrPna ? 'Да' : 'Нет' }}</label>
                                            </div>
                                            <div v-else class="col-md-3 h-flex">
                                                <span>Не требуется</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </b-tab>

                    <b-tab v-if="model.needNpsMask" class="my-tab" title="Защиты МПСА + АСПТ">
                        <mpsa-masks-selector
                            v-if="permitTemplateCatalog != null && permitTemplateCatalog.Branch != null"
                            :branch-id="permitTemplateCatalog.Branch.Id"
                            :readOnly="isLocked"
                            v-model="model.maskGroups">
                        </mpsa-masks-selector>
                    </b-tab>

                    <b-tab v-if="model.needEsuMask" class="my-tab" title="Защиты ЕСУ">
                        <esu-masks-selector
                            v-if="permitTemplateCatalog != null"
                            :readOnly="isLocked"
                            v-model="model.maskGroups">
                        </esu-masks-selector>
                    </b-tab>

                    <b-tab v-if="model.needCspaMask" class="my-tab" title="Защиты ЦСПА">
                        <cspa-masks-selector
                            v-if="permitTemplateCatalog != null"
                            :readOnly="isLocked"
                            v-model="model.maskGroups">
                        </cspa-masks-selector>
                    </b-tab>

                </b-tabs>

            </div>

            <div class="d-actions">
                <button v-if="userHasAllowLockPermitTemplateRight || !isLocked" class='k-button k-primary d-action-button' :disabled="invalid" @click="onConfirm" tabindex="3">{{isNew ? 'Создать' : 'Обновить'}}</button>
                <button class='k-button d-action-button' @click="onCancel" tabindex="4">Отмена</button>
            </div>

        </ValidationObserver>

    </vu-modal>

</template>

<script lang="ts">

import Vue from 'vue';
import ValidationError from '@/components/shared/validation-error.vue';
import { ValidationObserver } from 'vee-validate';
import MpsaMasksSelector from '@/components/mask/mpsa-masks-selector.vue';
import EsuMasksSelector from '@/components/mask/esu-masks-selector.vue';
import CspaMasksSelector from '@/components/mask/cspa-masks-selector.vue';
import PermitObjectList from '@/components/permit/object/list.vue';
import FileUploadButton from '@/components/file/file-upload-button.vue';
import File from '@/components/file/file.vue';
import PermitTemplateService from '@/core/services/permit-template-service';
import PermitService from '@/core/services/permit-service';
import UserService from '@/core/services/user-service.js';
import Group from '@/components/shared/group.vue';
import { mapState } from 'vuex';
import IFullPermitTemplate from '@/core/types/permitTemplate/fullPermitTemplate';

export default Vue.extend({
    name: 'permit-template-editor',
    components: {
        ValidationError,
        ValidationObserver,
        MpsaMasksSelector,
        EsuMasksSelector,
        CspaMasksSelector,
        PermitObjectList,
        FileUploadButton,
        File,
        Group,
    },
    props: {
        id: { type: Number, default: null },
        catalogItemId: { type: Number, required: true },
        permitTemplateCatalogId: { type: Number, required: true },
    },
    computed: {
        title(): string {
            return `${this.isNew ? 'Создание нового шаблона разрешения' : 'Изменение шаблона разрешения '}`;
        },

        userHasAllowLockPermitTemplateRight(): boolean {
            if(this.currentUser == null) return false;
            return this.currentUser.Rights.some(p => p == 'AllowLockPermitTemplate');
        },

        isLocked(): boolean {
            if(this.model == null) return true;
            return this.model.isLocked;
        },

		...mapState({
            equipmentTypes: state => [{ Value: null, DisplayName: '-= Выберите тип оборудования =-' }, ...state.equipmentTypes],
            workTypes: state => [{ Value: null, DisplayName: '-= Выберите вид работ =-' }, ...state.workTypes],
        }),
    },
    data() {
        return {
            isNew: true,
            searchString: null,
            model: {
                id: undefined as (number | undefined),
                name: undefined as (string | undefined),
                permitTemplateObjects: [] as any[],
                equipmentType: undefined as any,
                workType: undefined as any,
                description: undefined as (string | undefined),
                fullDescription: undefined as (string | undefined),
                needNpsMask: false,    
                needEsuMask: false,    
                needCspaMask: false,    
                isLocked: false,
                file: undefined as any,   

                isLinearPart: false,
                hasMna: true as (boolean | undefined),
                needOutputToRepairMna: false as (boolean | undefined),
                hasAvrMna: false as (boolean | undefined),
                hasPna: false as (boolean | undefined),
                needOutputToRepairPna: undefined as (boolean | undefined),
                hasAvrPna: undefined as (boolean | undefined),

                maskGroups: [] as any[],        
            },
            permitTemplateCatalog: undefined as any,
            busy: false,
            ready: false,
            filters: [ 
//                /application\/msword/, 
                /application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document/,
            ],
            currentUser: undefined as any,
        }
    },
    methods: {
        load() {
            return PermitTemplateService.getById(this.id)
                .then(response => {
                    if(response.HasError) throw response.ErrorMessage;
                    const permit = response.Result;
                    this.isNew = false;
                    this.model.id = permit.Id;
                    this.model.name = permit.Name;
                    this.model.description = permit.Description;
                    this.model.fullDescription = permit.FullDescription;
                    this.model.permitTemplateObjects = permit.PermitTemplateObjects;
                    this.model.equipmentType = permit.EquipmentType;
                    this.model.workType = permit.WorkType;
                    this.model.needNpsMask = permit.NeedNpsMask;
                    this.model.needEsuMask = permit.NeedEsuMask;
                    this.model.needCspaMask = permit.NeedCspaMask;
                    this.model.isLocked = permit.IsLocked;
                    this.model.file = permit.File;

                    this.model.isLinearPart = permit.IsLinearPart;
                    this.model.hasMna = permit.HasMna;
                    this.model.needOutputToRepairMna = permit.NeedOutputToRepairMna;
                    this.model.hasAvrMna = permit.HasAvrMna;
                    this.model.hasPna = permit.HasPna;
                    this.model.needOutputToRepairPna = permit.NeedOutputToRepairPna;
                    this.model.hasAvrPna = permit.HasAvrPna;

                    this.model.maskGroups = permit.MaskGroups;
                })
                .catch(error => {
                    console.log(error);
                    alert(`Ошибка при получении данных о шаблоне разрешения: ${error}`);
                });
        },

        loadInitData() {
            return Promise.all([
                PermitTemplateService.getPermitTemplateCatalogById(this.permitTemplateCatalogId),
                UserService.getCurrentUser(),
            ])
            .then(responses => {
                let permitTemplateCatalogResponse = responses[0];
                let currentUserResponse = responses[1];

                if(permitTemplateCatalogResponse.data.HasError) throw permitTemplateCatalogResponse.data.ErrorMessage;
                if(currentUserResponse.data.HasError) throw currentUserResponse.data.ErrorMessage;

                this.permitTemplateCatalog = permitTemplateCatalogResponse.data.Result;
                this.currentUser = currentUserResponse.data.Result;
            })
            .catch(error => {
                console.log(error);
                alert(`Ошибка при получении данных: ${error}`);
            });
        },

        _updateObject() {
            const model = this._getModelFromView();
            this.busy = true;
            PermitTemplateService.updatePermitTemplate(model)
                .then(response => {
                    if(response.HasError) throw response.ErrorMessage;
                    this.busy = false;
                    this.$modals.close(response.Result);
                })
                .catch(error => {
                    this.busy = false;
                    console.log(error);
                    alert(`Ошибка при ${this.isNew ? 'обновлении' : 'создании' } шаблона разрешения: ${error}`);
                });
        },

        _getModelFromView(): IFullPermitTemplate {
            return {
                Id: this.model.id,
                Name: this.model.name || '',
                Description: this.model.description || '',
                FullDescription: this.model.fullDescription || '',
                CatalogItemId: this.catalogItemId,
                PermitTemplateCatalog: { Id: this.permitTemplateCatalogId },
                NeedNpsMask: this.model.needNpsMask,
                NeedEsuMask: this.model.needEsuMask,
                NeedCspaMask: this.model.needCspaMask,
                IsLocked: this.model.isLocked,
                EquipmentType: this.model.equipmentType,
                WorkType: this.model.workType,
                PermitTemplateObjects: this.model.permitTemplateObjects,
                File: this.model.file,

                IsLinearPart: this.model.isLinearPart,
                HasMna: this.model.isLinearPart ? undefined : this.model.hasMna,
                NeedOutputToRepairMna: (!this.model.isLinearPart && this.model.hasMna) ? this.model.needOutputToRepairMna : undefined,
                HasAvrMna: (!this.model.isLinearPart && this.model.hasMna && this.model.needOutputToRepairMna) ? this.model.hasAvrMna : undefined,
                HasPna: this.model.isLinearPart ? undefined : this.model.hasPna,
                NeedOutputToRepairPna: (!this.model.isLinearPart && this.model.hasPna) ? this.model.needOutputToRepairPna : undefined,
                HasAvrPna: (!this.model.isLinearPart && this.model.hasPna && this.model.needOutputToRepairPna) ? this.model.hasAvrPna : undefined,

                MaskGroups: this.model.maskGroups,
            };
        },

        onConfirm() {
            this.$refs.observer.validate().then((isValid: boolean) => {
                if(isValid) {
                    this._updateObject();
                }
            });
        },

        onCancel() {
            this.$modals.dismiss();
        },

        onFileUpload({ file, completed }) {
            let dotIndex = file.name.lastIndexOf('.');
            let fileName = dotIndex == -1 ? file.name : file.name.substring(0, dotIndex);
            let fileExtension = dotIndex == -1 ? null : file.name.substring(dotIndex);

            this.model.file = {
                Id: file.id,
                Name: fileName,
                Extension: fileExtension,
                Size: file.size,
                Content: file.content,
                IsNew: true,
            };

            completed();
        },

        onFileRename() {
            this.$dialogs.requestString({ title: 'Переименование файла', message: `Переименовать файл '${this.model.file.Name}' в`, value: this.model.file.Name })
                .then(newName => {
                    if(newName == null || newName == "" || newName === this.model.file.Name) return;
                    this.model.file.Name = newName;
                });                
        },

        onFileRemove() {
            this.model.file = null;
        },

        onFileReplace({ newFile, completed }) {
            this.onFileUpload({ file: newFile, completed })
        },
    },
    created() {
        this.isNew = this.id == null;
        this.busy = true;
        this.loadInitData()
            .then(() => {
                if(this.id != null) {
                    return this.load();
                } else {
                    return Promise.resolve();
                }
            })
            .then(() => {
                this.busy = false;
                this.ready = true;
            });
    },
})

</script>

<style scoped lang="scss">

.field-validation-error {
    margin-top: 8px;
}

</style>

<style lang="scss">

.permit-editor-masks {
    height: 100% !important;
    width: 100% !important;
    font-size: 0.8rem !important;
}

.form-label {
    text-align: right;
}

.my-tab-content {
    flex: 1 1 100%;
    min-height: 0;
}

.my-tab {
    flex: 1 1 100%; 
    min-height: 0;
}

</style>