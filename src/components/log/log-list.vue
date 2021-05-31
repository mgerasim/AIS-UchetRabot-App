<template>

    <div style="height: 100%;">

        <Grid :style="{height: '100%'}"
            :data-items="items"
            :columns="columns"
            :sortable="true"
            :sort= "sort"
            :pageable="true"
            :skip="skip"
            :take="take"
            :total="total"
            @pagechange="onPageChange"
            @sortchange="onSortChange"
            @rowclick="gridRowClick"
            class="no-select">

            <template v-slot:dateTimeTemplate="{props, listeners}">
                <td :class="props.className">
                    {{ formatDateTime(props.dataItem[props.field]) }}
                </td>
            </template>

            <template v-slot:linkTemplate="{props, listeners}">
                <td :class="props.className">
                    <a href="#" class='job-link' @click.prevent="jobLinkClick(props.dataItem[props.field])">{{ props.dataItem[props.field] }}</a>
                </td>
            </template>

        </Grid>

        <log-details ref="logDetails"></log-details>
        <job-details ref="jobDetails"></job-details>

    </div>

</template>

<script>
    import axios from 'axios';
    import LogDetails from '@/components/log/log-details.vue';
    import JobDetails from '@/components/job/job-details.vue';
    import moment from 'moment';

    export default {
        name: 'log-list',
        components: {
            LogDetails,
            JobDetails,
        },
        data() {
            return {
                skip: 0,
                take: 20,
                total: 0,
                sort: [
                    { field: 'Date', dir: 'desc' }
                ],
                items: [],
                selected: true,

                columns: [
                    { field: "EntryId", title: "№ работы", width: 100, cell: 'linkTemplate' },
                    { field: "Date", title: "Дата операции", width: 200, cell: 'dateTimeTemplate' },
                    { field: "User.DisplayName", title: "Кем создано", width: 350 },
                    { field: "AdditionalDescription", title: "Название", width: 'auto' },
                ],

                clickTimeoutHandler: null,
                clickCounter: 0,
            }
        },
        methods: {
            loadItems() {
                axios.post(`../api/log/read`, { request: { take: this.take, skip: this.skip, sort: this.sort } })
                .then(response => {
                    if(!response.data.HasError) {
                        this.items = response.data.Result.Data;
                        this.total = response.data.Result.Total;
                    }
                })
                .catch(e => {
                    console.log(e);
                });
            },

            jobLinkClick(entryId) {
                var dialog = this.$refs.jobDetails;
                dialog.open(entryId);
            },

            onClick(dataItem) {
            },

            onDblClick(dataItem) {
                var dialog = this.$refs.logDetails;
                dialog.open(dataItem.Id);
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

            onPageChange: function(e) {
                this.skip = e.page.skip;
                this.take = e.page.take;
                this.loadItems();
            },

            onSortChange: function(e) {
                this.sort = e.sort;
                this.loadItems();
            },

            formatDateTime(date) {
                return moment(date).format('DD.MM.YYYY HH:mm');
            },
        },
        created: function () {
            this.loadItems();
        },
    }
</script>

<style scoped>
    .job-link {
        text-decoration: underline;
    }
</style>