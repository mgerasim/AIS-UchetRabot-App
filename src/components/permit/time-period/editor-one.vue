<!-- Редактирование периода на одну дату -->

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

                    <div>
                        <validation-provider name='Дата выполнения работы' rules="required" v-slot="{ errors }">
                            <kendo-datepicker 
                                v-model="model.date"
                                :class="{ 'is-danger': errors.length > 0 }"
                                style="width: 100%;">
                            </kendo-datepicker>
                            <validation-error class="field-validation-error" v-show="errors.length > 0">
                                {{ errors[0] }}
                            </validation-error>
                        </validation-provider>
                    </div>

                    <span class="control-label"></span>
                    <span class="control-label"></span>
                    <span class="control-label">с</span>

                    <div>
                        <validation-provider name='Время начала выполнения работы (МСК)' rules="required" v-slot="{ errors }">
                            <kendo-timepicker 
                                v-model="model.start"
                                :interval="60"
                                :class="{ 'is-danger': errors.length > 0 }"
                                style="width: 100%;">
                            </kendo-timepicker>
                            <validation-error class="field-validation-error" v-show="errors.length > 0">
                                {{ errors[0] }}
                            </validation-error>
                        </validation-provider>
                    </div>

                    <span class="control-label">по</span>

                    <div>
                        <validation-provider name='Время окончания выполнения работы (МСК)' rules="required" v-slot="{ errors }">
                            <kendo-timepicker 
                                v-model="model.end"
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
            <button class='k-button k-primary d-action-button' :disabled="invalid" @click="onConfirm" tabindex="3">{{model.id == null ? 'Создать' : 'Обновить'}}</button>
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
    name: 'permit-time-period-editor-one',
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
            this.model.date = newValue != null ? moment(newValue.StartTime).toDate() : null;
            this.model.start = newValue != null ? moment(newValue.StartTime).toDate() : null;
            this.model.end = newValue != null ? moment(newValue.EndTime).toDate() : null;
        }
    },
    computed: {
        title() {
            return `${this.model.id == null ? 'Создание интервала выполнения работы' : 'Изменение интервала выполнения работы'}`;
        },
    },
    data() {
        return {
            model: {
                id: this.permitTimePeriod != null ? this.permitTimePeriod.Id : null,
                date: this.permitTimePeriod != null ? moment(this.permitTimePeriod.StartTime).toDate() : null,
                start: this.permitTimePeriod != null ? moment(this.permitTimePeriod.StartTime).toDate() : "2:00",
                end: this.permitTimePeriod != null ? moment(this.permitTimePeriod.EndTime).toDate() : "11:00",
            }
        }
    },
    methods: {
        _getModelFromView() {
            let date = this.getDate(this.model.date);

            let year = moment(date).year();
            let month = moment(date).month();
            let day = moment(date).date();

            let start = moment(this.getTime(this.model.start)).year(year).month(month).date(day).toDate();
            let end = moment(this.getTime(this.model.end)).year(year).month(month).date(day).toDate();

            return {
                Id: this.permitTimePeriod != null ? this.permitTimePeriod.Id : null,
                Guid: this.permitTimePeriod != null ? this.permitTimePeriod.Guid : Guid.generate(),
                StartTime: start,
                EndTime: end,
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