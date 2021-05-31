<template>
    <div @click="onFilesSelectClick" ref='uploadButton' :disabled="busy">
        <slot></slot>
        <input type="file" ref="attachments" name="attachments" hidden :multiple="multiple" @change="onFilesSelect($event)" />
    </div>
</template>

<script>

    import Guid from "@/core/helpers/guid";
    import Base64 from "@/core/helpers/base64";

    export default {
        name: 'file-upload-button',
        props: [
            'filters', // [ /image\/*/, /application\/pdf/ ]
            'multiple',
        ],
        data() {
            return {
                title: "Загрузить файл(-ы)",
                busy: false,
            };
        },  
        methods: {
            onFilesSelectClick(e) {
                this.$refs.attachments.click();
            },

            onFilesSelect(e) {
                var files = e.target.files;
                if (files) {
                    this.busy = true;
                    for (const file of files) {
                        if(this.isAvailableForDownload(file)) this.fileLoad(file);
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

                this.$emit('upload', newFile);
            },

            isAvailableForDownload(file) {
                if(this.filters == undefined || this.filters.length == 0) return true;

                for(const filter of this.filters) {
                    if(file.type.match(filter)) return true; 
                }

                return false;

                // if(file.type.match(/image.*/)) return true;
                // if(file.type.match(/application\/pdf/)) return true;
                // return false;
            },

        },

    }
</script>

<style scoped>

</style>