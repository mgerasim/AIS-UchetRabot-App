<template>

<div class="file-container" @mouseover="showActions = true" @mouseout="showActions = false">
    <a href="#" @click.prevent="onOpen" ref="file">
        <div class="file-description">
            <fa class="file-icon" :icon="icon" size="sm" />
            <span class="file-name">{{ fileTitle }}</span>
            <span class="file-size">({{ formattedSize }})</span>
        </div>
    </a>
    <b-popover :target="getPopoverRef" triggers="hover" delay="0" placement="topright" :no-fade="true" boundary="viewport">
        <template slot="title"><span class="header">Создан</span></template>
            <div v-if="file.IsNew == true">Файл еще не сохранен</div>
            <div v-if="file.IsNew == undefined || file.IsNew == false">
                {{ file.CreateUser != null ? file.CreateUser.DisplayName : '' }} <br>
                {{ file.CreateDateUtc != null ? formatDateTime(file.CreateDateUtc) : '' }}
            </div>
    </b-popover>            
    <div class="file-actions" :style="{ display: showActions ? 'inline' : 'none' }">
        <button v-if="file.IsNew == undefined || file.IsNew == false" class="btn btn-link file-action-open" @click="onOpen" title="Просмотреть">
            <fa icon="eye" size="sm" />
        </button>
        <button v-if="file.IsNew == undefined || file.IsNew == false" class="btn btn-link file-action-download" @click="onDownload" title="Скачать">
            <fa icon="download" size="sm" />
        </button>
        <file-upload-button v-if="!readonly" class="btn btn-link file-action-upload" ref='replaceButton' 
            @upload="onReplace" title="Заменить" :filters="filters" :multiple="false">
            <fa icon="upload" size="sm" />
        </file-upload-button>
        <button v-if="!readonly" class="btn btn-link file-action-rename" @click="onRename" title="Переименовать">
            <fa icon="italic" size="sm" />
        </button>
        <button v-if="!readonly" class="btn btn-link file-action-delete" @click="onRemove" title="Удалить">
            <fa icon="trash" size="sm" />
        </button>
    </div>
</div>

</template>

<script>
import FileUploadButton from '@/components/file/file-upload-button';
import moment from 'moment';
import axios from 'axios';
import FileHelper from '@/core/helpers/file-helper';

export default {
    name: 'new-file',
    components: {
        FileUploadButton,
    },
    props: {
        file: { type: Object, required: true },             //Id, Name, Extension, Size
        readonly: { type: Boolean, default: false },
        filters: { type: Array },                           // [ /image\/*/, /application\/pdf/ ]
        title: { type: String, default: null },
    }, 
    data() {
        return {
            showActions: false,
        };
    },
    computed: {
        fileTitle() {
            if(this.title == null) return this.file.Name + this.file.Extension;
            return this.title + this.file.Extension;
        },
        
        formattedSize() {
            if(this.file == null) return null;
            const size = this.file.Size;
            if(size >= 100000000) return `${Math.round(size / 1000000)} Mb`;
            if(size < 100000000 && size >= 10000000) return `${(size / 1000000).toFixed(1)} Mb`;
            if(size < 10000000 && size >= 1000000) return `${(size / 1000000).toFixed(2)} Mb`;
            if(size < 1000000 && size >= 100000) return `${(size / 1000).toFixed(1)} Kb`;
            return `${(size / 1000).toFixed(2)} Kb`;
        },

        icon() {
            if(this.file == null) return null;
            let ext = this.file.Extension;
            if(ext == undefined) return 'file';
            ext = ext.toLowerCase();

            if(ext == '.pdf') return 'file-pdf';
            if(ext == '.doc' || ext == '.docx') return 'file-word';
            if(ext == '.xls' || ext == '.xlsx') return 'file-excel';
            if(ext == '.jpg' || ext == '.png' || ext == '.bmp') return 'file-image';
            if(ext == '.avi' || ext == '.mpg' || ext == '.mkv') return 'file-video';
            if(ext == '.mp3' || ext == '.wav') return 'file-audio';

            return 'file';
        },
    },
    methods: {
        onDownload() {
            axios.post(`../api/file/getFileResponseById`, { id: this.file.Id }, { responseType: 'blob' })
                .then(response => {
                    FileHelper.openFileFromResponse(window, response, '');
                })
                .catch(error => {
                    console.log(error);
                    alert(error);
                });
            //window.open(`/DownloadFile/${this.file.Id}`, '_blank');
        },

        onOpen() {
            axios.post(`../api/file/getFileResponseById`, { id: this.file.Id }, { responseType: 'blob' })
                .then(response => {
                    FileHelper.openFileFromResponse(window, response, '');
                })
                .catch(error => {
                    console.log(error);
                    alert(error);
                });
            //window.open(`/ShowFile/${this.file.Id}`, '_blank');
        },

        onRename() {
            this.$emit('rename', this.file.Id);
        },

        onRemove() {
            this.$emit('remove', this.file.Id);
        },

        onReplace({ file, completed }) {
            this.$emit('replace', { fileId: this.file.Id, newFile: file, completed: completed });
        },

        getPopoverRef() {
            return this.$refs.file;
        },

        formatDateTime(date) {
            return moment(date).format('DD.MM.YYYY HH:mm');
        },
    },
}
</script>

<style scoped>

.header {
    font-size: 0.9rem;
    font-weight: bold;
}

.file-actions {
    margin-left: 16px;
    padding: 0px 4px;
    background-color: #e7e7e7;
    border-radius: 8px;
}

.file-icon {

}

.file-name {
    margin-left: 4px;
}

.file-description {
    margin-left: 4px;
}

.file-size {
    margin-left: 4px;
    font-size: 0.8em;
    color: #777;
}

.file-container {
    display: flex; 
    flex-flow: rows wrap; 
    line-height: 1.7rem;    
}

.btn {
    margin-left: 4px;
    margin-right: 4px;
    width: 16px;
}

.btn-link {
    padding: 0;
}

</style>