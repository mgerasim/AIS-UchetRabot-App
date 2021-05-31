<template>

    <vu-modal   :isScroll="false" 
                :center="true" 
                :escapable="true" 
                :dismissable="false"
                size="xl" 
                className="d-modal"
                headerClassName="d-header"
                bodyClassName="d-body"
                class="no-select"
                style="height: 80%; width: 60%; display: flex; flex-flow: column nowrap;">

        <template v-slot:header>
            <div class="h-flex">
                <span style="flex: 1 1 auto; margin-top: auto; margin-bottom: auto;">{{ title }}</span>
                <div class="d-icon" @click="onChange">
                    <fa icon="edit" size="lg" />
                </div>
                <div class="d-close-icon" @click="onCancel">
                    <fa icon="times" size="lg" />
                </div>
            </div>
        </template>

        <div v-if="busy" class="overlay content-center" name="jobBusyIndicator">
            <busy-indicator></busy-indicator>
        </div>

        <div class="full-size v-flex">
            <div class="d-container" style="flex: 1 1 100%; min-height: 0;">

                <b-tabs content-class="mt-3 my-tab-content v-flex" class="full-size v-flex">
        
                    <b-tab title="Информация" active class="my-tab">

                        <div class="row form-group">
                            <span class="label col-md-3">Ответственная служба:</span>
                            <span class="info col-md-3">{{ departmentName }}</span>

                            <span class="label col-md-3">Участок производства работ:</span>
                            <span class="info col-md-3">{{ branchName }}</span>
                        </div>

                        <div class="row form-group">
                            <span class="label col-md-3">Работа на линейной части:</span>
                            <span class="info col-md-3">{{ isLinearPartJob ? 'Да' : 'Нет' }}</span>

                            <span class="label col-md-3">Включен в недельный план:</span>
                            <span class="info col-md-3">{{ isWeekPlanIncluded ? 'Да' : 'Нет' }}</span>
                        </div>

                        <div v-if="version != 0" class="row form-group">
                            <span class="label col-md-3">Необходимо маскирование:</span>
                            <span class="info col-md-3">{{ maskInfo }}</span>

                            <span class="label col-md-3">Необходимость вывода МНА в ремонт:</span>
                            <span class="info col-md-3">{{ needOutputToRepair ? 'Да' : 'Нет' }}</span>
                        </div>

                        <div v-if="version != 0" class="row form-group">
                            <span class="label col-md-3">Тип оборудования:</span>
                            <span class="info col-md-3">{{ equipmentType != null ? equipmentType.DisplayName : '' }}</span>

                            <span class="label col-md-3">Аварийная готовность:</span>
                            <span class="info col-md-3">{{ emergencyTime == null ? 'Не задана' : (emergencyTime + ' мин') }}</span>
                        </div>

                        <div v-if="version != 0" class="row form-group">
                            <hr class="col-md-11" />
                        </div>

                        <div class="row form-group">
                            <span class="label col-md-3">Описание работ:</span>
                            <span class="info col-md-9">{{ description != null ? description : '' }}</span>
                        </div>

                        <div class="row form-group">
                            <span class="label col-md-3">Период выполнения работ:</span>
                            <ul class="col-md-9 simple-list">
                                <li v-for="(timePeriodString, index) in timePeriodStrings" :key="'tp_' + index">
                                    <span>{{ timePeriodString }}</span>
                                </li>
                            </ul>
                        </div>

                        <div class="row form-group">
                            <span class="label col-md-3">Объект производства работ:</span>
                            <ul class="col-md-9 simple-list">
                                <li v-for="(objectString, index) in objectStrings" :key="'obj_' + index">
                                    <span>{{ objectString }}</span>
                                </li>
                            </ul>
                        </div>

                        <div v-if="version != 0" class="row form-group">
                            <span class="label col-md-3">Разрешение:</span>
                            <file   v-if="permitFile != null" 
                                    :file="permitFile"
                                    :readonly="true"
                                    :title="permitInfo"
                                    class="info col-md-9"></file>

                        </div>

                        <div v-if="version != 0" class="row form-group">
                            <group title="Ответственные">
                                <ul class="col-md-9 simple-list">
                                    <li v-for="(responsible, index) in responsiblePersonStrings" :key="'rpt_' + index">
                                        <span>{{ responsible.Type.DisplayName }}</span>
                                        <ul class="col-md-11 offset-md-1 simple-list">
                                            <li v-for="(item, index2) in responsible.Items" :key="'rpi_' + index2">
                                                <span>{{ item }}</span>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </group>
                        </div>

                        <dl class="dl-horizontal">


                            <dt> </dt>
                            <dd>{{  }}</dd>


                            <dt>JobStatus: </dt>
                            <dd>{{ jobStatus != null ? jobStatus.DisplayName : '' }}</dd>
                            <dt>TimeState: </dt>
                            <dd>{{ timeState != null ? timeState.Name : '' }}</dd>

                            <!-- <dt>Создано: </dt>
                            <dd>{{ createUser != null ? createUser.DisplayName : '' }}</dd>
                            <dt>Дата создания (МСК): </dt>
                            <dd>{{ toDateTimeString(created, false) }}</dd> -->


                            <dt>Статус: </dt>
                            <dd :class="[statusClass]">{{ jobStatusDisplayName }}</dd>

                            <dt v-if="attachment">Вложение: </dt>
                            <dd v-if="attachment">
                                <attachment :url="`../Job/ShowAttachment/${attachment.Guid}`" :name="attachment.Name + (attachment.Extension ? attachment.Extension : '')"></attachment>
                            </dd> 


                            <!-- <dt>Уровень утверждения: </dt>
                            <dd>{{ approvalBranchName }}</dd> -->
                           
                        </dl>
                    </b-tab>

                    <!-- <b-tab title="События" active class="my-tab">
                        <table>
                            <tr v-for="logItem in logs" :key="'log_' + logItem.Id">
                                <td><span>{{ toDateTimeString(logItem.Date, false) }}</span></td>
                                <td><span>{{ logItem.User !== null ? logItem.User.DisplayName : '' }}</span></td>
                                <td><span>{{ logItem.AdditionalDescription }}</span></td>
                            </tr>
                        </table>
                    </b-tab> -->

                    <b-tab v-if="version != 0" title="Маскирования" active class="my-tab">
                        <mask-with-state-list
                            v-if="true"
                            system="NPS" 
                            :items="maskStates"
                            style="flex: 1; min-height: 0;">
                        </mask-with-state-list>
                    </b-tab>

                </b-tabs>

            </div>

            <div class="d-actions" style="flex: 0 0 auto;">
                <button class='k-button k-secondary d-action-button' @click="onCancel" tabindex="4">Закрыть</button>
            </div>
        </div>

        <job-editor ref="jobEditor"></job-editor>

    </vu-modal>

</template>

<script>

import Vue from 'vue';
import axios from 'axios';
import moment from 'moment';
import Attachment from '@/components/shared/attachment.vue';
import JobEditor from '@/components/job/job-editor.vue';
import JobService from '@/core/services/job-service';
import MaskStateService from '@/core/services/mask-state-service';
import MaskWithStateList from '@/components/mask/mask-with-state-list';
import { EventBus } from '@/core/event-bus';

export default {
    name: 'job-details',
    components: {
        Attachment,
        JobEditor,
        MaskWithStateList,
    },
    props: {
        id: { type: Number, required: true },
        version: { type: Number, required: true },
    },
    computed: {
        permitInfo() {
            if(this.permitNumber == null || this.permitDate == null) return '';
            let result = `№ ${this.permitNumber} от ${this.toDateTimeString(this.permitDate, true)}`;
            if(this.permitSigningDate == null) {
                result += ', не согласовано';
            } else {
                result += `, согласовано ${this.toDateTimeString(this.permitSigningDate, false)}`;
            }
            return result;
        },

        maskInfo() {
            if(this.needNpsMask == false && this.needEsuMask == false && this.needCspaMask == false) return 'Нет';
            let result = '';
            if(this.needNpsMask) {
                if(result != '') result += ', ';
                result += 'МПСА + АСПТ';
            } 
            if(this.needEsuMask) {
                if(result != '') result += ', ';
                result += 'ЕСУ';
            } 
            if(this.needCspaMask) {
                if(result != '') result += ', ';
                result += 'ЦСПА';
            }

            return result; 
        },
    },
    data() {
        return {
            busy: false,
            title: `Просмотр информации о работе`,
            departmentName: '',
            branchName: '',
            created: null,
            timePeriods: [],
            timePeriodStrings: [],
            objects: [],
            objectStrings: [],
            permitNumber: null,
            permitDate: null,
            permitSigningDate: null,
            jobStatus: null,
            timeState: null,
            createUser: null,
            isWeekPlanIncluded: false,
            isLinearPartJob: false,
            attachment: null,
            permitFile: null,
            responsiblePersons: [],
            responsiblePersonStrings: [],
            equipmentType: null,
            needNpsMask: null,
            needEsuMask: null,
            needCspaMask: null,
            needOutputToRepair: null,
            emergencyTime: null,
            maskStates: [],


            description: '',
            approvalBranchName: '',
            approvalRegNumber: '',
            jobBranchName: '',
            jobObjectString: '',
            startDate: null,
            endDate: null,
            approvalRegDate: null,
            jobStatusDisplayName: '',
            statusClass: '',
            startTime: null,
            endTime: null,
            jobId: 0,
            logs: [],
        }
    },
    methods: {
        loadJobItem(id) {
            axios.all([
                axios.post(`../api/job/getById`, { id: id }),
                axios.post(`../api/log/getAllByJob`, { jobId: id }),
                axios.post(`../api/account/getCurrentUser`, null, {
                    withCredentials: true
                }),
            ])
            .then(axios.spread((jobResult, logResult, userResult) => {

                if(jobResult.data.HasError) throw jobResult.data.ErrorMessage;
                if(logResult.data.HasError) throw logResult.data.ErrorMessage;
                if(userResult.data.HasError) throw userResult.data.ErrorMessage;

                const jobData = jobResult.data.Result;
                const logData = logResult.data.Result;
                const userData = userResult.data.Result;

                this.departmentName = jobData.Department.Name;
                this.description = jobData.Description;
                this.approvalBranchName = jobData.ApprovalBranch.Name;
                this.approvalRegNumber = jobData.ApprovalRegNumber;
                this.isWeekPlanIncluded = jobData.IsWeekPlanIncluded;
                this.jobBranchName = jobData.JobBranch.Name;
                this.jobObjectString = jobData.JobObjectString;
                this.isLinearPartJob = jobData.IsLinearPartJob;
                this.startDate = jobData.StartDate;
                this.endDate = jobData.EndDate;
                this.approvalRegDate = jobData.ApprovalRegDate;
                this.created = jobData.Created;
                this.jobStatusDisplayName = jobData.JobStatus.DisplayName;
                this.statusClass = `text-${jobData.JobStatus.Name.toLowerCase()}`;
                this.startTime = jobData.StartTime;
                this.endTime = jobData.EndTime;
                this.attachments = jobData.Attachments;
                this.jobId = jobData.Id;
                this.logs = logData;

                if (userData.Role.Name == 'ReadOnly') {
                    this.actions = [
                        //'Pin',
                        //'Minimize',
                        //'Maximize',
                        'Close'
                    ]
                } else {
                    this.actions = [
                        //'Pin',
                        //'Minimize',
                        //'Maximize',
                        'Edit',
                        'Close'
                    ]
                }

                if (userData.Role.Name !== 'ReadOnly') {
                    window.wrapper.find(".k-i-edit")
                        .prop('title', 'Изменить')
                        .on('click', (e) => {
                            window.close();
                            this.$refs.jobEditor.openChange(this.jobId);
                            e.preventDefault();
                        });
                }


            }));
        },

        toDateTimeString(dateTime, skipTime) {
            if (!dateTime) return '';
            return skipTime ? moment(dateTime).format('DD.MM.YYYY') : moment(dateTime).format('DD.MM.YYYY HH.mm');
        },

        toTimeRangeString(startTime, endTime) {
            if(startTime == null || endTime == null) return '';
            return `${moment(startTime).format('HH:mm')} - ${moment(endTime).format('HH:mm')}`;
        },

        onChange() {

        },

        onCancel() {
            this.$modals.dismiss();
        },

        loadData() {
            this.busy = true;

            Promise.all([
                JobService.getJobByIdAndVersion(this.id, this.version),
                MaskStateService.getAllByJobIdAndVersion(this.id, this.version),
            ])
            .then(responses => {
                let jobResponse = responses[0];
                let maskStatesResponse = responses[1];

                if(jobResponse.data.HasError) throw jobResponse.data.ErrorMessage; 
                if(maskStatesResponse.data.HasError) throw maskStatesResponse.data.ErrorMessage; 

                const jobData = jobResponse.data.Result;
                this.departmentName = jobData.Department.Name;
                this.branchName = jobData.Branch.Name;
                this.created = jobData.Created;
                this.timePeriods = jobData.TimePeriods;
                this.timePeriodStrings = jobData.TimePeriodStrings;
                this.description = jobData.Description;
                this.objects = jobData.Objects;
                this.objectStrings = jobData.ObjectStrings;
                this.permitNumber = jobData.PermitNumber;
                this.permitDate = jobData.PermitDate;
                this.permitSigningDate = jobData.PermitSigningDateUtc;
                this.isWeekPlanIncluded = jobData.IsWeekPlanIncluded;
                this.jobStatus = jobData.JobStatus;
                this.timeState = jobData.TimeState;
                this.createUser = jobData.CreateUser;
                this.isLinearPartJob = jobData.IsLinearPartJob;
                this.attachment = jobData.Attachment;
                this.permitFile = jobData.PermitFile;
                this.responsiblePersons = jobData.ResponsiblePersons;
                this.responsiblePersonStrings = jobData.ResponsiblePersonStrings;
                this.equipmentType = jobData.EquipmentType;
                this.needNpsMask = jobData.NeedNpsMask;
                this.needEsuMask = jobData.NeedEsuMask;
                this.needCspaMask = jobData.NeedCspaMask;
                this.needOutputToRepair = jobData.NeedOutputToRepair;
                this.emergencyTime = jobData.EmergencyTime;

                this.maskStates = maskStatesResponse.data.Result;

                // this.approvalBranchName = jobData.ApprovalBranch.Name;
                // this.approvalRegNumber = jobData.ApprovalRegNumber;
                // this.jobBranchName = jobData.JobBranch.Name;
                // this.jobObjectString = jobData.JobObjectString;
                // this.startDate = jobData.StartDate;
                // this.endDate = jobData.EndDate;
                // this.approvalRegDate = jobData.ApprovalRegDate;
                // this.jobStatusDisplayName = jobData.JobStatus.DisplayName;
                // this.statusClass = `text-${jobData.JobStatus.Name.toLowerCase()}`;
                // this.startTime = jobData.StartTime;
                // this.endTime = jobData.EndTime;
                // this.jobId = jobData.Id;


                this.busy = false;
            })
            .catch(error => {
                this.busy = false;
                console.log(error);
                alert();
            });
        },

        serverMaskStatesChanged({ maskStates }) {
            // MaskDescriptionId 
            // EnumModel<CurrentMaskState> State
            // DateTime? DateUtc
            // bool LastOpcGood
            // DateTime? LastOpcDateUtc
            // DateTime? LastGoodOpcDateUtc

            let jobStates = this.maskStates.flatMap(p => p.Items);
            for(let serverMaskState of maskStates) {
                let jobState = jobStates.find(p => p.Mask.Id == serverMaskState.MaskDescriptionId);
                if(jobState == null) continue;
                jobState.Payload.State = serverMaskState;
            }    
        },
    },

    created() {
        this.loadData();
        EventBus.$on('serverMaskStatesChanged', this.serverMaskStatesChanged);
    },

    beforeDestroy() {
        EventBus.$off('serverMaskStatesChanged', this.serverMaskStatesChanged);
    },


}

</script>

<style scoped>

.label {
    text-align: right;
}

</style>