<template>
    <input type="text" ref="picker" :value="formatPeriod" />
</template>

<script>

import $ from 'jquery';
import '@/libs/daterange-picker/src/daterangepicker.js';
import moment from 'moment';

export default {
    name: 'daterange-picker',
    props: [ 'startDate', 'endDate' ],
    watch: {
        startDate(newValue) {
            $(this.$refs.picker).data('daterangepicker').setStartDate(newValue);
        },

        endDate(newValue) {
            $(this.$refs.picker).data('daterangepicker').setEndDate(newValue);
        },
    },
    data() {
        return {
        };
    },
    computed: {
        formatPeriod() {
            if(this.startDate == null && this.endDate == null) return null;
            if(this.startDate == null || this.endDate == null) return 'Некорректный период';
            return moment(this.startDate).format('DD.MM.YYYY') + ' - ' + moment(this.endDate).format('DD.MM.YYYY');
        },
    },
    methods: {
    },
    mounted() {
        var vm = this;

        var daterangepickerOptions = {
            autoUpdateInput: false,
            ranges: {
                'Сегодня': [moment(), moment()],
                'Завтра': [moment().add(1, 'd'), moment().add(1, 'd')],
                'Неделя': [moment().startOf('isoWeek'), moment().endOf('isoWeek')],
                'Следующая неделя': [
                    moment().add(1, 'w').startOf('isoWeek'), moment().add(1, 'w').endOf('isoWeek')
                ],
                'Месяц': [moment().startOf('month'), moment().endOf('month')]
            },
            locale: {
                format: 'DD.MM.YYYY',
                firstDay: 1,
                fromLabel: 'С',
                toLabel: 'ПО',
                customRangeLabel: 'Выбрать период',
                applyLabel: 'OK',
                cancelLabel: 'Очистить',
                daysOfWeek: [
                    "Вс",
                    "Пн",
                    "Вт",
                    "Ср",
                    "Чт",
                    "Пт",
                    "Сб"
                ],
                monthNames: [
                    "Январь",
                    "Февраль",
                    "Март",
                    "Апрель",
                    "Май",
                    "Июнь",
                    "Июль",
                    "Август",
                    "Сентябрь",
                    "Октябрь",
                    "Ноябрь",
                    "Декабрь"
                ]
            }
        };

        $(this.$refs.picker).daterangepicker(daterangepickerOptions)
            .on('apply.daterangepicker', function (ev, picker) {
                let startDate = picker.startDate;
                let endDate = picker.endDate;
                vm.$emit('apply', { startDate: startDate.toDate(), endDate: endDate.toDate() });
            })
            .on('cancel.daterangepicker', function () {
                $(this).val(null);
                vm.$emit('clear')
            });

        //$(this.$refs.picker).data('daterangepicker').setStartDate(this.startDate);
        //$(this.$refs.picker).data('daterangepicker').setEndDate(this.endDate);
    }
}

</script>

<style lang="scss" scoped>

@import '../../libs/daterange-picker/src/daterangepicker.css';

</style>