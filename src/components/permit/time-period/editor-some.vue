<!-- Создание нескольких периодов с одним временем выполнения -->

<template>

<vu-modal   :isScroll="false" 
            :center="true" 
            :escapable="true" 
            :dismissable="false" 
            className="d-modal"
            headerClassName="d-header"
            class="no-select">

    <template v-slot:header>
        <div class="h-flex">
            <span style="flex: 1 1 auto; margin-top: auto; margin-bottom: auto;">Создание интервала выполнения работы</span>
            <div class="d-close-icon" @click="onCancel">
                <fa icon="times" size="lg" />
            </div>
        </div>
    </template>

    <ValidationObserver ref="observer" v-slot="{ invalid }" tag="div" slim>

        <div class="d-container">
            <div class="container-fluid">

                <div class="row form-group">

                    <label class="control-label col-md-6">Даты выполнения работы</label>
                    <div class="col-md-3">
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

                    <div class="col-md-3">
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

                </div>

                <div class="row form-group">

                    <label class="control-label col-md-6">Время выполнения работы (МСК)</label>
                    <div class="col-md-3">
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
                    <div class="col-md-3">
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
    name: 'permit-time-period-editor-some',
    components: {
        ValidationError,
        ValidationObserver,
    },
    data() {
        return {
            model: {
                dateStart: null,
                dateEnd: null,
                timeStart: "2:00",
                timeEnd: "11:00",
            }
        }
    },
    methods: {
        _getModelFromView() {
            let dateStart = this.getDate(this.model.dateStart);
            let dateEnd = this.getDate(this.model.dateEnd);

            let daysStart = moment(dateStart);
            let daysEnd = moment(dateEnd);
            let dayCurrent = daysStart;

            let result = [];

            while(dayCurrent <= daysEnd) {
                let year = dayCurrent.year();
                let month = dayCurrent.month();
                let day = dayCurrent.date();

                let timeStart = moment(this.getTime(this.model.timeStart)).year(year).month(month).date(day).toDate();
                let timeEnd = moment(this.getTime(this.model.timeEnd)).year(year).month(month).date(day).toDate();

                result.push({
                    Guid: Guid.generate(),
                    StartTime: timeStart,
                    EndTime: timeEnd,
                });
                dayCurrent = dayCurrent.add(1, 'days');
            }



            return result;
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

<style scoped>

    .field-validation-error {
        margin-top: 8px;
    }

    .noselect {
        -ms-user-select: none;
        -moz-user-select: none;
        user-select: none;
    }

</style>