<template>

<div class="no-select">
    <kendo-window ref="dialog"
                    :animation="false"
                    :width="'900px'"
                    :title="`${isNew ? 'Создание новой работы' : 'Изменение работы ' + model.id}`"
                    :visible="false"
                    :modal="true"
                    :draggable="true"
                    :actions="actions">
        <div class="details-container">

            <div class="row form-group">
                <label for="description" class="control-label col-md-4">Краткое описание выполняемых работ</label>
                <div class="col-md-6">
                    <validation-provider rules="required" v-slot="{ errors }">
                        <textarea name="description"
                                rows="5" cols="1"
                                v-model="model.description"
                                data-vv-as="ОПИСАНИЕ"
                                :class="{'form-control': true, 'is-danger': errors.length > 0 }"></textarea>
                        <validation-error class="field-validation-error" v-show="errors.length > 0">
                            {{ errors[0] }}
                        </validation-error>
                    </validation-provider>
                </div>
            </div>

            <div class="row form-group">
                <label class="control-label col-md-4">Вложения</label>
                <div class="col-md-6">
                    <file-uploader v-model="model.files"></file-uploader>
                </div>
            </div>

            <div class="row form-group">
                <label class="control-label col-md-4">Дата производства работ</label>
                <div class="col-md-6">
                    <kendo-datepicker v-model="model.startDate"></kendo-datepicker>
                    <kendo-datepicker v-model="model.endDate"></kendo-datepicker>
                    <validation-error class="field-validation-error" v-if="datesValidation.error">
                        {{ datesValidation.message }}
                    </validation-error>
                </div>
            </div>

            <div class="row form-group">
                <label class="control-label col-md-4">Время выполнения работ</label>
                <div class="col-md-6">
                    <kendo-timepicker v-model="model.startTime"></kendo-timepicker>
                    <kendo-timepicker v-model="model.endTime"></kendo-timepicker>
                    <validation-error class="field-validation-error" v-if="timesValidation.error">
                        {{ timesValidation.message }}
                    </validation-error>
                </div>
            </div>

            <div class="row form-group">
                <label class="control-label col-md-4" for="department">Ответственная служба</label>
                <div class="col-md-6">
                    <validation-provider rules="required" v-slot="{ errors }">
                        <kendo-dropdownlist ref="department"
                                            name="department"
                                            :data-source="departments"
                                            data-text-field="Name"
                                            data-value-field="Id"
                                            options-label="Выберите службу..."
                                            :value="model.department != null ? model.department.Id : null"
                                            @select="model.department = $event.dataItem">
                        </kendo-dropdownlist>
                        <validation-error class="field-validation-error" v-show="errors.length > 0">
                            {{ errors[0] }}
                        </validation-error>
                    </validation-provider>
                </div>
            </div>

            <div class="row form-group">
                <label class="control-label col-md-4" for="branch">Участок производства работ</label>
                <div class="col-md-6">
                    <validation-provider rules="required" v-slot="{ errors }">
                        <kendo-dropdownlist ref="branch"
                                            name="branch"
                                            :data-source="branches"
                                            data-text-field="Name"
                                            data-value-field="Id"
                                            options-label="Выберите участок..."
                                            :value="model.branch != null ? model.branch.Id : null"
                                            @select="model.branch = $event.dataItem"
                                            @change="onBranchChange">
                        </kendo-dropdownlist>

                        <!-- <vue-selector :data-source="{url: '../api/branch/getAll', method: 'POST', params: {}}"
                                    v-model="model.branch"
                                    name="branch"
                                    data-vv-as="УЧАСТОК"
                                    option-label=""
                                    display-field="Name"
                                    @change="onBranchChange($event)"
                                    :class="{ 'is-danger': errors.length > 0 }"></vue-selector> -->
                        <validation-error class="field-validation-error" v-show="errors.length > 0">
                            {{ errors[0] }}
                        </validation-error>
                    </validation-provider>
                </div>
            </div>

            <div class="row form-group">
                <label class="control-label col-md-4">Объект производства работ</label>
                <div id="objectsHolder" class="col-md-6">
                    <div v-for="(object, index) in model.objects" :key="'object_' + index">

                        <kendo-dropdownlist ref="object"
                                            name="object"
                                            :data-source="objects"
                                            data-text-field="Name"
                                            data-value-field="Id"
                                            options-label="ЛЧ МН"
                                            :value="object != null ? object.Id : null"
                                            @select="model.objects[index] = $event.dataItem"
                                            @change="onObjectChange">
                        </kendo-dropdownlist>

                        <!-- <vue-selector :data-source="{url: '../api/object/getAllByBranch', method: 'POST', params: { branchId: model.branch == null ? null : model.branch.Id }}"
                                        option-label="ЛЧ МН"
                                        display-field="Name"
                                        v-model="object.object"
                                        style="float: left;"
                                        @change="onObjectChange($event, index)"></vue-selector> -->

                        <kendo-numerictextbox ref="objectKm"
                                                v-model.number="object.km"
                                                :decimals="3"
                                                :format="'#.000 км'"
                                                :min="0"
                                                :round="false"
                                                :spinners="true"
                                                style="float: left;"
                                                name="object.km"></kendo-numerictextbox>
                        <button v-if="isNew && model.objects.length > 0" class="k-button text-center remove-object-button" style="color: red; width: 10px; float: left;">-</button>
                        <validation-provider v-slot="{ errors }">
                            <span v-show="errors.length > 0">{{ errors[0] }}</span>
                        </validation-provider>
                    </div>
                    <button v-if="isNew" class="k-button text-center add-object-button" style="color: green; width: 10px; float: left;" @click="onAddObjectClick">+</button>
                </div>
            </div>

            <div class="row form-group">
                <label class="control-label col-md-4" fot="approval">Уровень утверждения разрешения</label>
                <div class="col-md-6">
                    <validation-provider rules="required" v-slot="{ errors }">
                        <kendo-dropdownlist ref="approval"
                                            name="approval"
                                            :data-source="approvalBranches"
                                            data-text-field="Name"
                                            data-value-field="Id"
                                            options-label="Выберите уровень..."
                                            :value="model.approvalBranch != null ? model.approvalBranch.Id : null"
                                            @select="model.approvalBranch = $event.dataItem">
                        </kendo-dropdownlist>

                        <!-- <vue-selector :data-source="{url: '../api/branch/getAllApproval', method: 'POST', params: {}}"
                                    v-model="model.approvalBranch"
                                    name="approvalBranch"
                                    option-label="Выберите уровень..."
                                    display-field="Name"
                                    :class="{ 'is-danger': errors.length > 0 }"></vue-selector> -->
                        <validation-error class="field-validation-error" v-show="errors.length > 0">
                            {{ errors[0] }}
                        </validation-error>
                    </validation-provider>
                </div>
            </div>

            <div class="row form-group">
                <label class="control-label col-md-4">Рег. номер разрешения</label>
                <div class="col-md-6">
                    <input name="approvalRegNumber" v-model="model.approvalRegNumber" class="k-textbox" />
                </div>
            </div>

            <div class="row form-group">
                <label class="control-label col-md-4">Дата утверждения разрешения</label>
                <div class="col-md-6">
                    <kendo-datepicker v-model="model.approvalRegDate"></kendo-datepicker>
                </div>
            </div>

            <div class="row form-group">
                <label class="control-label col-md-4" for="toPlan">В плане на неделю</label>
                <div class="col-md-6">
                    <kendo-dropdownlist ref="toPlan"
                                        name="toPlan"
                                        :data-source="yesNoSource"
                                        data-text-field="Name"
                                        data-value-field="Id"
                                        :value="model.isWeekPlanIncluded != null ? model.isWeekPlanIncluded : null"
                                        @select="model.isWeekPlanIncluded = $event.dataItem.Id">
                    </kendo-dropdownlist>
                </div>
            </div>
        </div>
        <div class="actions-container">
            <validation-provider v-slot="{ errors }">
                <button id="actionJobButton" class='k-button k-my-button' :disabled="errors.length > 0 || datesValidation.error || timesValidation.error" @click="onAction">{{isNew ? 'Создать' : 'Обновить'}}</button>
            </validation-provider>
            <button id="cancelJobButton" class='k-button k-my-button' @click="onCancelClick">Отмена</button>
        </div>
    </kendo-window>
</div>

</template>

<script>

import Vue from 'vue';
import axios from 'axios';
import ValidationError from '@/components/shared/validation-error.vue';
import FileUploader from '@/components/shared/file-uploader.vue';

export default {
    name: 'job-editor',
    components: {
        ValidationError,
        FileUploader
    },

    data() {
        return {
            actions: [
                //'Pin',
                //'Minimize',
                //'Maximize',
                'Close'
            ],
            yesNoSource: [{ Id: true, Name: "Да" }, { Id: false, Name: "Нет" }],
            isNew: true,

            departments: [],
            branches: [],
            approvalBranches: [],
            objects: [],
            pipelines: [],

            model: {
                id: null,
                description: null,
                startDate: null,
                endDate: null,
                startTime: null,
                endTime: null,
                approvalRegNumber: null,
                approvalRegDate: null,
                approvalBranch: null,
                department: null,
                branch: null,
                pipeline: null,
                isWeekPlanIncluded: true,
                files: [],
                objects: [{}],
            },
        };
    },

    watch: {
        'model.files': function(newValue) {
            console.log('editor...');
            console.log(newValue);
        },
    },

    computed: {

        datesValidation: function () {
            if (!this.model.startDate) return { error: true, message: 'Поля обязательны для заполнения.' }
            if (!this.model.endDate) return { error: true, message: 'Поля обязательны для заполнения.' }
            let start = kendo.parseDate(this.model.startDate);
            let end = kendo.parseDate(this.model.endDate);
            if (start > end) return { error: true, message: 'Дата начала производства работ не должна быть позже даты их окончания.' }
            return { error: false, message: '' };
        },

        timesValidation: function () {
            if (!this.model.startTime) return { error: true, message: 'Поля обязательны для заполнения.' }
            if (!this.model.endTime) return { error: true, message: 'Поля обязательны для заполнения.' }
            let start = kendo.parseDate(this.model.startTime);
            let end = kendo.parseDate(this.model.endTime);
            if (start > end) return { error: true, message: 'Время начала производства работ не должно быть больше времени их окончания.' }
            return { error: false, message: '' };
        },
    },

    methods: {
        loadInitData() {
            return Promise.all([
                    axios.post('../api/department/getAll'),
                    axios.post('../api/branch/getAll'),
                    axios.post('../api/branch/getAllApproval'),
                    axios.post('../api/pipeline/getAll'),
                ])
                .then(responses => {
                    let departmentsResponse = responses[0];
                    let branchesResponse = responses[1];
                    let approvalBranchesResponse = responses[2];
                    let pipelinesResponse = responses[3];

                    if(departmentsResponse.data.HasError) throw departmentsResponse.data.ErrorMessage;
                    if(branchesResponse.data.HasError) throw branchesResponse.data.ErrorMessage;
                    if(approvalBranchesResponse.data.HasError) throw approvalBranchesResponse.data.ErrorMessage;
                    if(pipelinesResponse.data.HasError) throw pipelinesResponse.data.ErrorMessage;

                    this.departments = departmentsResponse.data.Result;
                    this.branches = branchesResponse.data.Result;
                    this.approvalBranches = approvalBranchesResponse.data.Result;
                    this.pipelines = pipelinesResponse.data.Result;
                })
                .catch(error => {
                    console.log(error);
                    alert(error);
                });
        },

        _getDate(value) {
            var offsetMiliseconds = new Date().getTimezoneOffset() * 60000;
            const date = kendo.parseDate(value);
            if (date == null) return null;
            date.setTime(date.getTime() - offsetMiliseconds);
            return {
                Years: date.getUTCFullYear(),
                Months: date.getUTCMonth() + 1,
                Days: date.getUTCDate()
            };
        },

        _getTime(value) {
            var offsetMiliseconds = new Date().getTimezoneOffset() * 60000;
            const date = kendo.parseDate(value);
            if (date == null) return null;
            date.setTime(date.getTime() - offsetMiliseconds);
            console.log(date);
            return {
                Hours: date.getUTCHours(),
                Minutes: date.getUTCMinutes(),
                Seconds: date.getUTCSeconds(),
                Milliseconds: date.getUTCMilliseconds()
            };
        },

        _open() {
            Vue.nextTick(() => {
                var window = this.$refs.dialog.kendoWidget();
                window.center().open();
            });
        },

        _close() {
            var window = this.$refs.dialog.kendoWidget();
            window.close();
        },

        openCreate() {
            this.loadInitData()
                .then(() => {
                    this.isNew = true;
                    this._open();
                });
        },

        openChange(jobId) {
            this.loadInitData()
                .then(() => {
                    return axios.post('../api/job/getEditableById', { id: jobId }); 
                })
                .then(result => {
                    if(result.data.HasError) throw result.data.ErrorMessage;

                    const now = new Date();

                    const job = result.data.Result;
                    this.isNew = false;
                    this.model.id = job.Id;

                    this.model.branch = job.JobBranch;
                    this.model.objects = [ { object: job.JobObject, km: job.Km } ];
                    this._reloadObjects();

                    this.model.description = job.Description;

                    this.model.startDate = job.StartDate == null ? null : 
                        new Date(job.StartDate.Years, job.StartDate.Months - 1, job.StartDate.Days);

                    this.model.endDate = job.EndDate == null ? null :
                        new Date(job.EndDate.Years, job.EndDate.Months - 1, job.EndDate.Days);

                    this.model.startTime = job.StartTime == null ? null :
                        new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), job.StartTime.Hours, job.StartTime.Minutes, job.StartTime.Seconds, job.StartTime.Milliseconds);

                    this.model.endTime = job.EndTime == null ? null :
                        new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), job.EndTime.Hours, job.EndTime.Minutes, job.EndTime.Seconds, job.EndTime.Milliseconds);

                    this.model.approvalRegDate = job.ApprovalRegDate == null ? null :
                        new Date(job.ApprovalRegDate.Years, job.ApprovalRegDate.Months - 1, job.ApprovalRegDate.Days);

                    this.model.approvalRegNumber = job.ApprovalRegNumber;
                    this.model.approvalBranch = job.ApprovalBranch;
                    this.model.department = job.Department;
                    this.model.pipeline = job.Pipeline;
                    this.model.isWeekPlanIncluded = job.IsWeekPlanIncluded;

                    this.model.files = job.Attachments.map(attachment => {
                        //if (!attachment.Guid) attachment.Guid = $.newGuid();
                        return {
                            uid: attachment.Guid,
                            name: attachment.Name + (attachment.Extension ? attachment.Extension : ''),
                            url: `../Job/ShowAttachment/${attachment.Guid}`,
                            isPreloaded: true
                        };
                    });

                    this._open();
                })
                .catch(error => {
                    console.log(error);
                    alert(error);
                });
        },

        updateJob() {
            console.log('updateJob');
            this.$validator.validateAll().then((isValid) => {
                if (isValid) {
                    const model = this._getModelFromView();
                    axios.post('../api/job/update', { job: model })
                        .then(result => {
                            if(result.data.HasError) throw result.data.ErrorMessage;
                            this._close();
                        })
                        .catch(error => {
                            console.log(error);
                            alert('Ошибка при создании работы: ' + error);
                        });
                }
            });
        },

        _getModelFromView() {

            return {
                Id: this.model.id,
                Description: this.model.description,

                StartDate: this._getDate(this.model.startDate),
                EndDate: this._getDate(this.model.endDate),
                StartTime: this._getTime(this.model.startTime),
                EndTime: this._getTime(this.model.endTime),
                ApprovalRegDate: this._getDate(this.model.approvalRegDate),

                JobObject: this.model.objects[0].object,
                Km: this.model.objects[0].km,
                ApprovalRegNumber: this.model.approvalRegNumber,
                ApprovalBranch: this.model.approvalBranch,
                Department: this.model.department,
                Pipeline: this.model.pipeline,
                JobBranch: this.model.branch,
                IsWeekPlanIncluded: this.model.isWeekPlanIncluded,

                Attachments: this.model.files.map(file => {
                    return {
                        Guid: file.uid,
                        Name: file.name,
                        Content: file.content
                    };
                }),
            };
        },

        onAction() {
            console.log('onAction');
            this.updateJob();
        },

        onBranchChange() {
            this._reloadObjects();
        },

        _reloadObjects() {
            if(this.model.branch == null) this.objects = [];
            axios.post('../api/object/getAllByBranch', { branchId: this.model.branch.Id })
                .then(result => {
                    if(result.data.HasError) throw result.data.ErrorMessage;
                    this.objects = result.data.Result;

                //    this.$refs.objectDropdownlist.forEach(item => {
                //        const dropdownlist = item.kendoWidget();
                //        dropdownlist.setDataSource(result.data);
                //    });
                })
                .catch(error => {
                    console.log(error);
                    alert(error);
                });
        },

        onObjectChange: function (object, index) {
            const numeric = this.$refs.objectKm[index].kendoWidget();
            if (object == null) {
                numeric.enable(true);
            } else {
                this.model.objects[index].km = object.Km;
                numeric.enable(false);
            }
        },

        onAddObjectClick: function (e) {
            console.log('onAddObjectClick');
            console.log(e);
            this.model.objects.push({});
        },

        onCancelClick() {
            console.log(this.model);
            this._close();
        },
    },
}

</script>

<style>



</style>

<style scoped>

.field-validation-error {
    margin-top: 8px;
}

.details-container
{
    padding-left: 16px; 
    padding-right: 16px; 
    padding-top: 8px;
    border: 1px solid #aaaaaa;
}

.actions-container
{
    margin-top: 8px;
    text-align: right;
}

</style>