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
            <busy-indicator name="permitEditorBusy"></busy-indicator>
        </div>

        <ValidationObserver ref="observer" v-slot="{ invalid }" tag="div" class="full-size v-flex" slim>

            <div v-if="!ready" class="d-container" style="flex: 1 1 100%; min-height: 0;">
            </div>

            <div v-if="ready" class="d-container" style="flex: 1 1 100%; min-height: 0;">

                <b-tabs content-class="mt-3 my-tab-content v-flex" class="full-size v-flex">
                    
                    <ValidationObserver ref="mainTabObserver" v-slot="mto" tag="div" class="full-size v-flex" slim>

                        <b-tab active class="my-tab">
                            <template v-slot:title>
                                <div class="h-flex tab-header" :class="{ 'tab-header-error': (needSaveValidation || needBaseValidation) && mto.invalid }">
                                    <fa v-if="(needSaveValidation || needBaseValidation) && mto.invalid" icon="exclamation"></fa>
                                    <span>Основная информация</span>
                                </div>
                            </template>

                            <div class="full-size scroll-y">
                                <permit-editor-main-page 
                                    v-model="model"
                                    :departments="departments"
                                    :branches="branches"
                                    :statuses="statuses"
                                    :equipment-types="equipmentTypes"
                                    :work-types="workTypes"
                                    :read-only="!isBaseEditable"
                                    @branchChanged="branchChanged"
                                    @permitTemplateChanged="permitTemplateChanged"
                                    :need-save-validation="needSaveValidation"
                                    :need-base-validation="needBaseValidation"></permit-editor-main-page>
                            </div>

                        </b-tab>

                    </ValidationObserver>

                    <ValidationObserver ref="printFormTabObserver" v-slot="pfto" tag="div" class="full-size v-flex" slim>

                        <b-tab class="my-tab">
                            <template v-slot:title>
                                <div class="h-flex tab-header" :class="{ 'tab-header-error': needBaseValidation && pfto.invalid }">
                                    <fa v-if="needBaseValidation && pfto.invalid" icon="exclamation"></fa>
                                    <span>Печатная форма</span>
                                </div>
                            </template>

                            <group>
                                <template v-slot:title>
                                    <a href="#" @click="onToSelect">Кому</a>
                                </template>

                                <div class="row form-group">
                                    <label for="to" class="my-label control-label col-md-3">Кому</label>
                                    <div class="col-md-9">
                                        <validation-provider name='Кому' rules="required" v-slot="{ errors }" :disabled="!needBaseValidation">
                                            <input  name="to" 
                                                    v-model="model.to"
                                                    :disabled="!isBaseEditable"
                                                    class='k-textbox'
                                                    style="width: 100%;"
                                                    tabindex="0" 
                                                    placeholder="Главному инженеру ООО «Транснефть - Дальний Восток» А.В. Звайгзне" 
                                                    :class="{ 'is-danger': errors.length > 0 }" />
                                        </validation-provider>
                                    </div>
                                </div>

                                <div class="row form-group">
                                    <label for="toPosition" class="my-label control-label col-md-3">Должность</label>
                                    <div class="col-md-9">
                                        <validation-provider name='Кому (должность)' rules="required" v-slot="{ errors }" :disabled="!needBaseValidation">
                                            <input  name="toPosition" 
                                                    v-model="model.toPosition"
                                                    :disabled="!isBaseEditable"
                                                    class='k-textbox'
                                                    style="width: 100%;"
                                                    tabindex="0" 
                                                    placeholder="Главный инженер ООО «Транснефть - Дальний Восток»"
                                                    :class="{ 'is-danger': errors.length > 0 }" />
                                        </validation-provider>
                                    </div>
                                </div>

                                <div class="row form-group">
                                    <label for="toName" class="my-label control-label col-md-3">Имя</label>
                                    <div class="col-md-9">
                                        <validation-provider name='Кому (имя)' rules="required" v-slot="{ errors }" :disabled="!needBaseValidation">
                                            <input  name="toName" 
                                                    v-model="model.toName"
                                                    :disabled="!isBaseEditable"
                                                    class='k-textbox'
                                                    style="width: 100%;"
                                                    tabindex="0" 
                                                    placeholder="А.В. Звайгзне"
                                                    :class="{ 'is-danger': errors.length > 0 }" />
                                        </validation-provider>
                                    </div>
                                </div>
                            </group>

                            <group style="margin-top: 16px;">
                                <template v-slot:title>
                                    <a href="#" @click="onFromSelect">От кого</a>
                                </template>

                                <div class="row form-group">
                                    <label for="from" class="my-label control-label col-md-3 right">От кого</label>
                                    <div class="col-md-9">
                                        <validation-provider name='От кого' rules="required" v-slot="{ errors }" :disabled="!needBaseValidation">
                                            <input  name="from" 
                                                    v-model="model.from"
                                                    :disabled="!isBaseEditable"
                                                    class='k-textbox'
                                                    style="width: 100%;"
                                                    tabindex="0" 
                                                    placeholder="Начальника РНУ «Белогорск» А.И. Шендерова"
                                                    :class="{ 'is-danger': errors.length > 0 }" />
                                        </validation-provider>
                                    </div>
                                </div>

                                <div class="row form-group">
                                    <label for="fromPosition" class="my-label control-label col-md-3 right">Должность</label>
                                    <div class="col-md-9">
                                        <validation-provider name='От кого (должность)' rules="required" v-slot="{ errors }" :disabled="!needBaseValidation">
                                            <input  name="fromPosition" 
                                                    v-model="model.fromPosition"
                                                    :disabled="!isBaseEditable"
                                                    class='k-textbox'
                                                    style="width: 100%;"
                                                    tabindex="0" 
                                                    placeholder="Начальник РНУ «Белогорск»"
                                                    :class="{ 'is-danger': errors.length > 0 }" />
                                        </validation-provider>
                                    </div>
                                </div>

                                <div class="row form-group">
                                    <label for="fromName" class="my-label control-label col-md-3 right">Имя</label>
                                    <div class="col-md-9">
                                        <validation-provider name='От кого (имя)' rules="required" v-slot="{ errors }" :disabled="!needBaseValidation">
                                            <input  name="fromName" 
                                                    v-model="model.fromName"
                                                    :disabled="!isBaseEditable"
                                                    class='k-textbox'
                                                    style="width: 100%;"
                                                    tabindex="0"
                                                    placeholder="А.И. Шендеров"
                                                    :class="{ 'is-danger': errors.length > 0 }" />
                                        </validation-provider>
                                    </div>
                                </div>

                            </group>

                        </b-tab>

                    </ValidationObserver>

                    <ValidationObserver v-if="model != null && model.needNpsMask" ref="mpsaMasksTabObserver" v-slot="mmto" tag="div" class="full-size v-flex" slim>

                        <b-tab class="my-tab">
                            <template v-slot:title>
                                <div class="h-flex tab-header" :class="{ 'tab-header-error': needBaseValidation && mmto.invalid }">
                                    <fa v-if="needBaseValidation && mmto.invalid" icon="exclamation"></fa>
                                    <span>Защиты МПСА + АСПТ</span>
                                </div>
                            </template>

                            <validation-provider name='Защиты МПСА' :rules="{ required: true, minMaskLength: { min: 1, systems: ['MPSA', 'ASPT'] } }" v-slot="{ errors }" :disabled="!needBaseValidation">
                                <mpsa-masks-selector
                                    v-if="model.branch != null"
                                    :read-only="!isBaseEditable"
                                    :branch-id="model.branch.Id"
                                    v-model="model.maskGroups">
                                </mpsa-masks-selector>
                            </validation-provider>

                        </b-tab>

                    </ValidationObserver>

                    <ValidationObserver v-if="model != null && model.needEsuMask" ref="esuMasksTabObserver" v-slot="emto" tag="div" class="full-size v-flex" slim>

                        <b-tab class="my-tab">
                            <template v-slot:title>
                                <div class="h-flex tab-header" :class="{ 'tab-header-error': needBaseValidation && emto.invalid }">
                                    <fa v-if="needBaseValidation && emto.invalid" icon="exclamation"></fa>
                                    <span>Защиты ЕСУ</span>
                                </div>
                            </template>

                            <validation-provider name='Защиты ЕСУ' :rules="{ required: true, minMaskLength: { min: 1, systems: ['SAU', 'SDKU'] } }" v-slot="{ errors }" :disabled="!needBaseValidation">
                                <esu-masks-selector
                                    :readOnly="!isBaseEditable"
                                    v-model="model.maskGroups">
                                </esu-masks-selector>
                            </validation-provider>

                        </b-tab>

                    </ValidationObserver>

                    <ValidationObserver v-if="model != null && model.needCspaMask" ref="cspaMasksTabObserver" v-slot="cmto" tag="div" class="full-size v-flex" slim>

                        <b-tab class="my-tab">
                            <template v-slot:title>
                                <div class="h-flex tab-header" :class="{ 'tab-header-error': needBaseValidation && cmto.invalid }">
                                    <fa v-if="needBaseValidation && cmto.invalid" icon="exclamation"></fa>
                                    <span>Защиты ЦСПА</span>
                                </div>
                            </template>

                            <validation-provider name='Защиты ЦСПА' :rules="{ required: true, minMaskLength: { min: 1, systems: ['CSPA'] } }" v-slot="{ errors }" :disabled="!needBaseValidation">
                                <cspa-masks-selector
                                    :readOnly="!isBaseEditable"
                                    v-model="model.maskGroups">
                                </cspa-masks-selector>
                            </validation-provider>

                        </b-tab>

                    </ValidationObserver>

                    <ValidationObserver ref="responsibleTabObserver" v-slot="rto" tag="div" class="full-size v-flex" slim>
                        <b-tab class="my-tab">
                            <template v-slot:title>
                                <div class="h-flex tab-header" :class="{ 'tab-header-error': needBaseValidation && rto.invalid }">
                                    <fa v-if="needBaseValidation && rto.invalid" icon="exclamation"></fa>
                                    <span>Ответственные</span>
                                </div>
                            </template>
                            <validation-provider name='Ответственные' :rules="{ required: true, custom: { validate: permitResponsibleSelectorValidate } }" v-slot="{ errors }" :disabled="!needBaseValidation">
                                <permit-responsible-selector 
                                    :read-only="!isBaseEditable"
                                    :branches="branches" 
                                    :departments="departments"
                                    :branchId="model.branch != null ? model.branch.Id : null"
                                    :departmentId="model.department != null ? model.department.Id : null"
                                    v-model="model.responsiblePersons"
                                    :need-mask="model.needNpsMask"
                                    :is-linear-part="model.isLinearPart"
                                    :class="{ 'is-danger': needBaseValidation && errors.length > 0 }">
                                </permit-responsible-selector>
                            </validation-provider>
                        </b-tab>
                    </ValidationObserver>

                    <ValidationObserver v-if="showSedPage" ref="sedTabObserver" v-slot="sto" tag="div" class="full-size v-flex" slim>

                        <b-tab class="my-tab" ref="sedTab">
                            <template v-slot:title>
                                <div class="h-flex tab-header" :class="{ 'tab-header-error': needSedValidation && sto.invalid }">
                                    <fa v-if="needSedValidation && sto.invalid" icon="exclamation"></fa>
                                    <span>Согласование в СЭД</span>
                                </div>
                            </template>

                            <div class="row form-group">
                                <label class="my-label control-label col-md-3">Разрешение (включая приложения)</label>
                                <div class="col-md-9">
                                    <file v-if="model.generatedFile != null" :file="model.generatedFile" :readonly="true"></file>
                                </div>
                            </div>

                            <!-- <div class="row form-group">
                                <label class="my-label control-label col-md-3">Разрешение</label>
                                <div class="col-md-9">
                                    <file v-if="model.generatedMainFile != null" :file="model.generatedMainFile" :readonly="true"></file>
                                </div>
                            </div>

                            <div class="row form-group">
                                <label class="my-label control-label col-md-3">Приложение 1</label>
                                <div class="col-md-9">
                                    <file v-if="model.generatedAttachment1File != null" :file="model.generatedAttachment1File" :readonly="true"></file>
                                </div>
                            </div>

                            <div class="row form-group">
                                <label for="number" class="my-label control-label col-md-3">Приложение 2</label>
                                <div class="col-md-9">
                                    <file v-if="model.generatedAttachment2File != null" :file="model.generatedAttachment2File" :readonly="true"></file>
                                </div>
                            </div> -->

                            <div class="row form-group">

                                <label for="number" class="my-label control-label col-md-3">Номер разрешения в СЭД</label>
                                <div class="col-md-3">
                                    <validation-provider name='Номер разрешения в СЭД' rules="required" v-slot="{ errors }" :disabled="!needSedValidation">
                                        <input  name="number" 
                                                v-model="model.sedDocumentNumber"
                                                :disabled="!isSedEditable"
                                                class="k-textbox"
                                                style="width: 100%;"
                                                tabindex="0" 
                                                :class="{ 'is-danger': errors.length > 0 }"/>
                                    </validation-provider>
                                </div>

                                <label class="my-label control-label col-md-3">Дата разрешения в СЭД</label>
                                <span class="my-label control-label col-md-3">{{ formatDate(model.sedDocumentDate) }}</span>

                            </div>












                            <group style="margin-top:256px;">
                                <template v-slot:title>
                                    <span style="64px; color: red; font-size: 2rem;">НИЧЕГО НЕ НАЖИМАТЬ В ЭТОМ КУСКЕ ОКНА - ТЕСТИРОВАНИЕ!!!!!</span>
                                </template>

                                <button v-if="sedDocument == null || (sedDocument.State && sedDocument.State.Name == 'Cancelled')" class="k-button k-button-secondary" @click="handleSedDocumentCreate">Создать документ в СЭД</button>

                                <button v-if="sedDocument && sedDocument.State && sedDocument.State.Name == 'ExternalRework'" class="k-button k-button-secondary" @click="handleSedDocumentUpdate">Обновить документ в СЭД</button>

                                <div class="container" style="margin-top: 32px;" v-if="sedDocument">
                                    <div class="row form-group">
                                        <label class="col-6" for="">Дата действия</label>
                                        <span class="col-6">{{formatUtcDate(sedDocument.ActionDateUtc)}}</span>
                                    </div>

                                    <div class="row form-group">
                                        <label class="col-6" for="">Дополнительная информация об ошибке</label>
                                        <span class="col-6">{{sedDocument.Remark}}</span>
                                    </div>

                                    <div v-if="sedDocument.State" class="row form-group">
                                        <label class="col-6" for="">Статус документа в СЭД</label>
                                        <span class="col-6">{{sedDocument.State.DisplayName}}</span>
                                    </div>

                                    <div v-if="sedDocument.StatusCode" class="row form-group">
                                        <label class="col-6" for="">Успешность</label>
                                        <span class="col-6">{{sedDocument.StatusCode.DisplayName}}</span>
                                    </div>

                                    <div class="row form-group">
                                        <label class="col-6" for="">Успешность</label>
                                        <span class="col-6">{{sedDocument.StatusDescription}}</span>
                                    </div>

                                    <div class="row form-group">
                                        <label class="col-6" for="">Дата обновления записи</label>
                                        <span class="col-6">{{formatUtcDate(sedDocument.UpdateDateUtc)}}</span>
                                    </div>

                                    <div class="row form-group">
                                        <label class="col-6" for="">URL</label>
                                        <a class="col-6" :href="sedDocument.Url" target="_blank">Ссылка на открытие документа в СЭД</a>
                                    </div>

                                </div>


                            </group>


                        </b-tab>

                    </ValidationObserver>

                </b-tabs>

            </div>

            <div class="d-actions" style="flex: 0 0 auto;">
                <button v-if="canSave" class='k-button k-primary d-action-button' @click="onSave(false)" tabindex="3">
                    <fa icon="save"></fa>&nbsp;{{isNew ? 'Создать' : 'Обновить'}}
                </button>
                <button v-if="canSave" class='k-button d-action-button' @click="onSave(true)" tabindex="3">
                    <fa icon="check"></fa>&nbsp;{{isNew ? 'Создать и закрыть' : 'Обновить и закрыть'}}
                </button>
                <button v-if="canChangeToRevisionStatus" class='k-button d-action-button' @click="changeToRevisionStatus" tabindex="3">
                    На доработку
                </button>
                <button v-if="canChangeToReadyToApproveStatus" class='k-button d-action-button' @click="changeToReadyToApproveStatus" tabindex="3">
                    Подготовить к согласованию в СЭД
                </button>
                <button v-if="canChangeToApprovalStatus" class='k-button d-action-button' @click="changeToApprovalStatus" tabindex="3">
                    Подтвердить создание разрешения в СЭД  
                </button>
                <button class='k-button k-secondary d-action-button' @click="onCancel" tabindex="4">
                    <fa icon="times"></fa>&nbsp;Закрыть
                </button>
            </div>

        </ValidationObserver>

    </vu-modal>

</template>

<script>

//import ValidationError from '@/components/shared/validation-error.vue';
import { ValidationObserver } from 'vee-validate';
import moment from 'moment';
//import FileSet from '@/components/fileSet/file-set.vue';
import PermitResponsibleSelector from '@/components/permit/responsible/selector';
import Guid from '@/core/helpers/guid';
import PermitEditorMainPage from '@/components/permit/permit-editor-main-page';
import MpsaMasksSelector from '@/components/mask/mpsa-masks-selector';
import EsuMasksSelector from '@/components/mask/esu-masks-selector';
import CspaMasksSelector from '@/components/mask/cspa-masks-selector';
import PermitService from '@/core/services/permit-service';
import PermitTemplateService from '@/core/services/permit-template-service';
import DepartmentService from '@/core/services/department-service';
import BranchService from '@/core/services/branch-service';
import SedDocumentService from '@/core/services/sed-document-service';
import File from '@/components/file/file';
import Group from '@/components/shared/group';
import ChiefPersonSelectDialog from '@/components/person/chief-person-select-dialog';
import { mapState } from 'vuex';
import Vue from 'vue';
import { EventBus } from '@/core/event-bus';

export default {
    name: 'permit-editor',
    components: {
        ValidationObserver,
        PermitResponsibleSelector,
        PermitEditorMainPage,
        MpsaMasksSelector,
        EsuMasksSelector,
        CspaMasksSelector,
        File,
        Group,
    },
    props: {
        id: { type: Number, default: null },
        branchId: { type: Number, default: null },
        departmentId: { type: Number, default: null },
        permitTemplateId: { type: Number, default: null },
    },
    computed: {
        title() {
            return `${this.isNew ? 'Создание нового разрешения' : 'Изменение разрешения'}`;
        },

        isBaseEditable() {
            let statuses = ['Draft', 'Revision'];
            return this.isStateAnyOf(statuses);
        },

        isSedEditable() {
            let statuses = ['ReadyToApprove'];
            return this.isStateAnyOf(statuses);
        },

        showSedPage() {
            let statuses = ['ReadyToApprove', 'Approval', 'Signed'];
            return this.isStateAnyOf(statuses);
        },

        canSave() {
            return this.isBaseEditable || this.isSedEditable;
        },

        canChangeToRevisionStatus() {
            let statuses = ['ReadyToApprove', 'Approval'];
            return this.isStateAnyOf(statuses);
        },

        canChangeToReadyToApproveStatus() {
            let statuses = ['Draft', 'Revision'];
            return this.isStateAnyOf(statuses);
        },

        canChangeToApprovalStatus() {
            let statuses = ['ReadyToApprove'];
            return this.isStateAnyOf(statuses);
        },

		...mapState({
            departments: state => [{ Id: null, Name: '-= Выберите отдел =-'}, ...state.departments],
            branches: state => [{ Id: null, Name: '-= Выберите подразделение =-'}, ...state.branches],
            statuses: state => state.permitStatuses,
            equipmentTypes: state => [{ Value: null, DisplayName: '-= Выберите тип оборудования =-' }, ...state.equipmentTypes],
            workTypes: state => [{ Value: null, DisplayName: '-= Выберите вид работ =-' }, ...state.workTypes],
        }),
    },
    data() {
        return {
            isNew: true,
            filters: [],
            model: {
                id: null,
                description: null,
                fullDescription: null,
                number: null,
                status: null,
                date: null,
                branch: null,
                department: null,
                maskGroups: [],
                fileSet: null,

                to: null,
                toPosition: null,
                toName: null,
                from: null,
                fromPosition: null,
                fromName: null,
                emergencyTime: null,
                permitFile: null,
                equipmentType: null,
                workType: null,
                needNpsMask: false,
                needEsuMask: false,
                needCspaMask: false,
                timePeriods: [],
                permitObjects: [],
                responsiblePersons: [],
                isPipelinePlannedShutdown: false,

                isLinearPart: false,
                hasMna: true,
                needOutputToRepairMna: false,
                hasAvrMna: false,
                hasPna: false,
                needOutputToRepairPna: false,
                hasAvrPna: false,

                permitTemplate: null,

                sedDocumentNumber: null,
                sedDocumentDate: null,
                permitSigningDateUtc: null,

                generatedFile: null,
                generatedMainFile: null,
                generatedMpsaAttachmentFile: null,
                generatedEsuAttachmentFile: null,
                generatedCspaAttachmentFile: null,
            },
            busy: false,
            ready: false,
            needSaveValidation: false,
            needBaseValidation: false,
            needSedValidation: false,

            currentPermitTemplateId: this.permitTemplateId,

            sedDocument: null,
        }
    },
    methods: {
        load() {
            this.busy = true;
            PermitService.getById(this.id)
                .then(response => {
                    if(response.data.HasError) throw response.data.ErrorMessage;
                    const permit = response.data.Result;
                    this._setModelToView(permit);
                    this.busy = false;
                    this.ready = true;
                })
                .catch(error => {
                    this.busy = false;
                    console.log(error);
                    alert(`Ошибка при получении данных о разрешении: ${error}`);
                });
        },

        isStateAnyOf(states) {
            return this.model && this.model.status && states.indexOf(this.model.status.Name) > -1;
        },

        _setModelToView(permit) {
            this.model.id = permit.Id;
            this.model.description = permit.Description;
            this.model.fullDescription = permit.FullDescription;
            this.model.date = permit.Date == null ? null : moment.utc(permit.Date).toDate();
            this.model.number = permit.Number;
            this.model.status = permit.Status;
            this.model.branch = permit.Branch;
            this.model.department = permit.Department;
            this.model.maskGroups = permit.MaskGroups;
            this.model.fileSet = permit.FileSet;
            this.model.isPipelinePlannedShutdown = permit.IsPipelinePlannedShutdown;

            this.model.to = permit.To;
            this.model.toPosition = permit.ToPosition;
            this.model.toName = permit.ToName;
            this.model.from = permit.From;
            this.model.fromPosition = permit.FromPosition;
            this.model.fromName = permit.FromName;
            this.model.emergencyTime = permit.EmergencyTime;
            this.model.permitFile = permit.PermitFile;
            this.model.equipmentType = permit.EquipmentType;
            this.model.workType = permit.WorkType;
            this.model.needNpsMask = permit.NeedNpsMask;
            this.model.needEsuMask = permit.NeedEsuMask;
            this.model.needCspaMask = permit.NeedCspaMask;
            this.model.timePeriods = permit.TimePeriods.map(p => Object.assign(p, { Guid: Guid.generate() }));
            this.model.permitObjects = permit.PermitObjects.map(p => Object.assign(p, { Guid: Guid.generate() }));
            this.model.responsiblePersons = permit.ResponsiblePersons.map(p => Object.assign(p, { Guid: Guid.generate() }));
            this.model.isLinearPart = permit.IsLinearPart;
            this.model.hasMna = permit.HasMna;
            this.model.needOutputToRepairMna = permit.NeedOutputToRepairMna;
            this.model.hasAvrMna = permit.HasAvrMna;
            this.model.hasPna = permit.HasPna;
            this.model.needOutputToRepairPna = permit.NeedOutputToRepairPna;
            this.model.hasAvrPna = permit.HasAvrPna;

            this.model.permitTemplate = permit.PermitTemplate;

            this.model.sedDocumentNumber = permit.SedDocumentNumber;
            this.model.sedDocumentDate = permit.SedDocumentDate;
            this.model.permitSigningDateUtc = permit.PermitSigningDateUtc;

            this.model.generatedFile = permit.GeneratedFile;
            this.model.generatedMainFile = permit.GeneratedMainFile;
            this.model.generatedMpsaAttachmentFile = permit.GeneratedMpsaAttachmentFile;
            this.model.generatedEsuAttachmentFile = permit.GeneratedEsuAttachmentFile;
            this.model.generatedCspaAttachmentFile = permit.GeneratedCspaAttachmentFile;





            //для тестирования создания документа в СЭД
            this.sedDocument = permit.SedDocument;
        },

        loadPermitTemplateAndApply() {
            if(this.currentPermitTemplateId == null) return;

            this.busy = true;
            PermitTemplateService.getById(this.currentPermitTemplateId)
                .then(response => {
                    if(response.HasError) throw response.ErrorMessage;
                    const permitTemplate = response.Result;

                    this.model.permitTemplate = permitTemplate;

                    this.model.description = permitTemplate.Description;
                    this.model.fullDescription = permitTemplate.FullDescription;
                    this.model.equipmentType = permitTemplate.EquipmentType;
                    this.model.workType = permitTemplate.WorkType;
                    this.model.needNpsMask = permitTemplate.NeedNpsMask;
                    this.model.needEsuMask = permitTemplate.NeedEsuMask;
                    this.model.needCspaMask = permitTemplate.NeedCspaMask;
                    this.model.maskGroups = permitTemplate.MaskGroups;
                    this.model.permitObjects = permitTemplate.PermitTemplateObjects.map(p => Object.assign(p, { Id: null, Guid: Guid.generate() }));

                    this.model.isLinearPart = permitTemplate.IsLinearPart;
                    this.model.hasMna = permitTemplate.HasMna;
                    this.model.needOutputToRepairMna = permitTemplate.NeedOutputToRepairMna;
                    this.model.hasAvrMna = permitTemplate.HasAvrMna;
                    this.model.hasPna = permitTemplate.HasPna;
                    this.model.needOutputToRepairPna = permitTemplate.NeedOutputToRepairPna;
                    this.model.hasAvrPna = permitTemplate.HasAvrPna;

                    this.model.branch = permitTemplate.PermitTemplateCatalog.Branch;
                    this.model.department = permitTemplate.PermitTemplateCatalog.Department;

                    this.busy = false;
                    this.ready = true;
                })
                .catch(error => {
                    this.busy = false;
                    console.log(error);
                    alert(`Ошибка при получении данных о разрешении: ${error}`);
                });
        },

        _updateObject() {
            const model = this._getModelFromView();
            return PermitService.update(model)
                .then(response => {
                    if(response.data.HasError) throw response.data.ErrorMessage;
                    return Promise.resolve(response.data.Result);
                })
                .catch(error => {
                    console.log(error);
                    alert(`Ошибка при ${this.isNew ? 'обновлении' : 'создании' } разрешения: ${error}`);
                });
        },

        _getModelFromView() {
            return {
                Id: this.model.id,
                Description: this.model.description,
                FullDescription: this.model.fullDescription,
                Date: this.getDate(this.model.date),
                Number: this.model.number,
                Status: this.model.status,
                Branch: this.model.branch,
                Department: this.model.department,
                MaskGroups: this.model.maskGroups,
                FileSet: this.model.fileSet,
                IsPipelinePlannedShutdown: this.model.isPipelinePlannedShutdown,

                To: this.model.to,
                ToPosition: this.model.toPosition,
                ToName: this.model.toName,
                From: this.model.from,
                FromPosition: this.model.fromPosition,
                FromName: this.model.fromName,
                EmergencyTime: this.model.emergencyTime,
                PermitFile: this.model.permitFile,
                EquipmentType: this.model.equipmentType,
                WorkType: this.model.workType,
                NeedNpsMask: this.model.needNpsMask,
                NeedEsuMask: this.model.needEsuMask,
                NeedCspaMask: this.model.needCspaMask,
                //у времени выполнения убираем часовой пояс
                TimePeriods: this.model.timePeriods.map(p => {
                    return {
                        Id: p.Id,
                        StartTime: moment(p.StartTime).format('YYYY-MM-DDTHH:mm'),
                        EndTime: moment(p.EndTime).format('YYYY-MM-DDTHH:mm'),
                    };
                }),
                PermitObjects: this.model.permitObjects,
                ResponsiblePersons: this.model.responsiblePersons,

                IsLinearPart: this.model.isLinearPart,
                HasMna: this.model.isLinearPart ? null : this.model.hasMna,
                NeedOutputToRepairMna: (!this.model.isLinearPart && this.model.hasMna) ? this.model.needOutputToRepairMna : null,
                HasAvrMna: (!this.model.isLinearPart && this.model.hasMna && this.model.needOutputToRepairMna) ? this.model.hasAvrMna : null,
                HasPna: this.model.isLinearPart ? null : this.model.hasPna,
                NeedOutputToRepairPna: (!this.model.isLinearPart && this.model.hasPna) ? this.model.needOutputToRepairPna : null,
                HasAvrPna: (!this.model.isLinearPart && this.model.hasPna && this.model.needOutputToRepairPna) ? this.model.hasAvrPna : null,

                PermitTemplate: this.model.permitTemplate,

                SedDocumentNumber: this.model.sedDocumentNumber,
                SedDocumentDate: this.getDate(this.model.sedDocumentDate),
                PermitSigningDateUtc: this.model.permitSigningDateUtc,

                //на самом деле эти файлы серверу не нужны - они только для чтения
                GeneratedFile: this.model.generatedFile,
                GeneratedMainFile: this.model.generatedMainFile,
                GeneratedMpsaAttachmentFile: this.model.generatedMpsaAttachmentFile,
                GeneratedEsuAttachmentFile: this.model.generatedEsuAttachmentFile,
                GeneratedCspaAttachmentFile: this.model.generatedCspaAttachmentFile,
            };
        },

        getDate(value) {
            if(value == null) return null;
            if(value instanceof Date) return value;
            if(typeof value == 'string') {
                var re1 = /\d{2}\.\d{2}\.\d{4}/;
                var re2 = /\d{4}\.\d{2}\.\d{2}/;
                if(re1.test(value)) return moment.utc(value, 'DD.MM.YYYY').toDate();
                if(re2.test(value)) return moment.utc(value, 'YYYY.MM.DD').toDate();
            }
            return null; 
        },

        onSave(needClose) {
            this.needSaveValidation = true;
            this.needBaseValidation = false;
            this.needSedValidation = false;
            this.$refs.mainTabObserver.validate();
            this.$refs.observer.reset();
            Vue.nextTick()
                .then(() => {
            this.$refs.mainTabObserver.validate();
                    return this.$refs.observer.validate();        
                })                
                .then(isValid => {
                    if(!isValid) {
                        alert('Необходимо правильно заполнить все требуемые для формирования разрешения поля.');
                        throw '';
                    }
                    this.busy = true;
                    return this._updateObject();
                })
                .then(permit => {
                    this.busy = false;
                    if(needClose) this.$modals.close(permit);
                    else {
                        this.needSaveValidation = false;
                        this.isNew = false;
                        this._setModelToView(permit);
                    }
                });
        },

        onCancel() {
            this.$modals.dismiss();
        },

        branchChanged() {
            this.model.maskGroups = [];
        },

        risePermitUpload() {
            this.$refs.fileSetView.raiseUpload();
        },

        onFileReplace({ fileId, newFile, completed }) {
            if(this.model.fileSet == null) {
                this.model.fileSet = { Files: [] };
            }

            let dotIndex = newFile.name.lastIndexOf('.');
            let name = newFile.name.substring(0, dotIndex - 1);
            let extension = newFile.name.substring(dotIndex, newFile.name.length - 1);

            let file = this.model.fileSet.Files.find(p => p.Id == fileId);
            file.Id = newFile.id;
            file.Name = name;
            file.Extension = extension;
            file.Size = newFile.size;
            file.Content = newFile.size.content;

            completed();
        },

        onFileRemove(fileId) {
            if(this.model.fileSet != null) {
                let index = this.model.fileSet.Files.findIndex(p => p.Id == fileId);
                this.model.fileSet.Files.splice(index, 1);
            }
        },

        onFileUpload({ file, completed }) {
            if(this.model.fileSet == null) {
                this.model.fileSet = { Files: [] };
            }
            let dotIndex = file.name.lastIndexOf('.');
            let name = file.name.substring(0, dotIndex - 1);
            let extension = file.name.substring(dotIndex, file.name.length - 1);

            this.model.fileSet.Files.push({
                Id: file.id,
                Name: name,
                Extension: extension,
                Size: file.size,
                Content: file.content,
            });
            completed();
        },

        permitTemplateChanged(permitTemplateId) {
            this.currentPermitTemplateId = permitTemplateId;
            this.loadPermitTemplateAndApply();
        },

        changeStatus(status) {
            this.busy = true;
            let model = this._getModelFromView();
            return PermitService.changeStatus(model, status)
                .then(response => {
                    this.busy = false;
                    //{
                    //  Permit,
                    //  HasErrors,
                    //  Errors, [{ Field, Error }]
                    //}
                    if(response.data.Result.HasErrors) {
                        if(response.data.Result.Errors.length > 0) {
                            throw response.data.Result.Errors.map(p => p.Error).join('\n');
                        } else {
                            throw 'Ошибка со стороны сервера';
                        }
                    } else {
                        this._setModelToView(response.data.Result.Permit);
                        return Promise.resolve();
                    }
                })
                .catch(error => {
                    this.busy = false;
                    console.log(error);
                    alert(`Ошибка при изменении статуса разрешения. ${error}`);
                });
        },

        changeToRevisionStatus() {
            this.changeStatus('Revision');
            this.needBaseValidation = false;
            this.needSedValidation = false;
        },

        changeToReadyToApproveStatus() {
            this.needBaseValidation = true;
            Vue.nextTick()
                .then(() => {
                    return this.$refs.observer.validate();
                })
                .then(isValid => {
                    if(!isValid) {
                        throw 'Необходимо правильно заполнить все требуемые для формирования разрешения поля.';
                    }
                    return this.changeStatus('ReadyToApprove');
                }).then(() => {
                    this.needBaseValidation = false;
                    let wait = () => {
                        if(false == this.$refs.sedTab.activate()) {
                            setTimeout(wait, 100);
                        }
                    };
                    wait();
                })
                .catch(error => {
                    console.log(error);
                    alert(error);
                });
        },    

        changeToApprovalStatus() {
            this.needSedValidation = true;
            Vue.nextTick()
                .then(() => {
                    return this.$refs.observer.validate();
                })
                .then(isValid => {
                    if(!isValid) {
                        throw 'Необходимо правильно заполнить все требуемые для формирования разрешения поля.';
                    }
                    this.changeStatus('Approval');
                    this.needSedValidation = false;
                })
                .catch(error => {
                    console.log(error);
                    alert(error);
                });
        },

        permitResponsibleSelectorValidate(data) {
            var result = true;
            result &= data.some(p => p.ResponsiblePersonType.Value == 0);
            result &= data.some(p => p.ResponsiblePersonType.Value == 1);
            //ответственные за маскирования ставятся только для МПСА
            if(this.model.needNpsMask) {
                result &= data.some(p => p.ResponsiblePersonType.Value == 2);
            }
            if(this.model.isLinearPart) {
                result &= data.some(p => p.ResponsiblePersonType.Value == 3);
            }
            return result;
        },

        formatDate(date) {
            if(date == null) return null;
            return moment(date).format('DD.MM.YYYY');
        },

        formatUtcDate(date) {
            if(date == null) return null;
            return moment(date).format('DD.MM.YYYY HH:mm:ss');
        },

        onToSelect() {
            this.$modals.open({
                component: ChiefPersonSelectDialog,
                props: {
                },
                onClose: person => {
                    this.model.to = person.To;
                    this.model.toPosition = person.Position;
                    this.model.toName = person.Name;
                },
            });
        },

        onFromSelect() {
            this.$modals.open({
                component: ChiefPersonSelectDialog,
                props: {
                },
                onClose: person => {
                    this.model.from = person.From;
                    this.model.fromPosition = person.Position;
                    this.model.fromName = person.Name;
                },
            });
        },








        //для тестирования работы с СЭД
        handleSedDocumentCreate() {
            SedDocumentService.createDocument(this.model.id);
        },

        handleSedDocumentUpdate() {
            SedDocumentService.updateDocument(this.model.id);
        },

        handleSedDocumentChanged({ permitId, sedDocument }) {
            if(permitId != this.model.id) return;
            this.sedDocument = sedDocument;
        }


    },
    created() {
        this.isNew = this.id == null;
        if(this.id != null) {
            this.busy = true;
            this.load();
        } else {
            //создается новое разрешение, возможно передан идентификатор шаблона, нужно его скачать и заполнить модель данными из шаблона
            if(this.permitTemplateId != null) {
                this.currentPermitTemplateId = this.permitTemplateId;
                this.loadPermitTemplateAndApply();
            } else {
                if(this.branchId != null) this.model.branch = this.branches.find(p => p.Id == this.branchId);
                if(this.departmentId != null) this.model.department = this.departments.find(p => p.Id == this.departmentId);
                this.ready = true;
            }

            this.model.date = moment.utc().hour(0).minute(0).second(0).millisecond(0).toDate();
            this.model.status = this.statuses[0];
        }

        EventBus.$on('sedDocumentChanged', this.handleSedDocumentChanged);
    },

    beforeDestroy() {
        EventBus.$off('sedDocumentChanged', this.handleSedDocumentChanged);
    },
}

</script>

<style scoped lang="scss">

.field-validation-error {
    margin-top: 8px;
}

.files {
    margin: 0 8px 8px 8px;
    height: 120px;
    display: flex;
    flex-flow: column nowrap;
}

.file-actions {
    flex: 0 0 auto;
}

.file-set {
    margin-top: 8px;
    flex: 1 1 100%;
    min-height: 0;
    overflow-y: auto;
}

.my-label {
    text-align: right;
}

.tab-header {
    align-items: center;
    svg {
        margin-right: 8px;
    }
}

.tab-header-error {
    color: red;
}

</style>

<style lang="scss">

.permit-editor-masks {
    height: 100% !important;
    width: 100% !important;
    font-size: 0.8rem !important;
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