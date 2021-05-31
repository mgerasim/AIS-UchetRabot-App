<template>

    <div class="container-fluid">

        <div v-if="model.permitFile == null" class="row form-group">
            <label class="my-label control-label col-md-3">Шаблон разрешения</label>
            <div class="col-md-9 h-flex">
                <div style="flex: 1 1 100%; win-width: 0;">
                    <div v-if="model.permitTemplate != null" class="v-flex">
                        <div>{{ model.permitTemplate.Name }}</div>
                        <file v-if="model.permitTemplate.File != null" :file="model.permitTemplate.File" :readonly="true"></file>
                    </div>
                </div>
                <div v-if="!readOnly" class="h-flex content-center" style="flex: 0 0 auto;">
                    <button v-if="model.permitTemplate != null" 
                            class="k-button" 
                            @click="model.permitTemplate = null"
                            title="Удалить шаблон из разрешения">
                        <fa icon="times"></fa>
                    </button>
                    <button v-if="model.permitTemplate != null"
                            class="k-button" 
                            @click="onPermitTemplateReload" 
                            style="margin-left: 4px;"
                            title="Перечитать шаблон разрешения">
                        <fa icon="sync-alt"></fa>
                    </button>
                    <button v-if="model.permitTemplate != null"
                            class="k-button" 
                            @click="onPermitTemplateEdit" 
                            style="margin-left: 4px;"
                            title="Открыть шаблон разрешения">
                        <fa icon="pencil-alt"></fa>
                    </button>
                    <button class="k-button" 
                            @click="onPermitTemplateSelect" 
                            style="margin-left: 4px;"
                            title="Выбрать шаблон разрешения">
                        <fa icon="ellipsis-h"></fa>
                    </button>
                </div>
            </div>
        </div>

        <div v-if="model.permitTemplate == null" class="row form-group">
            <label class="my-label control-label col-md-3">Загруженный вручную текст разрешения</label>
            <div class="col-md-9 h-flex">
                <div style="flex: 1 1 100%; min-width: 0;">
                    <file   v-if="model.permitFile != null" 
                            :file="model.permitFile"
                            @rename="onFileRename"
                            @remove="onFileRemove"
                            @replace="onFileReplace"
                            :readonly="readOnly"></file>
                </div>
                <div v-if="!readOnly" style="flex: 0 0 auto;">
                    <button     v-if="model.permitFile != null" 
                                class="k-button" 
                                @click="model.permitFile = null">
                        <fa icon="times"></fa>
                    </button>
                    <file-upload-button v-if="model.permitFile == null" 
                                        class="k-button k-primary" 
                                        :filters="filters" 
                                        :multiple="false" 
                                        title="Загрузить файл текста разрешения"
                                        @upload="onFileUpload"
                                        style="margin-left: 4px;">
                        <fa icon="download"></fa>&nbsp;Загрузить
                    </file-upload-button>
                </div>
            </div>
        </div>

        <div class="row form-group">

            <label class="my-label control-label col-md-3">Отдел</label>
            <div class="col-md-3">
                <validation-provider name='Отдел' rules="required" v-slot="{ errors }" key="department" :disabled="!(needSaveValidation || needBaseValidation)">
                    <dropdownlist   ref="department"
                                    name="department"
                                    :disabled="readOnly"
                                    :data-source="departments"
                                    data-text-field="Name"
                                    data-value-field="Id"
                                    v-model="model.department"
                                    style="width: 100%;"
                                    :class="{ 'is-danger': errors.length > 0 }">
                    </dropdownlist>
                </validation-provider>
            </div>

            <label class="my-label control-label col-md-3">Подразделение</label>
            <div class="col-md-3">
                <validation-provider name='Подразделение' rules="required" v-slot="{ errors }" key="branch" :disabled="!(needSaveValidation || needBaseValidation)">
                    <dropdownlist   ref="branch"
                                    name="branch"
                                    :disabled="readOnly"
                                    :data-source="branches"
                                    data-text-field="Name"
                                    data-value-field="Id"
                                    v-model="model.branch"
                                    @change="branchChanged"
                                    style="width: 100%;"
                                    :class="{ 'is-danger': errors.length > 0 }">
                    </dropdownlist>
                </validation-provider>
            </div>

        </div>

        <div class="row form-group">

            <label class="my-label control-label col-md-3">Тип оборудования</label>
            <div class="col-md-3">
                <validation-provider name='Тип оборудования' rules="required" v-slot="{ errors }" key="equipmentType" :disabled="!needBaseValidation">
                    <dropdownlist   ref="equipmentType"
                                    name="equipmentType"
                                    :disabled="readOnly"
                                    :data-source="equipmentTypes"
                                    data-text-field="DisplayName"
                                    data-value-field="Value"
                                    v-model="model.equipmentType"
                                    style="width: 100%;"
                                    :class="{ 'is-danger': errors.length > 0 }">
                    </dropdownlist>
                </validation-provider>
            </div>

            <label class="my-label control-label col-md-3">Вид работ</label>
            <div class="col-md-3">
                <validation-provider name='Вид работ' rules="required" v-slot="{ errors }" key="workType" :disabled="!needBaseValidation">
                    <dropdownlist   ref="workType"
                                    name="workType"
                                    :disabled="readOnly"
                                    :data-source="workTypes"
                                    data-text-field="DisplayName"
                                    data-value-field="Value"
                                    v-model="model.workType"
                                    style="width: 100%;"
                                    :class="{ 'is-danger': errors.length > 0 }">
                    </dropdownlist>
                </validation-provider>
            </div>

        </div>

        <div class="row form-group">
            <label class="form-label control-label col-md-3">Необходимость маскирования защит</label>
            <group class="col-md-9">
                <div class="container" style="margin-top: 0.5rem;">
                    <div class="row">
                        <label for="needNpsMask" class="control-label col-md-2 form-label">Защиты МПСА + АСПТ</label>
                        <div class="col-md-2 h-flex">
                            <input  id="needNpsMask"
                                    name="needNpsMask"
                                    type="checkbox"
                                    v-model="model.needNpsMask"
                                    :disabled="readOnly"
                                    tabindex="2"
                                    class="k-checkbox" />
                            <label for="needNpsMask" class="k-checkbox-label">{{ model.needNpsMask ? 'Да' : 'Нет' }}</label>
                        </div>
                        <label for="needEsuMask" class="control-label col-md-2 form-label">Защиты ЕСУ</label>
                        <div class="col-md-2 h-flex">
                            <input  id="needEsuMask"
                                    name="needEsuMask"
                                    type="checkbox"
                                    v-model="model.needEsuMask"
                                    :disabled="readOnly"
                                    tabindex="2"
                                    class="k-checkbox" />
                            <label for="needEsuMask" class="k-checkbox-label">{{ model.needEsuMask ? 'Да' : 'Нет' }}</label>
                        </div>
                        <label for="needCspaMask" class="control-label col-md-2 form-label">Защиты ЦСПА</label>
                        <div class="col-md-2 h-flex">
                            <input  id="needCspaMask"
                                    name="needCspaMask"
                                    type="checkbox"
                                    v-model="model.needCspaMask"
                                    :disabled="readOnly"
                                    tabindex="2"
                                    class="k-checkbox" />
                            <label for="needCspaMask" class="k-checkbox-label">{{ model.needCspaMask ? 'Да' : 'Нет' }}</label>
                        </div>
                    </div>
                </div>    
            </group>
        </div>

        <div class="row form-group ">
            <label class="control-label col-md-3 form-label">Линейная часть</label>
            <div class="col-md-1 h-flex">
                <input  id="isLinearPart"
                        name="isLinearPart"
                        type="checkbox"
                        v-model="model.isLinearPart"
                        :disabled="readOnly"
                        tabindex="2"
                        class="k-checkbox" />
                <label for="isLinearPart" class="k-checkbox-label">{{ model.isLinearPart ? 'Да' : 'Нет' }}</label>
            </div>

            <div class="col-md-4">
                <div v-if="!model.isLinearPart" class="container">
                    <div class="row form-group ">
                        <label for="hasMna" class="control-label col-md-9 form-label">Наличие МНА</label>
                        <div class="col-md-3 h-flex">
                            <input  id="hasMna"
                                    name="hasMna"
                                    type="checkbox"
                                    v-model="model.hasMna"
                                    :disabled="true"
                                    tabindex="2"
                                    class="k-checkbox" />
                            <label for="hasMna" class="k-checkbox-label">{{ model.hasMna ? 'Да' : 'Нет' }}</label>
                        </div>
                    </div>
                    <div v-if="model.hasMna" class="row form-group ">
                        <label for="needOutputToRepairMna" class="control-label col-md-9 form-label">Необходимость вывода МНА в ремонт</label>
                        <div class="col-md-3 h-flex">
                            <input  id="needOutputToRepairMna"
                                    name="needOutputToRepairMna"
                                    type="checkbox"
                                    v-model="model.needOutputToRepairMna"
                                    :disabled="readOnly"
                                    tabindex="2"
                                    class="k-checkbox" />
                            <label for="needOutputToRepairMna" class="k-checkbox-label">{{ model.needOutputToRepairMna ? 'Да' : 'Нет' }}</label>
                        </div>
                    </div>
                    <div v-if="model.hasMna" class="row form-group ">
                        <label for="hasAvrMna" class="control-label col-md-9 form-label">Наличие АВР МНА</label>
                        <!-- Выбор только если необходимо выводить МНА в ремонт -->
                        <div v-if="model.needOutputToRepairMna" class="col-md-3 h-flex">
                            <input  id="hasAvrMna"
                                    name="hasAvrMna"
                                    type="checkbox"
                                    v-model="model.hasAvrMna"
                                    :disabled="readOnly"
                                    tabindex="2"
                                    class="k-checkbox" />
                            <label for="hasAvrMna" class="k-checkbox-label">{{ model.hasAvrMna ? 'Да' : 'Нет' }}</label>
                        </div>
                        <div v-else class="col-md-3 h-flex">
                            <span>Не требуется</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-4">
                <div v-if="!model.isLinearPart" class="container">
                    <div class="row form-group ">
                        <label for="hasPna" class="control-label col-md-9 form-label">Наличие ПНА</label>
                        <div class="col-md-3 h-flex">
                            <input  id="hasPna"
                                    name="hasPna"
                                    type="checkbox"
                                    v-model="model.hasPna"
                                    :disabled="readOnly"
                                    tabindex="2"
                                    class="k-checkbox" />
                            <label for="hasPna" class="k-checkbox-label">{{ model.hasPna ? 'Да' : 'Нет' }}</label>
                        </div>
                    </div>                                        
                    <div v-if="model.hasPna" class="row form-group ">
                        <label for="needOutputToRepairPna" class="control-label col-md-9 form-label">Необходимость вывода ПНА в ремонт</label>
                        <div class="col-md-3 h-flex">
                            <input  id="needOutputToRepairPna"
                                    name="needOutputToRepairPna"
                                    type="checkbox"
                                    v-model="model.needOutputToRepairPna"
                                    :disabled="readOnly"
                                    tabindex="2"
                                    class="k-checkbox" />
                            <label for="needOutputToRepairPna" class="k-checkbox-label">{{ model.needOutputToRepairPna ? 'Да' : 'Нет' }}</label>
                        </div>
                    </div>
                    <div v-if="model.hasPna" class="row form-group ">
                        <label for="hasAvrPna" class="control-label col-md-9 form-label">Наличие АВР ПНА</label>
                        <!-- Выбор только если необходимо выводить ПНА в ремонт -->
                        <div v-if="model.needOutputToRepairPna" class="col-md-3 h-flex">
                            <input  id="hasAvrPna"
                                    name="hasAvrPna"
                                    type="checkbox"
                                    v-model="model.hasAvrPna"
                                    :disabled="readOnly"
                                    tabindex="2"
                                    class="k-checkbox" />
                            <label for="hasAvrPna" class="k-checkbox-label">{{ model.hasAvrPna ? 'Да' : 'Нет' }}</label>
                        </div>
                        <div v-else class="col-md-3 h-flex">
                            <span>Не требуется</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row form-group">
            <label class="control-label col-md-3 form-label">В период планового останова МН</label>
            <div class="col-md-1 h-flex">
                <input  id="isPipelinePlannedShutdown"
                        name="isPipelinePlannedShutdown"
                        type="checkbox"
                        v-model="model.isPipelinePlannedShutdown"
                        :disabled="readOnly"
                        tabindex="2"
                        class="k-checkbox" />
                <label for="isPipelinePlannedShutdown" class="k-checkbox-label">{{ model.isPipelinePlannedShutdown ? 'Да' : 'Нет' }}</label>
            </div>

            <label class="my-label control-label col-md-3">Аварийная готовность (мин)</label>
            <div class="col-md-3">
                <validation-provider name='Аварийная готовность (мин)' rules="required|min_value:1" v-slot="{ errors }" key="emergencyTime" :disabled="!needBaseValidation">
                    <NumericTextBox 
                        name="emergencyTime"
                        v-model.number="model.emergencyTime"
                        :disabled="readOnly"
                        :decimals="0"
                        :format="'# мин'"
                        :min="0"
                        :round="false"
                        :spinners="true"
                        style="width: 100%;"
                        :class="{ 'is-danger': errors.length > 0 }">
                    </NumericTextBox>
                </validation-provider>
            </div>
        </div>

        <div class="row form-group">

            <label class="my-label control-label col-md-3">Время производства работ (МСК)</label>
            <div class="col-md-9">
                <validation-provider name='Время производства работ (МСК)' rules="required|minLength:1" v-slot="{ errors }" :disabled="!needBaseValidation">
                    <permit-time-period-list
                        v-model="model.timePeriods"
                        :readOnly="readOnly"
                        :class="{ 'is-danger': errors.length > 0 }"
                        style="width: 100%; max-height: 200px;">
                    </permit-time-period-list>
                </validation-provider>
            </div>

        </div>

        <div class="row form-group">

            <label class="my-label control-label col-md-3">Объект производства работ НПС (КП), км</label>
            <div class="col-md-9">
                <validation-provider name='Объект производства работ НПС (КП), км' rules="required|minLength:1" v-slot="{ errors }" :disabled="!needBaseValidation">
                    <permit-object-list
                        v-model="model.permitObjects"
                        :readOnly="readOnly"
                        :class="{ 'is-danger': errors.length > 0 }">
                    </permit-object-list>
                </validation-provider>
            </div>

        </div>

        <div class="row form-group">
            <label class="my-label control-label col-md-3">Краткое описание выполняемых работ (для табличной части разрешения)</label>
            <div class="col-md-9">
                <validation-provider name='Описание' rules="required" v-slot="{ errors }" :disabled="!needBaseValidation">
                    <textarea name="description"
                            rows="3" cols="1"
                            v-model="model.description"
                            :disabled="readOnly"
                            tabindex="1"
                            class="k-textarea"
                            style="resize: vertical; overflow: auto; width: 100%;"
                            :class="{ 'is-danger': errors.length > 0 }"></textarea>
                </validation-provider>
            </div>
        </div>

        <div class="row form-group">
            <label class="control-label col-md-3 form-label">Полное описание выполняемых работ (для текста запроса в разрешении, если не указывать - будет использоваться краткое описание)</label>
            <div class="col-md-9">
                <textarea name="fullDescription"
                        rows="3" cols="1"
                        v-model="model.fullDescription"
                        tabindex="1"
                        class="k-textarea"
                        :disabled="readOnly"
                        style="resize: vertical; overflow: auto; width: 100%;"></textarea>
            </div>
        </div>

        <div class="row form-group">

            <label class="my-label control-label col-md-3">Дата разрешения</label>
            <div class="col-md-3">
                <validation-provider name='Дата разрешения' rules="required" v-slot="{ errors }" :disabled="!needBaseValidation">
                    <kendo-datepicker 
                        v-model="model.date"
                        :readonly="readOnly"
                        :class="{ 'is-danger': errors.length > 0, 'k-state-disabled': readOnly }"
                        style="width: 100%;">
                    </kendo-datepicker>
                </validation-provider>
            </div>

            <label class="my-label control-label col-md-3">Номер разрешения</label>
            <div class="col-md-3">
                <!-- <validation-provider name='Номер разрешения' rules="required" v-slot="{ errors }">
                    <input  name="number" 
                            v-model="model.number"
                            :disabled="readOnly"
                            class="k-textbox"
                            style="width: 100%;"
                            tabindex="0" 
                            :class="{ 'is-danger': needBaseValidation && errors.length > 0 }"/>
                </validation-provider> -->
                <span>{{ model.number ? model.number : 'Не присвоен' }}</span>
            </div>

        </div>

        <div class="row form-group">
            <label class="my-label control-label col-md-3">Статус разрешения</label>
            <div class="col-md-3">
                <span>{{ model.status != null ? model.status.DisplayName : '' }}</span>
            </div>
        </div>

    </div>

</template>

<script>

import Vue from 'vue';
import PermitTimePeriodList from '@/components/permit/time-period/list';
import PermitObjectList from '@/components/permit/object/list';
import PermitTemplateEditor from '@/components/permitTemplate/permit-template-editor';
import PermitTemplateSelectDialog from '@/components/permitTemplate/permit-template-select-dialog'; 
import FileUploadButton from '@/components/file/file-upload-button';
import File from '@/components/file/file';
import Dropdownlist from '@/components/shared/dropdownlist';
import Group from '@/components/shared/group';
import { NumericTextBox } from '@progress/kendo-vue-inputs';

export default {
    name: 'permit-editor-main-page',
    components: {
        PermitTimePeriodList,
        PermitObjectList,
        FileUploadButton,
        File,
        Dropdownlist,
        NumericTextBox,
        Group,
    },    
    props: {
        value: { type: Object, required: true },
        branches: { type: Array, required: true },
        departments: { type: Array, required: true },
        statuses: { type: Array, required: true },
        equipmentTypes: { type: Array, required: true },
        workTypes: { type: Array, required: true },
        readOnly: { type: Boolean, default: true },
        needSaveValidation: { type: Boolean, required: true },
        needBaseValidation: { type: Boolean, required: true },
    },
    watch: {
        value(newValue) {
            this.model = newValue;
        }
    },
    computed: {
        isDraft() {
            return this.model == null || this.model.status == null || this.model.status.Name == 'Draft';
        },
    },
    data() {
        return {
            model: this.value,
            filters: [ 
                /application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document/,
            ],
        };
    },
    methods: {
        branchChanged() {
            this.$emit('branchChanged');
        },

        onPermitTemplateSelect() {
            let actions = [
                { key: 'YES_KEY', text: 'Да, выбрать шаблон', icon: null },
                { key: 'NO_KEY', text: 'Отмена', icon: null },
            ];
            this.$dialogs.requestAction({ 
                    title: 'Внимание', 
                    message: 'Выбор шаблона разрешения изменит некоторые данные на данные шаблона! Вы действительно хотите выбрать шаблон разрешения из каталога типовых работ?', 
                    actions: actions, 
                    defaultActionKey: 'YES_KEY', 
                    icon: 'question' })
                .then(key => {
                    if(key == 'YES_KEY') {
                        this.$modals.open({
                            component: PermitTemplateSelectDialog,
                            props: {
                                branchId: this.model.branch != null ? this.model.branch.Id : null,
                                departmentId: this.model.department != null ? this.model.department.Id : null,
                            },
                            onClose: permitTemplate => {
                                //выбран шаблон, в принципе он уже загружен, но мы передадим Id
                                this.$emit('permitTemplateChanged', permitTemplate.Id);
                            },
                        });
                    }
                });
        },

        onPermitTemplateReload() {
            let actions = [
                { key: 'YES_KEY', text: 'Да, повторно применить шаблон', icon: null },
                { key: 'NO_KEY', text: 'Отмена', icon: null },
            ];
            this.$dialogs.requestAction({ 
                    title: 'Внимание', 
                    message: 'Повторное применение шаблона разрешения изменит некоторые данные на данные шаблона! Вы действительно хотите повторно применить шаблон разрешения?', 
                    actions: actions, 
                    defaultActionKey: 'YES_KEY', 
                    icon: 'question' })
                .then(key => {
                    if(key == 'YES_KEY') {
                        if(this.model.permitTemplate != null) {
                            this.$emit('permitTemplateChanged', this.model.permitTemplate.Id);
                        }
                    }
                });
        },

        onPermitTemplateEdit() {
            if(this.model.permitTemplate == null) return;
            console.log(this.model.permitTemplate);
            this.$modals.open({
                component: PermitTemplateEditor,
                props: {
                    id: this.model.permitTemplate.Id,
                    catalogItemId: this.model.permitTemplate.CatalogItemId,
                    permitTemplateCatalogId: this.model.permitTemplate.PermitTemplateCatalog.Id,
                },
                onClose: permitTemplate => {
                    //отредактировали шаблон и сохранили его
                    //запрос на повторное применение данных шаблона
                    let actions = [
                        { key: 'YES_KEY', text: 'Да, повторно применить шаблон', icon: null },
                        { key: 'NO_KEY', text: 'Отмена', icon: null },
                    ];
                    this.$dialogs.requestAction({ 
                            title: 'Шаблон разрешения на выполнение типовой работы был изменен', 
                            message: 'Вы хотите повторно применить шаблон разрешения? Повторное применение шаблона разрешения изменит некоторые данные на данные шаблона!', 
                            actions: actions, 
                            defaultActionKey: 'YES_KEY', 
                            icon: 'question' })
                        .then(key => {
                            if(key == 'YES_KEY') {
                                if(this.model.permitTemplate != null) {
                                    this.$emit('permitTemplateChanged', this.model.permitTemplate.Id);
                                }
                            }
                        });
                },
            });
        },

        onFileUpload({ file, completed }) {
            let dotIndex = file.name.lastIndexOf('.');
            let fileName = dotIndex == -1 ? file.name : file.name.substring(0, dotIndex);
            let fileExtension = dotIndex == -1 ? null : file.name.substring(dotIndex);

            this.model.permitFile = {
                Id: file.id,
                Name: fileName,
                Extension: fileExtension,
                Size: file.size,
                Content: file.content,
                IsNew: true,
            };

            completed();
        },

        onFileRename() {
            this.$dialogs.requestString({ title: 'Переименование файла', message: `Переименовать файл '${this.model.permitFile.Name}' в`, value: this.model.permitFile.Name })
                .then(newName => {
                    if(newName == null || newName == "" || newName === this.model.permitFile.Name) return;
                    this.model.permitFile.Name = newName;
                });                
        },

        onFileRemove() {
            this.model.permitFile = null;
        },

        onFileReplace({ newFile, completed }) {
            this.onFileUpload({ file: newFile, completed })
        },
    },
}

</script>

<style lang="scss" scoped>

.my-label {
    text-align: right;
}

</style>