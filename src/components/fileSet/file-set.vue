
<template>

<div class="v-flex">
    <div v-if="fileSet != null" class="file-list v-flex scroll-y">
        <div v-for="(file, index) in fileSet.Files" :key="index">
            <file :file="file" 
                :readonly="readonly"
                :filters="filters" 
                @rename="onRename"
                @remove="onRemove"
                @replace="onReplace"></file>
        </div>
    </div>
    <div class="file-list-actions">
        <file-upload-button v-show="!readonly && !uploadByExternalCommand" class="btn btn-secondary btn-sm file-action-upload" ref='replaceButton' 
            @upload="onUpload" :filters="filters" :multiple="true">
            <div>
                <fa icon="upload" size="sm" />
                Загрузить
            </div>
        </file-upload-button>
    </div>
</div>

</template>

<script>
import File from '@/components/file/file';
import FileUploadButton from '@/components/file/file-upload-button';
import axios from 'axios';

export default {
    name: 'file-set',
    props: {
        'fileSet': Object,
        'sendToParent': { type: Boolean, default: false },
        'readonly': { type: Boolean, default: false },
        'uploadByExternalCommand': { type: Boolean, default: false },
        'filters': { type: Array, default: function() { return []; } }  // [ /image\/*/, /application\/pdf/ ]
    },
    components: {
        File,
        FileUploadButton,
    },
    data() {
        return {};
    },
    methods: {
        raiseUpload() {
            if(this.readonly || !this.uploadByExternalCommand) return;
            this.$refs.replaceButton.$el.click();
        },

        findFileById(id) {
            return this.fileSet.Files.find(p => p.Id == id);
        },

        findIndexById(id) {
            return this.fileSet.Files.findIndex(p => p.Id == id);
        },

        onRemove(id) {
            let file = this.findFileById(id);
            if(file == null) return;

            let index = this.findIndexById(id);

            let CancelError = () => {};

            this.$dialogs.requestAction({
                title: 'Вы уверены?',
                message: `Вы действительно хотите удалить файл '${file.Name + file.Extension}'?`,
                actions: [  { key: 'confirm-action', text: 'Удалить', icon: 'trash' }, 
                            { key: 'cancel-action', text: 'Отменить' }],
                defaultActionKey: 'confirm-action',
            })
            .then(actionKey => {
                if(actionKey != 'confirm-action') throw new CancelError();

                if(this.sendToParent) {
                    //наверх, родителю, пусть удаляет он
                    this.$emit('remove', id);
                    throw new CancelError();
                }

                let data = { fileSetId: this.fileSet.Id, fileId: id };
                return axios.post(`../api/fileSet/removeFile`, data, { withCredentials: true });
            })
            .then(result => {
                if(result.data.HasError) throw result.data.ErrorMessage;
                this.fileSet.Files.splice(index, 1);
            })
            .catch(error => {
                if(error instanceof CancelError) return;
                console.log(error);
                if(typeof error == 'string') {
                    alert(error);
                } else {
                    alert('Error on file removing.');
                }
            });
        },

        onUpload(file) {
            if(this.sendToParent) {
                //наверх, родителю, пусть загружает он
                this.$emit('upload', file);
            } else {
                let data = { fileSetId: this.fileSet.Id, file: file };
                axios.post(`../api/fileSet/uploadFile`, data, { withCredentials: true })
                    .then(result => {
                        if(result.data.HasError) {
                            console.log(result.data.ErrorMessage);
                            alert(result.data.ErrorMessage);
                        } else {
                            this.fileSet.Files.push(result.data.Result);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        alert('Error on file uploading.');
                    });
            }
        },

        onReplace({ fileId, newFile, completed }) {
            let file = this.findFileById(fileId);
            if(file == null) return;

            let index = this.findIndexById(fileId);

            let CancelError = () => {};

            this.$dialogs.requestAction({
                title: 'Вы уверены?',
                message: `Вы действительно хотите заменить файл '${file.Name + file.Extension}' файлом '${newFile.name}'?`,
                actions: [  { key: 'confirm-action', text: 'Заменить' }, 
                            { key: 'cancel-action', text: 'Отменить' }],
                defaultActionKey: 'confirm-action',
            })
            .then(actionKey => {
                if(actionKey != 'confirm-action') throw new CancelError();

                if(this.sendToParent) {
                    //наверх, родителю, пусть заменяет он
                    this.$emit('replace', { fileId, newFile, completed });
                    throw new CancelError();
                } 

                let data = { fileSetId: this.fileSet.Id, fileId: fileId, newFile: newFile };
                return axios.post(`../api/fileSet/replaceFile`, data, { withCredentials: true });
            })
            .then(result => {
                if(result.data.HasError) throw new CancelError();
                this.fileSet.Files.splice(index, 1, result.data.Result);
            })
            .catch(error => {
                if(error instanceof CancelError) return;
                console.log(error);
                if(typeof error == 'string') {
                    alert(error);
                } else {
                    alert('Error on file replacing.');
                }
            });
        },

        onRename(id) {
            let file = this.findFileById(id);
            if(file == null) return;

            var CancelError = () => {};

            this.$dialogs.requestString({ title: 'Переименование файла', message: `Переименовать файл '${file.Name}' в`, value: file.Name })
                .then(newName => {
                    if(newName == null || newName == "" || newName === file.Name) throw new CancelError();
                    let data = { id: file.Id, name: newName };
                    return axios.post(`../api/fileSet/renameFile`, data, { withCredentials: true });
                })
                .then(result => {
                    if(result.data.HasError) throw result.data.HasError;
                    file.Name = result.data.Result.Name;
                })
                .catch(error => {
                    if(error instanceof CancelError) return;
                    console.log(error);
                    if(typeof error == 'string') {
                        alert(error);
                    } else {
                        alert('Error on file renaming.');
                    }
                });                
        },
    },
}
</script>

<style scoped>

.file-list-actions {
    flex: 0 0 auto;
    margin-top: 8px;
}

.file-list {
    flex: 1 1 100%;
}

</style>