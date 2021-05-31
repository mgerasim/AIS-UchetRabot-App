<template>

    <vu-modal   :isScroll="false" 
                :center="true" 
                :escapable="true" 
                :dismissable="false" 
                className="d-modal"
                headerClassName="d-header"
                >

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
                        <label for="departmentName" class="control-label col-md-3">Наименование</label>
                        <div class="col-md-6">
                            <validation-provider name='Наименование' rules="required" v-slot="{ errors }">
                                <input  name="departmentName" 
                                        v-model="model.name"
                                        :class="{'k-textbox': true, 'is-danger': errors.length > 0 }"
                                        tabindex="0" />
                                <validation-error class="field-validation-error" v-show="errors.length > 0">
                                    {{ errors[0] }}
                                </validation-error>
                            </validation-provider>
                        </div>
                    </div>

                    <div class="row form-group">
                        <label for="description" class="control-label col-md-3">Описание</label>
                        <div class="col-md-6">
                            <textarea name="description"
                                    rows="3" cols="1"
                                    v-model="model.description"
                                    tabindex="1"
                                    class="k-textbox"
                                    style="resize: vertical; overflow: auto;"></textarea>
                        </div>
                    </div>

                    <div class="row form-group">
                        <label for="extended" class="control-label col-md-3">Протяженный</label>
                        <div class="col-md-6">
                            <input  id="extended"
                                    name="extended"
                                    type="checkbox"
                                    v-model="model.extended"
                                    tabindex="2"
                                    class="k-checkbox" />
                            <label for="extended" class="k-checkbox-label">{{ model.extended ? 'Да' : 'Нет' }}</label>
                        </div>
                    </div>

                </div>
            </div>

            <div class="d-actions">
                <button class='btn btn-sm btn-primary d-action-button' :disabled="invalid" @click="onConfirm" tabindex="3">{{isNew ? 'Создать' : 'Обновить'}}</button>
                <button class='btn btn-sm btn-secondary d-action-button' @click="onCancel" tabindex="4">Отмена</button>
            </div>

        </ValidationObserver>

    </vu-modal>

</template>

<script>

import ValidationError from '@/components/shared/validation-error.vue';
import { ValidationObserver } from 'vee-validate';
import axios from 'axios';

export default {
    name: 'object-type-editor',
    components: {
        ValidationError,
        ValidationObserver,
    },
    props: {
        id: { type: Number, default: null },
    },
    computed: {
        title() {
            return `${this.isNew ? 'Создание нового типа объекта' : ('Изменение типа объекта ' + this.model.name)}`;
        },
    },
    data() {
        return {
            isNew: true,
            model: {
                id: null,
                name: null,
                description: null,
                extended: false,
            }
        }
    },
    methods: {
        load() {
            axios.post('../api/objectType/getById', { id: this.id })
                .then(response => {
                    if(response.data.HasError) throw response.data.ErrorMessage;
                    const objectType = response.data.Result;
                    this.isNew = false;
                    this.model.id = objectType.Id;
                    this.model.name = objectType.Name;
                    this.model.description = objectType.Description;
                    this.model.extended = objectType.Extended;
                })
                .catch(error => {
                    console.log(error);
                    alert(`Ошибка при получении данных об типе объекта: ${error}`);
                });
        },

        _clear() {
            this.isNew = true;
            this.model.id = null;
            this.model.name = null;
            this.model.description = null;
            this.model.extended = false;
        },

        _updateObjectType() {
            const model = this._getModelFromView();
            axios.post('../api/objectType/update', { objectType: model })
                .then(response => {
                    if(response.data.HasError) throw response.data.ErrorMessage;
                    this.$modals.close(response.data.Result);
                })
                .catch(error => {
                    console.log(error);
                    alert(`Ошибка при ${this.isNew ? 'обновлении' : 'создании' } типа объекта: ${error}`);
                });
        },

        _getModelFromView() {
            return {
                Id: this.model.id,
                Name: this.model.name,
                Description: this.model.description,
                Extended: this.model.extended,
            };
        },

        onConfirm() {
            this.$refs.observer.validate().then(isValid => {
                if(isValid) {
                    this._updateObjectType();
                }
            });
        },

        onCancel() {
            this.$modals.dismiss();
        },

    },
    created() {
        if(this.id != null) this.load();
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