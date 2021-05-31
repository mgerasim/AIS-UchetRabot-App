<template>

<vu-modal   :isScroll="false" 
            :center="true" 
            :escapable="true" 
            :dismissable="false" 
            className="d-modal"
            headerClassName="d-header"
            class="no-select"
            style="width: 50%;">

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
                        <label for="name" class="control-label col-md-4">Система</label>
                        <div class="col-md-8">
                            <span>АСПТ для {{ branch.Name }}</span>
                        </div>
                    </div>

                    <div class="row form-group">
                        <label for="name" class="control-label col-md-4">Наименование защиты</label>
                        <div class="col-md-8">
                            <validation-provider name='Наименование защиты' rules="required" v-slot="{ errors }">
                                <textarea   name="name" 
                                            v-model="model.name"
                                            :class="{'k-textarea': true, 'is-danger': errors.length > 0 }"
                                            tabindex="0"
                                            style="width: 100%;" />
                                <validation-error class="field-validation-error" v-show="errors.length > 0">
                                    {{ errors[0] }}
                                </validation-error>
                            </validation-provider>
                        </div>
                    </div>

                    <!-- <div class="row form-group">
                        <label for="number" class="control-label col-md-4">Порядковый номер (для сортировки)</label>
                        <div class="col-md-4">
                            <numerictextbox
                                name="number"
                                v-model="model.number"
                                format="n"
                                :min="0"
                                :spinners="true"
                                style="width: 100%;">
                            </numerictextbox>
                        </div>
                    </div> -->

                    <div class="row form-group">
                        <label for="type" class="control-label col-md-4">Тип</label>
                        <div class="col-md-4">
                            <validation-provider name='Тип' :rules="{ required: true, custom: { validate: data => data.Value != null } }" v-slot="{ errors }" key="type">
                                <dropdownlist       ref="type"
                                                    name="type"
                                                    :data-source="maskTypes"
                                                    data-text-field="DisplayName"
                                                    data-value-field="Value"
                                                    v-model="model.type"
                                                    style="width: 100%;"
                                                    :class="{ 'is-danger': errors.length > 0 }">
                                </dropdownlist>
                            </validation-provider>
                        </div>
                    </div>

                    <div class="row form-group">
                        <label for="sourceEngine" class="control-label col-md-4">Источник получения текущего состояния маскирования</label>
                        <div class="col-md-4">
                            <span>{{ maskSourceEngine.DisplayName }}</span>
                        </div>
                    </div>

                </div>
            </div>

        </ValidationObserver>                




    <div class="d-actions">
        <button class='k-button k-primary d-action-button' @click="onConfirm" tabindex="3">{{isNew ? 'Создать' : 'Обновить'}}</button>
        <button class='k-button k-secondary d-action-button' @click="onCancel" tabindex="4">Отмена</button>
    </div>

</vu-modal>

</template>

<script lang="ts">

import { ref, computed, watch, defineComponent } from '@vue/composition-api';
import MaskService from '@/core/services/mask-service';
import IFullMask from '@/core/types/mask/fullMask';
import IEnumModel from '@/core/types/enumModel';
import ValidationError from '@/components/shared/validation-error.vue';
import { ValidationObserver } from 'vee-validate';
import Dropdownlist from '@/components/shared/dropdownlist.vue';

export default defineComponent({
    name: 'aspt-mask-editor',
    components: {
        Dropdownlist,
        ValidationError,
        ValidationObserver,
    },
    props: {
        'id': { type: Number, default: null },
        'branchId': { type: Number, required: true },
        'catalogItemId': { type: Number, required: true },
        'maskCatalogId': { type: Number, required: true },
    },
    setup(props, context) {
        const isNew = props.id == null;
        const title =  props.id == null ? 'Создание новой защиты АСПТ' : 'Изменение защиты АСПТ';
        let model = ref({
            id: undefined as (number | undefined),
            name: undefined as (string | undefined),
            type: { Value: undefined, Name: undefined } as IEnumModel, //защита/готовность
            number: undefined as (number | undefined),
            sourceEngine: { Value: undefined, Name: undefined } as IEnumModel,
            source: undefined as (string | undefined),
            logMessage: undefined as (string | undefined),
            isDeleted: false,
        });
        const observer = ref(null);

        const branch = computed(() => context.root.$store.state.branches.find(p => p.Id == props.branchId));
        const maskTypes = computed(() => [{ Value: null, DisplayName: '-= Выберите тип защиты =-' }, ...context.root.$store.state.maskTypes]); 
        const maskSourceEngine = computed(() => context.root.$store.state.maskSourceEngines.find((p: IEnumModel) => p.Name == 'None')); 

        const setToView = function(item: IFullMask) {
            model.value.id = item.Id;
            model.value.name = item.Name;
            model.value.type = item.Type;
            model.value.number = item.Number;
            model.value.source = item.Source;
            model.value.sourceEngine = item.SourceEngine;
            model.value.logMessage = item.LogMessage;
            model.value.isDeleted = item.IsDeleted;
        };

        const getFromView = function(): IFullMask {
            return {
                Id: model.value.id,
                Name: (model.value.name || ''),
                Type: (model.value.type || maskTypes.value[0] ),
                Number: model.value.number,
                SourceEngine: (model.value.sourceEngine || maskSourceEngine),
                Source: model.value.source,
                LogMessage: model.value.logMessage,
                System: { Name: 'ASPT' },
                Branch: { Id: props.branchId },
                Priority: 0,
                IsDeleted: model.value.isDeleted,
                CatalogItem: { Id: props.catalogItemId },
                RootCatalogItem: undefined,
            };
        };

        function load(id: number) {
            MaskService.getById(id)
                        .then(response => {
                            if(response.HasError) throw response.ErrorMessage;
                            setToView(response.Result);
                        })
                        .catch(error => {
                            console.log(error);
                            alert(error);
                        });
        }

        function onConfirm() {
            observer.value.validate().then((isValid: boolean) => {
                if(isValid) {
                    let mask = getFromView();
                    let action = isNew ? MaskService.create(mask) : MaskService.update(props.id, mask);
                    action.then(response => {
                        if(response.HasError) throw response.ErrorMessage;
                        context.root.$modals.close(response.Result);
                    })
                    .catch(error => {
                        console.log(error);
                        alert(error);
                    });
                }
            });
        }

        function onCancel() {
            context.root.$modals.dismiss();
        }

        if(!isNew) {
            load(props.id);
        } else {
            model.value.id = undefined;
            model.value.name = undefined;
            model.value.number = undefined;
            model.value.type = { Value: null };
            model.value.sourceEngine = maskSourceEngine.value;
            model.value.isDeleted = false;
        }

        return {
            title,
            isNew,
            model,
            maskTypes,
            maskSourceEngine,
            onConfirm,
            onCancel,
            observer,
            branch,
        };
    },    
})

</script>

<style lang="scss" scoped>

</style>