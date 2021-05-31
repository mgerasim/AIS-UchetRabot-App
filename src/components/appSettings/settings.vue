<template>

<div style="padding: 16px;">

    <div class="row form-group">
        <label for="documentsStoragePath" class="control-label col-md-3">Расположение файлового хранилища документов</label>
        <div class="col-md-9">
            <input name="documentsStoragePath" v-model="model.documentsStoragePath" class="k-textbox full-width" />
        </div>
    </div>

    <div class="row form-group">
        <label for="useDocumentsStorage" class="control-label col-md-3">Использовать файловое хранилище документов</label>
        <div class="col-md-9 h-flex">
            <input  name="useDocumentsStorage"
                    type="checkbox"
                    v-model="model.useDocumentsStorage"
                    tabindex="2"
                    class="k-checkbox" />
            <label for="extended" class="k-checkbox-label">{{ model.useDocumentsStorage ? 'Да' : 'Нет' }}</label>
        </div>
    </div>





    <div class="row form-group">
        <label for="emailHost" class="control-label col-md-3">Почтовый сервер</label>
        <div class="col-md-9">
            <input name="emailHost" v-model="model.emailHost" class="k-textbox full-width" />
        </div>
    </div>

    <div class="row form-group">
        <label for="emailAccountDomain" class="control-label col-md-3">Домен почтового аккаунта</label>
        <div class="col-md-9">
            <input name="emailAccountDomain" v-model="model.emailAccountDomain" class="k-textbox full-width" />
        </div>
    </div>

    <div class="row form-group">
        <label for="emailAccountName" class="control-label col-md-3">Имя почтового аккаунта</label>
        <div class="col-md-9">
            <input name="emailAccountName" v-model="model.emailAccountName" class="k-textbox full-width" />
        </div>
    </div>

    <div class="row form-group">
        <label for="emailAccountPassword" class="control-label col-md-3">Пароль почтового аккаунта</label>
        <div class="col-md-9">
            <input name="emailAccountPassword" type="password" v-model="model.emailAccountPassword" class="k-textbox full-width" />
        </div>
    </div>






    <div class="row form-group">
        <label for="flexiServiceHost" class="control-label col-md-3">FlexiCapture Host</label>
        <div class="col-md-9">
            <input name="flexiServiceHost" v-model="model.flexiServiceHost" class="k-textbox full-width" />
        </div>
    </div>

    <div class="row form-group">
        <label for="flexiServiceAccountDomain" class="control-label col-md-3">Домен аккаунта FlexiCapture</label>
        <div class="col-md-9">
            <input name="flexiServiceAccountDomain" v-model="model.flexiServiceAccountDomain" class="k-textbox full-width" />
        </div>
    </div>

    <div class="row form-group">
        <label for="flexiServiceAccountName" class="control-label col-md-3">Имя аккаунта FlexiCapture</label>
        <div class="col-md-9">
            <input name="flexiServiceAccountName" v-model="model.flexiServiceAccountName" class="k-textbox full-width" />
        </div>
    </div>

    <div class="row form-group">
        <label for="flexiServiceAccountPassword" class="control-label col-md-3">Пароль аккаунта FlexiCapture</label>
        <div class="col-md-9">
            <input name="flexiServiceAccountPassword" type="password" v-model="model.flexiServiceAccountPassword" class="k-textbox full-width" />
        </div>
    </div>





    <div class="row form-group">
        <label for="file" class="control-label col-md-3">Файл с заголовочной частью разрешения</label>
        <div class="col-md-9 h-flex">
            <div style="flex: 1 1 100%; win-width: 0;">
                <file   v-if="model.permitTemplateHeaderFile != null" 
                        :file="model.permitTemplateHeaderFile"
                        @rename="onHeaderFileRename"
                        @remove="onHeaderFileRemove"
                        @replace="onHeaderFileReplace"></file>
            </div>
            <div style="flex: 0 0 auto;">
                <file-upload-button v-if="model.permitTemplateHeaderFile == null" 
                                    class="k-button k-primary" 
                                    :filters="filters" 
                                    :multiple="false" 
                                    title="Загрузить"
                                    @upload="onHeaderFileUpload">
                    <fa icon="download"></fa>&nbsp;Загрузить
                </file-upload-button>
            </div>
        </div>
    </div>

    <div class="row form-group">
        <label for="file" class="control-label col-md-3">Файл с подвальной частью разрешения</label>
        <div class="col-md-9 h-flex">
            <div style="flex: 1 1 100%; win-width: 0;">
                <file   v-if="model.permitTemplateFooterFile != null" 
                        :file="model.permitTemplateFooterFile"
                        @rename="onFooterFileRename"
                        @remove="onFooterFileRemove"
                        @replace="onFooterFileReplace"></file>
            </div>
            <div style="flex: 0 0 auto;">
                <file-upload-button v-if="model.permitTemplateFooterFile == null" 
                                    class="k-button k-primary" 
                                    :filters="filters" 
                                    :multiple="false" 
                                    title="Загрузить"
                                    @upload="onFooterFileUpload">
                    <fa icon="download"></fa>&nbsp;Загрузить
                </file-upload-button>
            </div>
        </div>
    </div>

    <div class="row form-group">
        <label for="file" class="control-label col-md-3">Шаблон Приложения 1 (маскирование МПСА)</label>
        <div class="col-md-9 h-flex">
            <div style="flex: 1 1 100%; win-width: 0;">
                <file   v-if="model.permitMpsaAttachmentFile != null" 
                        :file="model.permitMpsaAttachmentFile"
                        @rename="onMpsaAttachmentFileRename"
                        @remove="onMpsaAttachmentFileRemove"
                        @replace="onMpsaAttachmentFileReplace"></file>
            </div>
            <div style="flex: 0 0 auto;">
                <file-upload-button v-if="model.permitMpsaAttachmentFile == null" 
                                    class="k-button k-primary" 
                                    :filters="excelFilters" 
                                    :multiple="false" 
                                    title="Загрузить"
                                    @upload="onMpsaAttachmentFileUpload">
                    <fa icon="download"></fa>&nbsp;Загрузить
                </file-upload-button>
            </div>
        </div>
    </div>

    <div class="row form-group">
        <label for="file" class="control-label col-md-3">Шаблон Приложения 2 (маскирование ЕСУ)</label>
        <div class="col-md-9 h-flex">
            <div style="flex: 1 1 100%; win-width: 0;">
                <file   v-if="model.permitEsuAttachmentFile != null" 
                        :file="model.permitEsuAttachmentFile"
                        @rename="onEsuAttachmentFileRename"
                        @remove="onEsuAttachmentFileRemove"
                        @replace="onEsuAttachmentFileReplace"></file>
            </div>
            <div style="flex: 0 0 auto;">
                <file-upload-button v-if="model.permitEsuAttachmentFile == null" 
                                    class="k-button k-primary" 
                                    :filters="excelFilters" 
                                    :multiple="false" 
                                    title="Загрузить"
                                    @upload="onEsuAttachmentFileUpload">
                    <fa icon="download"></fa>&nbsp;Загрузить
                </file-upload-button>
            </div>
        </div>
    </div>

    <div class="row form-group">
        <label for="file" class="control-label col-md-3">Шаблон Приложения 3 (маскирование ЦСПА)</label>
        <div class="col-md-9 h-flex">
            <div style="flex: 1 1 100%; win-width: 0;">
                <file   v-if="model.permitCspaAttachmentFile != null" 
                        :file="model.permitCspaAttachmentFile"
                        @rename="onCspaAttachmentFileRename"
                        @remove="onCspaAttachmentFileRemove"
                        @replace="onCspaAttachmentFileReplace"></file>
            </div>
            <div style="flex: 0 0 auto;">
                <file-upload-button v-if="model.permitCspaAttachmentFile == null" 
                                    class="k-button k-primary" 
                                    :filters="excelFilters" 
                                    :multiple="false" 
                                    title="Загрузить"
                                    @upload="onCspaAttachmentFileUpload">
                    <fa icon="download"></fa>&nbsp;Загрузить
                </file-upload-button>
            </div>
        </div>
    </div>

    <button class="k-button k-primary" @click="updateSettings">
        <fa icon="save"></fa>&nbsp;Сохранить
    </button>

</div>

</template>

<script>

import axios from 'axios';
import File from '@/components/file/file';
import FileUploadButton from '@/components/file/file-upload-button';

export default {
    name: 'settings',
    components: {
        File,
        FileUploadButton,
    },
    data() {
        return {
            model: {
                documentsStoragePath: null,
                useDocumentsStorage: null,

                emailHost: null,
                emailAccountDomain: null,
                emailAccountName: null,
                emailAccountPassword: null,

                flexiServiceHost: null,
                flexiServiceAccountDomain: null,
                flexiServiceAccountName: null,
                flexiServiceAccountPassword: null,

                permitTemplateHeaderFile: null,
                permitTemplateFooterFile: null,

                permitMpsaAttachmentFile: null,
                permitEsuAttachmentFile: null,
                permitCspaAttachmentFile: null,
            },
            filters: [ 
//                /application\/msword/, 
                /application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document/,
            ],
            excelFilters: [
//                /application\/vnd\.ms-excel/,
                /application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet/, 
            ],
        };
    },
    methods: {
        loadSettings() {
            axios.post('../api/appSettings/getSettings')
                .then(response => {
                    if(response.data.HasError) throw response.data.ErrorMessage;
                    let settings = response.data.Result;
                    this.setModelToView(settings);
                })
                .catch(error => {
                    console.log(error);
                    alert(`Ошибка при получении настроек приложения: ${error}`);
                });
        },

        setModelToView(settings) {
            this.model.documentsStoragePath = settings.DocumentsStoragePath;
            this.model.useDocumentsStorage = settings.UseDocumentsStorage;

            this.model.emailHost = settings.EmailHost;
            this.model.emailAccountDomain = settings.EmailAccountDomain;
            this.model.emailAccountName = settings.EmailAccountName;
            this.model.emailAccountPassword = settings.EmailAccountPassword;

            this.model.flexiServiceHost = settings.FlexiServiceHost;
            this.model.flexiServiceAccountDomain = settings.FlexiServiceAccountDomain;
            this.model.flexiServiceAccountName = settings.FlexiServiceAccountName;
            this.model.flexiServiceAccountPassword = settings.FlexiServiceAccountPassword;

            this.model.permitTemplateHeaderFile = settings.PermitTemplateHeaderFile;
            this.model.permitTemplateFooterFile = settings.PermitTemplateFooterFile;

            this.model.permitMpsaAttachmentFile = settings.PermitMpsaAttachmentFile;
            this.model.permitEsuAttachmentFile = settings.PermitEsuAttachmentFile;
            this.model.permitCspaAttachmentFile = settings.PermitCspaAttachmentFile;
        },

        getModelFromView() {
            return {
                DocumentsStoragePath: this.model.documentsStoragePath,
                UseDocumentsStorage: this.model.useDocumentsStorage,

                EmailHost: this.model.emailHost,
                EmailAccountDomain: this.model.emailAccountDomain, 
                EmailAccountName: this.model.emailAccountName,
                EmailAccountPassword: this.model.emailAccountPassword,

                FlexiServiceHost: this.model.flexiServiceHost,
                FlexiServiceAccountDomain: this.model.flexiServiceAccountDomain,
                FlexiServiceAccountName: this.model.flexiServiceAccountName,
                FlexiServiceAccountPassword: this.model.flexiServiceAccountPassword,

                PermitTemplateHeaderFile: this.model.permitTemplateHeaderFile,
                PermitTemplateFooterFile: this.model.permitTemplateFooterFile,

                PermitMpsaAttachmentFile: this.model.permitMpsaAttachmentFile,
                PermitEsuAttachmentFile: this.model.permitEsuAttachmentFile,
                PermitCspaAttachmentFile: this.model.permitCspaAttachmentFile,
            };
        },

        updateSettings() {
            axios.post('../api/appSettings/updateSettings', { settings: this.getModelFromView() }, { withCredentials: true })
                .then(response => {
                    if(response.data.HasError) throw response.data.ErrorMessage;
                    let settings = response.data.Result;
                    this.setModelToView(settings);
                })
                .catch(error => {
                    console.log(error);
                    alert(`Ошибка при сохранении настроек приложения: ${error}`);
                });
        },

        createFile(file) {
            let dotIndex = file.name.lastIndexOf('.');
            let fileName = dotIndex == -1 ? file.name : file.name.substring(0, dotIndex);
            let fileExtension = dotIndex == -1 ? null : file.name.substring(dotIndex);

            return {
                Id: file.id,
                Name: fileName,
                Extension: fileExtension,
                Size: file.size,
                Content: file.content,
                IsNew: true,
            };
        },

        renameFile(file) {
            return this.$dialogs.requestString({ title: 'Переименование файла', message: `Переименовать файл '${file.Name}' в`, value: file.Name })
                .then(newName => {
                    if(newName == null || newName == "" || newName === file.Name) return;
                    return Promise.resolve(newName);
                });                
        },






        onHeaderFileUpload({ file, completed }) {
            this.model.permitTemplateHeaderFile = this.createFile(file);
            completed();
        },

        onFooterFileUpload({ file, completed }) {
            this.model.permitTemplateFooterFile = this.createFile(file);
            completed();
        },

        onMpsaAttachmentFileUpload({ file, completed }) {
            this.model.permitMpsaAttachmentFile = this.createFile(file);
            completed();
        },

        onEsuAttachmentFileUpload({ file, completed }) {
            this.model.permitEsuAttachmentFile = this.createFile(file);
            completed();
        },

        onCspaAttachmentFileUpload({ file, completed }) {
            this.model.permitCspaAttachmentFile = this.createFile(file);
            completed();
        },





        onHeaderFileRename() {
            this.renameFile(this.model.permitTemplateHeaderFile)
                .then(newName => this.model.permitTemplateHeaderFile.Name = newName);
        },

        onFooterFileRename() {
            this.renameFile(this.model.permitTemplateFooterFile)
                .then(newName => this.model.permitTemplateFooterFile.Name = newName);
        },

        onMpsaAttachmentFileRename() {
            this.renameFile(this.model.permitMpsaAttachmentFile)
                .then(newName => this.model.permitMpsaAttachmentFile.Name = newName);
        },

        onEsuAttachmentFileRename() {
            this.renameFile(this.model.permitEsuAttachmentFile)
                .then(newName => this.model.permitEsuAttachmentFile.Name = newName);
        },

        onCspaAttachmentFileRename() {
            this.renameFile(this.model.permitCspaAttachmentFile)
                .then(newName => this.model.permitCspaAttachmentFile.Name = newName);
        },





        onHeaderFileRemove() {
            this.model.permitTemplateHeaderFile = null;
        },

        onFooterFileRemove() {
            this.model.permitTemplateFooterFile = null;
        },

        onMpsaAttachmentFileRemove() {
            this.model.permitMpsaAttachmentFile = null;
        },

        onEsuAttachmentFileRemove() {
            this.model.permitEsuAttachmentFile = null;
        },

        onCspaAttachmentFileRemove() {
            this.model.permitCspaAttachmentFile = null;
        },




        onHeaderFileReplace({ newFile, completed }) {
            this.model.permitTemplateHeaderFile = this.createFile(newFile);
            completed();
        },

        onFooterFileReplace({ newFile, completed }) {
            this.model.permitTemplateFooterFile = this.createFile(newFile);
            completed();
        },

        onMpsaAttachmentFileReplace({ newFile, completed }) {
            this.model.permitMpsaAttachmentFile = this.createFile(newFile);
            completed();
        },

        onEsuAttachmentFileReplace({ newFile, completed }) {
            this.model.permitEsuAttachmentFile = this.createFile(newFile);
            completed();
        },

        onCspaAttachmentFileReplace({ newFile, completed }) {
            this.model.permitCspaAttachmentFile = this.createFile(newFile);
            completed();
        },
    },
    created() {
        this.loadSettings();
    },
}

</script>

<style lang="scss" scoped>

</style>