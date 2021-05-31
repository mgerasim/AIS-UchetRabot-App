<template>

<div class="h-flex" style="width: 100%; height: 100%;">
    <div style="flex: 1 1 100%; min-width: 0; height: 100%;">
        <Grid 
            style="height: 100%; width: 100%;"
            :data-items="items"
            :columns="columns"
            @change="change"
            @remove="remove">
        </Grid>
    </div>
    <div v-if="!readOnly" style="flex: 1 1 auto; margin-left: 4px;">
        <button type='button' 
                v-on:click='onCreateTimePeriod' 
                class='k-button' 
                style="width: 100%;">
            <fa icon="plus"></fa>&nbsp;Добавить дату
        </button>
        <button type='button' 
                v-on:click='onCreateTimePeriodList'
                class='k-button' 
                style="width: 100%; margin-top: 4px;">
            <fa icon="plus"></fa>&nbsp;Добавить период
        </button>
        <button type='button' 
                v-on:click='onCreateThroughTimePeriod'
                class='k-button' 
                style="width: 100%; margin-top: 4px;">
            <fa icon="plus"></fa>&nbsp;Добавить сквозной период
        </button>
    </div>
</div>

</template>

<script>

import moment from 'moment';
import CommandCell from '@/components/permit/time-period/list-command-cell';
import EditorOne from '@/components/permit/time-period/editor-one';
import EditorSome from '@/components/permit/time-period/editor-some';
import EditorThrough from '@/components/permit/time-period/editor-through';
import Vue from 'vue';

export default {
    name: 'permit-time-period-list',
    props: {
        value: { type: Array, required: true },
        readOnly: { type: Boolean, default: true },
    },
    computed: {
        items() {
            let temp = [...this.value];
            temp.sort((left, right) => {
                let leftValue = moment(left.StartTime).valueOf();
                let rightValue = moment(right.StartTime).valueOf();
                if(leftValue < rightValue) return -1;
                if(leftValue > rightValue) return +1;
                return 0;
            });
            return temp.map(p => {
                if(this.isOneDayPeriod(p)) {
                    //если дата начала периода совпадает с датой конца
                    return {
                        guid: p.Guid,
                        display: `${moment(p.StartTime).format('DD.MM.YYYY')} с ${moment(p.StartTime).format('HH:mm')} (МСК) до ${moment(p.EndTime).format('HH:mm')} (МСК)`,
                    };
                } else {
                    return {
                        guid: p.Guid,
                        display: `с ${moment(p.StartTime).format('DD.MM.YYYY')} ${moment(p.StartTime).format('HH:mm')} (МСК) до ${moment(p.EndTime).format('DD.MM.YYYY')} ${moment(p.EndTime).format('HH:mm')} (МСК)`,
                    };
                }
            });
        },

        columns() {
            return this.readOnly ? 
                    this.staticColumns : 
                    [   ...this.staticColumns,
                        { title: " ", cell: CommandCell, width: 90 },
                    ];
        },
    },
    data() {
        return {
            staticColumns: [
                { field: "display", title: " ", width: 'auto' },
            ],
        };
    },
    methods: {
        onCreateTimePeriod() {
            this.$modals.open({
                component: EditorOne,
                onClose: timePeriod => {
                    this.$emit('input', [ ...this.value, timePeriod ]);
                },
            });
        },

        onCreateTimePeriodList() {
            this.$modals.open({
                component: EditorSome,
                props: {
                },
                onClose: timePeriods => {
                    this.$emit('input', [ ...this.value, ...timePeriods ]);
                },
            });
        },

        onCreateThroughTimePeriod() {
            this.$modals.open({
                component: EditorThrough,
                onClose: timePeriod => {
                    this.$emit('input', [ ...this.value, timePeriod ]);
                },
            });
        },

        change(dataItem) {
            let sourceTimePeriod = this.value.find(p => p.Guid == dataItem.guid);

            //если на один день - откроем редактор для одного дня
            //иначе - для сквозного периода

            if(this.isOneDayPeriod(sourceTimePeriod)) {
                this.$modals.open({
                    component: EditorOne,
                    props: {
                        permitTimePeriod: sourceTimePeriod,
                    },
                    onClose: timePeriod => {
                        let result = [ ...this.value ];
                        let index = result.findIndex(p => p.Guid == timePeriod.Guid);
                        if(index > -1) Vue.set(result, index, timePeriod);
                        this.$emit('input', result);
                    },
                });
            } else {
                this.$modals.open({
                    component: EditorThrough,
                    props: {
                        permitTimePeriod: sourceTimePeriod,
                    },
                    onClose: timePeriod => {
                        let result = [ ...this.value ];
                        let index = result.findIndex(p => p.Guid == timePeriod.Guid);
                        if(index > -1) Vue.set(result, index, timePeriod);
                        this.$emit('input', result);
                    },
                });
            }
        },

        remove(dataItem) {
            let result = [ ...this.value ];
            let index = result.findIndex(p => p.Guid == dataItem.guid);
            if(index > -1) result.splice(index, 1);
            this.$emit('input', result);
        },

        isOneDayPeriod(timePeriod) {
            if(timePeriod == null) return true;

            let yearStart = moment(timePeriod.StartTime).year();
            let monthStart = moment(timePeriod.StartTime).month();
            let dayStart = moment(timePeriod.StartTime).date();

            let yearEnd = moment(timePeriod.EndTime).year();
            let monthEnd = moment(timePeriod.EndTime).month();
            let dayEnd = moment(timePeriod.EndTime).date();

            return yearStart == yearEnd && monthStart == monthEnd && dayStart == dayEnd;
        },
    },
}

</script>

<style lang="scss" scoped>

</style>