<template>

<button @click="onFilesSelectClick" ref='uploadButton' :disabled="busy" :title="_title">
    <b-spinner v-if="busy" small type="grow"></b-spinner>
    <slot></slot>
    <input type="file" ref="attachments" name="attachments" hidden :multiple="multiple" @change="onFilesSelect($event)" />
</button>

</template>

<script>

import Guid from "@/core/helpers/guid";
import Base64 from "@/core/helpers/base64";

export default {
    name: 'file-upload-button',
    props: {
        'filters': {
            type: Array,
            default: function() { return []; },
        }, // [ /image\/*/, /application\/pdf/ ]
        'multiple': {
            type: Boolean,
            default: false,
        },
        'title': {
            type: String,
            default: null,
        },
    },
    data() {
        return {
            counter: 0,
            busy: false,
        };
    },  
    computed: {
        _title() {
            return !this.title ? (this.multiple ? "Загрузить файл(-ы)" : "Загрузить файл") : this.title;
        },
    },
    methods: {
        onFilesSelectClick(e) {
            this.$refs.attachments.click();
        },

        onFilesSelect(e) {
            var files = e.target.files;
            if (files) {
                this.counter = 0;
                this.busy = true;
                for (const file of files) {
                    if(this.isAvailableForDownload(file)) {
                        this.counter++;
                        this.fileLoad(file);
                    }
                }
                this.busy = false;
                this.$refs.attachments.value = null;
            }
        },

        fileLoad(file) {
            var reader = new FileReader();
            reader.onload = evt => {
                this.fileLoaded(file, evt);
            };
            reader.readAsArrayBuffer(file);
        },

        fileLoaded(file, e) {
            var newFile = {
                id: Guid.generate(),
                name: file.name,
                size: file.size,
                content: Base64.encodeArray(e.target.result),
            };

            this.$emit('upload', { file: newFile, completed: () => {
                if(this.counter > 0) {
                    this.counter--;
                    if(this.counter == 0) this.busy = false;
                }
            }});
        },

        isAvailableForDownload(file) {
            if(this.filters == undefined || this.filters.length == 0) return true;
            return this.filters.some((value, index, array) => file.type.match(value));
        },

    },

}

</script>

<style scoped>

</style>