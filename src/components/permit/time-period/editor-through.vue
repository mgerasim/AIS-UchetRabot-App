<!-- Создание сквозного периода (затрагивающего несколько дней) -->

<template>

    <vu-modal   :isScroll="false" 
                :center="true" 
                :escapable="true" 
                :dismissable="false" 
                className="d-modal"
                headerClassName="d-header"
                class="no-select"
                style="width: 800px;">

        <template v-slot:header>
            <div class="h-flex">
                <span style="flex: 1 1 auto; margin-top: auto; margin-bottom: auto;">{{ title }}</span>
                <div class="d-close-icon" @click="onCancel">
                    <fa icon="times" size="lg" />
                </div>
            </div>
        </template>

        <ValidationObserver ref="observer" v-slot="{ invalid }" tag="div" slim>

            <div class="d-container">
                <div class="container-fluid">

                    <div class="row form-group">
                        <span class="control-label col-md-12">Выполнение работы</span>
                    </div>

                    <div class="form-group h-flex date-row">

                        <span class="control-label">с</span>

                        <div>
                            <validation-provider name='Даты выполнения работы' rules="required" v-slot="{ errors }">
                                <kendo-datepicker 
                                    v-model="model.dateStart"
                                    :class="{ 'is-danger': errors.length > 0 }"
                                    style="width: 100%;">
                                </kendo-datepicker>
                                <validation-error class="field-validation-error" v-show="errors.length > 0">
                                    {{ errors[0] }}
                                </validation-error>
                            </validation-provider>
                        </div>

                        <div>
                            <validation-provider name='Время начала выполнения работы (МСК)' rules="required" v-slot="{ errors }">
                                <kendo-timepicker 
                                    v-model="model.timeStart"
                                    :interval="60"
                                    :class="{ 'is-danger': errors.length > 0 }"
                                    style="width: 100%;">
                                </kendo-timepicker>
                                <validation-error class="field-validation-error" v-show="errors.length > 0">
                                    {{ errors[0] }}
                                </validation-error>
                            </validation-provider>
                        </div>

                        <span class="control-label">(МСК)</span>
                        <span class="control-label"></span>
                        <span class="control-label"></span>
                        <span class="control-label">по</span>

                        <div>
                            <validation-provider name='Дата выполнения работы' rules="required" v-slot="{ errors }">
                                <kendo-datepicker 
                                    v-model="model.dateEnd"
                                    :class="{ 'is-danger': errors.length > 0 }"
                                    style="width: 100%;">
                                </kendo-datepicker>
                                <validation-error class="field-validation-error" v-show="errors.length > 0">
                                    {{ errors[0] }}
                                </validation-error>
                            </validation-provider>
                        </div>

                        <div>
                            <validation-provider name='Время окончания выполнения работы (МСК)' rules="required" v-slot="{ errors }">
                                <kendo-timepicker 
                                    v-model="model.timeEnd"
                                    :interval="60"
                                    :class="{ 'is-danger': errors.length > 0 }"
                                    style="width: 100%;">
                                </kendo-timepicker>
                                <validation-error class="field-validation-error" v-show="errors.length > 0">
                                    {{ errors[0] }}
                                </validation-error>
                            </validation-provider>
                        </div>

                        <span class="control-label">(МСК)</span>

                    </div>

                </div>
            </div>

            <div class="d-actions">
                <button class='k-button k-primary d-action-button' :disabled="invalid" @click="onConfirm" tabindex="3">Создать</button>
                <button class='k-button k-secondary d-action-button' @click="onCancel" tabindex="4">Отмена</button>
            </div>

        </ValidationObserver>

    </vu-modal>

</template>

<script>

import ValidationError from '@/components/shared/validation-error.vue';
import { ValidationObserver } from 'vee-validate';
import moment from 'moment'; 
import Guid from '@/core/helpers/guid';

export default {
    name: 'permit-time-period-editor-through',
    components: {
        ValidationError,
        ValidationObserver,
    },
    props: {
        permitTimePeriod: { type: Object, default: null },
    },
    watch: {
        permitTimePeriod(newValue) {
            this.model.id = newValue != null ? newValue.Id : null;
            this.model.dateStart = newValue != null ? moment(newValue.StartTime).toDate() : null;
            this.model.dateEnd = newValue != null ? moment(newValue.EndTime).toDate() : null;
            this.model.timeStart = newValue != null ? moment(newValue.StartTime).toDate() : null;
            this.model.timeEnd = newValue != null ? moment(newValue.EndTime).toDate() : null;
        }
    },
    computed: {
        title() {
            return `${this.model.id == null ? 'Создание сквозного интервала выполнения работы' : 'Изменение сквозного интервала выполнения работы'}`;
        },
    },
    data() {
        return {
            model: {
                id: this.permitTimePeriod != null ? this.permitTimePeriod.Id : null,
                dateStart: this.permitTimePeriod != null ? moment(this.permitTimePeriod.StartTime).toDate() : null,
                dateEnd: this.permitTimePeriod != null ? moment(this.permitTimePeriod.EndTime).toDate() : null,
                timeStart: this.permitTimePeriod != null ? moment(this.permitTimePeriod.StartTime).toDate() : "2:00",
                timeEnd: this.permitTimePeriod != null ? moment(this.permitTimePeriod.EndTime).toDate() : "11:00",
            }
        }
    },
    methods: {
        _getModelFromView() {
            let dateStart = this.getDate(this.model.dateStart);
            let dateEnd = this.getDate(this.model.dateEnd);

            let yearStart = moment(dateStart).year();
            let monthStart = moment(dateStart).month();
            let dayStart = moment(dateStart).date();

            let yearEnd = moment(dateEnd).year();
            let monthEnd = moment(dateEnd).month();
            let dayEnd = moment(dateEnd).date();

            let timeStart = moment(this.getTime(this.model.timeStart)).year(yearStart).month(monthStart).date(dayStart).toDate();
            let timeEnd = moment(this.getTime(this.model.timeEnd)).year(yearEnd).month(monthEnd).date(dayEnd).toDate();

            return {
                Id: this.permitTimePeriod != null ? this.permitTimePeriod.Id : null,
                Guid: this.permitTimePeriod != null ? this.permitTimePeriod.Guid : Guid.generate(),
                StartTime: timeStart,
                EndTime: timeEnd,
            };
        },

        onConfirm() {
            this.$refs.observer.validate().then(isValid => {
                this.$modals.close(this._getModelFromView());
            });
        },

        onCancel() {
            this.$modals.dismiss();
        },

        getDate(value) {
            if(value == null) return null;
            if(value instanceof Date) return value;
            if(typeof value == 'string') {
                var re1 = /\d{2}\.\d{2}\.\d{4}/;
                var re2 = /\d{4}\.\d{2}\.\d{2}/;
                if(re1.test(value)) return moment(value, 'DD.MM.YYYY').toDate();
                if(re2.test(value)) return moment(value, 'YYYY.MM.DD').toDate();
            }
            return null; 
        },

        getTime(value) {
            if(value == null) return null;
            if(value instanceof Date) return value;
            if(typeof value == 'string') {
                var re1 = /\d{1,2}:\d{2}/;
                if(re1.test(value)) return moment(value, 'hh:mm').toDate();
            }
            return null; 
        },
    },
}

</script>

<style lang="scss" scoped>

.field-validation-error {
    margin-top: 8px;
}

.noselect {
    -ms-user-select: none;
    -moz-user-select: none;
    user-select: none;
}

.date-row {
    align-items: center;

    & > *:not(:first-child) {
        margin-left: 8px;
    }

    & > div {
        flex: 1 1 0px;
        min-width: 0;
    }
}

</style>