<template>
<div class="full-size v-flex no-select">
    <div v-if="busy" class="busy">
        <busy-indicator name="jobListBusy"></busy-indicator>
    </div>

    <div class="filter-row">
        <job-list-filter-row @apply="applyFilter" :show-date-filter="true"></job-list-filter-row>
    </div>
    <div class="content-row">
        <div class="jobs-columns">
            <Grid :style="{height: '100%', fontSize: '0.8rem'}"
                :data-items="items"
                :columns="columns"
                :sortable="true"
                :sort="sort"
                :pageable="true"
                :skip="skip"
                :take="take"
                :total="total"
                @pagechange="onPageChange"
                @sortchange="onSortChange"
                @rowclick="gridRowClick"
                @change="changeJob"
                @remove="removeJob"
                >

                <template v-slot:dateTemplate="{props, listeners}">
                    <td :class="props.className">
                        {{ formatDate(props.dataItem[props.field]) }}
                    </td>
                </template>

                <template v-slot:yesNoTemplate="{props, listeners}">
                    <td :class="props.className">
                        {{ props.dataItem[props.field] ? 'Да' : 'Нет' }}
                    </td>
                </template>

                <template v-slot:timePeriodTemplate="{props, listeners}">
                    <td :class="props.className">
                        {{ formatTimePeriod(props.dataItem) }}
                    </td>
                </template>

                <template v-slot:headerTemplate="{props, listeners}" >
                    <span class="k-link grid-header" @click="listeners.sortchange">{{props.title}}</span>
                </template>

                <template v-slot:attachmentsHeaderTemplate="{props, listeners}" >
                    <span class="grid-header"><fa icon="paperclip"></fa></span>
                </template>

                <template v-slot:attachmentsTemplate="{props, listeners}" >
                    <td :class="props.className">
                        <a v-if="props.dataItem.Version == 0 && props.dataItem.Attachment != null" :key="'job_' + props.dataItem.Version + '_' + props.dataItem.Id" class="attachment-link" :href="'/Job/ShowAttachment/' + props.dataItem.Attachment.Guid" target='_blank'><fa icon="paperclip"></fa></a>
                        <a v-if="props.dataItem.Version == 1 && props.dataItem.PermitFile != null" :key="'job_' + props.dataItem.Version + '_' + props.dataItem.Id" class="attachment-link" :href="'/Job/ShowAttachment/' + props.dataItem.PermitFile.Guid" target='_blank'><fa icon="paperclip"></fa></a>
                    </td>
                </template>

                <template v-slot:jobStatusTemplate="{props, listeners}" >
                    <td class="grid-cell" :class="getJobStatusClass(props.dataItem)">
                        {{ props.dataItem.JobStatus != null ? props.dataItem.JobStatus.DisplayName : '' }}
                    </td>
                </template>

            </Grid>
        </div>
        <div class="additions-columns">
            <div class="calendar-row">
                <kendo-calendar :value="new Date()" selection @change="calendarChange"></kendo-calendar>
            </div>
            <div class="map-row">
                <job-list-map></job-list-map>
            </div>
        </div>
    </div>

</div>
</template>

<script>

import axios from 'axios';
import moment from 'moment';
import JobListFilterRow from '@/components/job/job-list-filter-row.vue';
import CommandCell from '@/components/job/job-list-command-cell';
import JobListMap from '@/components/job/job-list-map';
import { hubConnection } from 'signalr-no-jquery';
import Tooltip from '@/components/shared/tooltip';
import JobDetails from '@/components/job/job-details';

export default {
    name: 'job-list',
    components: {
        JobListFilterRow,
        JobListMap,
        Tooltip,
    },
    data() {
        return {
            skip: 0,
            take: 20,
            total: 0,
            sort: [
                { field: 'StartDate', dir: 'desc' }
            ],
            items: [],
            selected: true,

            columns: [
                { title: " ", cell: CommandCell, width: 50 },
                { field: "ApprovalBranch.Name", title: "Уровень утверждения разрешения", width: 160, sortable: false },
                { field: "Branch.Name", title: "Участок производства работ", width: 160 },
                { field: "StartDate", title: "Дата начала работ", width: 100, cell: 'dateTemplate' },
                { field: "EndDate", title: "Дата завершения работ", width: 100, cell: 'dateTemplate' },
                { field: "Department.Name", title: "Ответственная служба", width: 130 },
                { field: "JobObject.Name", title: "Объект производства работ", width: 150 },
                { field: "Km", title: "Производство работ (Км)", width: 130 },
                { field: "Description", title: "Краткое описание выполняемых работ", width: 'auto', sortable: false },
                { field: "IsWeekPlanIncluded", title: "В плане на неделю", width: 90, cell: 'yesNoTemplate', sortable: false },
                { field: "IsLinearPartJob", title: "ЛЧ", width: 80, cell: 'yesNoTemplate', sortable: false },
                { field: "Attachments", title: " ", width: 40, headerCell: 'attachmentsHeaderTemplate', cell: 'attachmentsTemplate' },
                { field: "JobStatus.DisplayName", title: "Состояние работы", width: 140, cell: 'jobStatusTemplate' },
            ],

            clickTimeoutHandler: null,   
            clickCounter: 0, 

            filter: null,
            busy: false,
        };
    },
    methods: {
        loadItems() {
            this.busy = true;
            axios.post(`../api/job/read`, { request: { take: this.take, skip: this.skip, sort: this.sort, filter: this.filter } })
            .then(response => {
                if(response.data.HasError) throw response.data.ErrorMessage;
                this.items = response.data.Result.Data;
                this.total = response.data.Result.Total;
                this.busy = false;
            })
            .catch(error => {
                this.busy = false;
                console.log(error);
                alert(error);
            });
        },

        onPageChange(e) {
            this.skip = e.page.skip;
            this.take = e.page.take;
            this.loadItems();
        },

        onSortChange(e) {
            this.sort = e.sort;
            this.loadItems();
        },

        applyFilter(filter) {
            let items = [];

            if(filter.branchIds.length > 0) {
                let branches = filter.branchIds.map(p => {
                    return { field: 'BranchId', operator: 'eq', value: p };
                });
                items.push({
                    logic: 'or',
                    filters: branches,
                });
            }

            if(filter.approvalBranchIds.length > 0) {
                let branches = filter.approvalBranchIds.map(p => {
                    return { field: 'ApprovalBranchId', operator: 'eq', value: p };
                });
                items.push({
                    logic: 'or',
                    filters: branches,
                });
            }

            if(filter.departmentId != null) {
                items.push({
                    field: 'DepartmentId',
                    operator: 'eq',
                    value: filter.departmentId,
                });
            }

            if(filter.status != null) {
                items.push({
                    field: 'Status',
                    operator: 'eq',
                    value: filter.status,
                });
            }

            if(filter.kmStart != null) {
                items.push({
                    field: 'Km',
                    operator: 'gte',
                    value: filter.kmStart,
                });
            }

            if(filter.kmEnd != null) {
                items.push({
                    field: 'Km',
                    operator: 'lte',
                    value: filter.kmEnd,
                });
            }

            if(filter.regNumber != null) {
                items.push({
                    field: 'ApprovalRegNumber',
                    operator: 'contains',
                    value: filter.regNumber,
                });
            }

            if(filter.startDate != null && filter.endDate != null) {
                items.push({
                    field: 'EndDate',
                    operator: 'gte',
                    value: filter.startDate,
                });
                items.push({
                    field: 'StartDate',
                    operator: 'lte',
                    value: filter.endDate,
                });
            }

            if (filter.description != null) {
                var arr = filter.description.split('ИЛИ').filter(p => p != null).filter(p => p.trim() != '');
                if(arr.length > 0) {
                    let descriptions = arr.map(p => {
                        return { field: 'Description', operator: 'contains', value: p.trim() };
                    });
                    items.push({
                        logic: 'or',
                        filters: descriptions
                    });
                }
            }

            if(items.length > 0) {
                this.filter = {
                    logic: 'and',
                    filters: items,
                };
            } else this.filter = null;
            this.loadItems();
        },

        gridRowClick(e) {
            clearTimeout(this.clickTimeoutHandler);
            if(this.clickCounter == 0) {
                this.clickCounter++;
                this.clickTimeoutHandler = setTimeout(() => {
                    this.clickCounter = 0;
                    this.clickTimeoutHandler = null;
                    this.onClick(e.dataItem);
                }, 300);
            } else if(this.clickCounter == 1) {
                this.clickCounter = 0;
                this.onDblClick(e.dataItem);
            }        
        },

        onClick(dataItem) {
        },

        onDblClick(dataItem) {
            this.changeJob(dataItem);
        },

        formatDate(date) {
            return moment(date).format('DD.MM.YYYY');
        },

        formatTimePeriod(dataItem) {
            return `${moment(dataItem.StartTime).format('HH:mm')} - ${moment(dataItem.EndTime).format('HH:mm')}`;
        },

        getJobStatusClass(dataItem) {
            if(dataItem.JobStatus == null) return '';
            let jobStatus = dataItem.JobStatus.Value;
            switch (jobStatus) {
                case 0:
                    return 'job-allowed';
                case 1:
                    return 'job-suspended';
                case 2:
                    return 'job-completed';
                case 3:
                    return 'job-denied';
            }
            return '';
        },

        calendarChange(e) {
            var current = e.sender.current();
            //js объект Date с таймзоной клиента! В гриде ТОЖЕ стоит таймзона клиента (хоть мы и знаем, что на самом деле там время по Москве)!
            // //var selectedByMoscow = moment.tz(selected, "Europe/Moscow");

            // var datesFilter = $('#dates-filter').data('daterangepicker');
            // datesFilter.setStartDate(moment(selectedDate).startOf('day'));
            // datesFilter.setEndDate(moment(selectedDate).endOf('day'));
            // datesFilter.clickApply();

        },

        changeJob(dataItem) {
            this.$modals.open({
                component: JobDetails,
                props: {
                    id: dataItem.Id,
                    version: dataItem.Version,
                },
                onClose: object => {
                    // Object.assign(object, { selected: false });
                    // this.refreshRow(object);
                },
            });
        },

        removeJob(dataItem) {

        },

        lll(data) {
            console.log(data);
            return '';
        },

        setupSignalR() {
            const connection = hubConnection();   //hubConnection('http://[address]:[port]', options);
            const hubProxy = connection.createHubProxy('jobsHub');

            hubProxy.on('updateStates', function(jobs) {
                //изменилось состояние работы
                for(let job in jobs) {
                    let dataItem = this.items.find(p => p.Id == job.Id);
                }
            });  

            hubProxy.on('onJobCreate', function() {
                //рефрешим грид, если в системе создалась работа (чтобы применилась серверная фильтрация)
            });  

            // hubProxy.on('startTest', function(data) {
            //     console.log(data);
            // });  

            let startSignalR = () => {
                connection.start({ jsonp: true })
                    .done(() => {
                        console.log("SignalR now connected, connection Id is " + connection.id);
                    })
                    .fail(() => {
                        console.log("SignalR could not connect");
                    });
            };

            connection.disconnected(() => {
                console.log("SignalR disconnected");
                setTimeout(() => {
                    console.log("SignalR retry connect");
                    startSignalR();
                }, 5000);
            });

            startSignalR();
        },
    },
    created() {
        this.loadItems();
        this.setupSignalR();
    },
    destroyed() {
    },
}

</script>

<style lang="scss" scoped>

@import '@/styles/_mixins.scss';

.grid-cell {
    border-style: solid;
    border-color: #ccc;
    border-width: 0 0 1px 1px;
}

/* 0. allowed */
.job-allowed {
    background: #7fe57f;
}
// .job-allowed {
//     background: #7fd57f;
// }

/* 1. suspended */
.job-suspended {
    background: #ffff7f;
}
// .job-suspended {
//     background: #ffff3f;
// }

/* 2. completed */
.job-completed {
    background: #ccc;
}
// .job-completed {
//     background: #bbb;
// }

/* 3. denied */
.job-denied {
    background: #ff7f7f;
}
// .job-denied {
//     background: #ff5f5f;
// }

.attachment-link {
    color: #4444cc;
}

.grid-header {
    @include wrap-word;
    font-size: 0.8rem;
    vertical-align: top;
}

.filter-row {
    flex: 0 0 auto; 
    margin-top: 4px;
    margin-bottom: 4px; 
}

.content-row {
    flex: 1 1 100%;
    min-height: 0; 
    display: flex;
    flex-flow: row nowrap;
}

.jobs-columns {
    height: 100%;
    flex: 1 1 100%;
    min-width: 0;
}

.additions-columns {
    height: 100%;
    flex: 0 0 auto;
    display: flex;
    flex-flow: column nowrap;
}

.calendar-row {
    flex: 0 0 auto;
}

.map-row {
    flex: 1 1 100%;
    min-height: 0;
}

</style>