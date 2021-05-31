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
                        <label for="name" class="control-label col-md-3">Наименование</label>
                        <div class="col-md-9">
                            <validation-provider name='Наименование' rules="required" v-slot="{ errors }">
                                <input  name="name" 
                                        v-model="model.name"
                                        :class="{'k-textbox': true, 'is-danger': errors.length > 0 }"
                                        tabindex="0"
                                        style="width: 100%;" />
                                <validation-error class="field-validation-error" v-show="errors.length > 0">
                                    {{ errors[0] }}
                                </validation-error>
                            </validation-provider>
                        </div>
                    </div>

                    <div class="row form-group">
                        <label for="description" class="control-label col-md-3">Описание</label>
                        <div class="col-md-9">
                            <textarea name="description"
                                    rows="3" cols="1"
                                    v-model="model.description"
                                    tabindex="1"
                                    class="k-textbox"
                                    style="resize: vertical; overflow: auto; width: 100%;"></textarea>
                        </div>
                    </div>

                    <div class="row form-group">
                        <label for="order" class="control-label col-md-3">Вес (порядок)</label>
                        <div class="col-md-9">
                            <numerictextbox
                                name="order"
                                v-model="model.order"
                                format="n"
                                :min="0"
                                :spinners="true"
                                style="width: 100%;">
                            </numerictextbox>
                        </div>
                    </div>

                </div>
            </div>

            <div class="d-actions">
                <button class='k-button k-primary d-action-button' :disabled="invalid" @click="onConfirm" tabindex="3">{{isNew ? 'Создать' : 'Обновить'}}</button>
                <button class='k-button d-action-button' @click="onCancel" tabindex="4">Отмена</button>
            </div>

        </ValidationObserver>

    </vu-modal>

</template>

<script>

import ValidationError from '@/components/shared/validation-error.vue';
import { ValidationObserver } from 'vee-validate';
import axios from 'axios';
import Vue from 'vue';

export default {
    name: 'catalog-item-editor',
    components: {
        ValidationError,
        ValidationObserver,
    },
    props: {
        id: { type: Number, default: null },
        parentId: { type: Number, default: null },
        catalogId: { type: Number, required: true },
    },
    computed: {
        title() {
            return `${this.isNew ? 'Создание нового элемента каталога' : ('Изменение элемента каталога ' + this.model.name)}`;
        },
    },
    data() {
        return {
            isNew: true,
            model: {
                id: null,
                name: null,
                order: 0,
                description: null,
            },
        }
    },
    methods: {
        load() {
            axios.post('../api/catalog/getCatalogItemById', { id: this.id })
                .then(response => {
                    if(response.data.HasError) throw response.data.ErrorMessage;
                    const object = response.data.Result;
                    this.isNew = false;
                    this.model.id = object.Id;
                    this.model.name = object.Name;
                    this.model.description = object.Description;
                    this.model.order = object.Order;
                })
                .catch(error => {
                    console.log(error);
                    alert(`Ошибка при получении данных элементе каталога: ${error}`);
                });
        },

        _clear() {
            this.isNew = true;
            this.model.id = null;
            this.model.name = null;
            this.model.description = null;
            this.model.order = 0;
        },

        _updateObject() {
            const model = this._getModelFromView();
            axios.post('../api/catalog/updateCatalogItem', { model: model })
                .then(response => {
                    if(response.data.HasError) throw response.data.ErrorMessage;
                    this.$modals.close(response.data.Result);
                })
                .catch(error => {
                    console.log(error);
                    alert(`Ошибка при ${this.isNew ? 'обновлении' : 'создании' } элемента каталога: ${error}`);
                });
        },

        _getModelFromView() {
            return {
                Id: this.model.id,
                Name: this.model.name,
                Order: this.model.order,
                Description: this.model.description,
                CatalogId: this.catalogId,
                ParentId: this.parentId,
            };
        },

        onConfirm() {
            this.$refs.observer.validate().then(isValid => {
                if(isValid) {
                    this._updateObject();
                }
            });
        },

        onCancel() {
            this.$modals.dismiss();
        },
    },
    created() {
        if(this.id != null) {
            this.load();
        }
    },
}

</script>

<style lang="scss" scoped>

</style>