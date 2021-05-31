<template>

    <div>

        <kendo-window ref="dialog"
                      :animation="false"
                      :width="'800px'"
                      :title="`Работа ${jobId}`"
                      :visible="false"
                      :modal="true"
                      :draggable="true"
                      :actions="actions">
            <div id="details-container">
                <dl class="dl-horizontal">
                    <dt>Работа: </dt>
                    <dd><a href="#" v-on:click='showJobDetails(); return false;'>{{ entryId }}</a></dd>
                    <dt>Операция: </dt>
                    <dd>{{ logActionTypeDisplayName }}</dd>
                    <dt>Совершена: </dt>
                    <dd>{{ date }}</dd>
                    <dt>Сотрудником: </dt>
                    <dd>{{ userDisplayName }}</dd>
                    <dt>Краткое описание: </dt>
                    <dd>{{ additionalDescription }}</dd>
                    <dt style='color:#777;'>Детальное описание: </dt>
                    <dd style='color:#777;'>
                        <ul>
                            <li v-for="(descriptionRow, index) in descriptionRows" :key="'desc_' + index">{{ descriptionRow }}</li>
                        </ul>
                    </dd>
                </dl>
            </div>
        </kendo-window>

        <job-details ref="jobDetails"></job-details>

    </div>

</template>

<script>

    import Vue from 'vue';
    import { KendoWindow } from '@progress/kendo-window-vue-wrapper';
    import axios from 'axios';
    import JobDetails from '@/components/job/job-details.vue';

    export default {
        name: 'log-details',
        components: {
            KendoWindow,
            JobDetails
        },
        data() {
            return {
                actions: [
                    //'Pin',
                    //'Minimize',
                    //'Maximize',
                    'Close'
                ],
                additionalDescription: '',
                userDisplayName: '',
                entryId: '',
                logActionTypeDisplayName: '',
                date: '',
                descriptionRows: [],
                jobId: 0,
            }
        },
        methods: {
            open(id) {
                this.loadLogItem(id);
            },

            loadLogItem(id) {
                axios.post(`../api/log/getById`, { id: id })
                .then(response => {
                    if(response.data.HasError) throw response.data.ErrorMessage;

                    const data = response.data.Result;
                    this.jobId = data.EntryId;
                    this.additionalDescription = data.AdditionalDescription;
                    this.userDisplayName = data.User.DisplayName;
                    this.entryId = data.EntryId;
                    this.logActionTypeDisplayName = data.LogActionType.DisplayName;
                    this.date = this.toDateTimeString(data.Date);
                    this.descriptionRows = data.Description.split('\r\n');

                    var window = this.$refs.dialog.kendoWidget();
                    //отображаем на следующем тике, чтобы сначало заполнился контентом, а потом открылся по центру
                    Vue.nextTick(() => window.center().open());
                })
                .catch(e => {
                    console.log(e);
                    alert(e);
                });
            },

            toDateTimeString(dateTime, skipTime) {
                if (dateTime == null) return '';
                if (!dateTime) return '';
                var displayFormat = skipTime ? '{0:dd.MM.yyyy}' : '{0:dd.MM.yyyy  HH:mm}';
                return kendo.format(displayFormat, kendo.parseDate(dateTime));
            },

            showJobDetails() {
                this.$refs.jobDetails.open(this.entryId);
            }
        }
    }
</script>

<style scoped>

</style>