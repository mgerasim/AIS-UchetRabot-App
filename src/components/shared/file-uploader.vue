<template>

    <div class="tn-file-uploader" style="height: 100%;">

        <input type="file" ref="attachments" name="attachments" style="display: none;" @change="_change($event)" />

        <div class='panel panel-default' style='height: 100%;' ref="panel">
            <div class='panel-body' ref="panelBody">
                <ul class='list-inline files'>
                    <li v-for="file in fileArray" :key="file.uid">
                        <div class="file panel panel-default">

                            <div v-if="file.isPreloaded && file.url" class="panel-body">
                                <a :href="file.url" target="_blank" download="">
                                    <div class="file-icon" v-bind:class="file.isPreloaded ? 'text-success' : 'text-danger'">
                                        <fa icon="file-alt" />
                                    </div>
                                    <div :title="file.name" class="file-name">{{ file.name }}</div>
                                </a>
                                <a title="Удалить" class="file-remove" @click="removeFileClickHandler(file)">
                                    <fa icon="times" />
                                </a>
                            </div>

                            <div v-else class="panel-body">
                                <div class="file-icon" v-bind:class="file.isPreloaded ? 'text-success' : 'text-danger'">
                                    <fa icon="file-alt" />
                                </div>
                                <div :title="file.name" class="file-name">{{ file.name }}</div>
                                <a title="Удалить" class="file-remove" @click="removeFileClickHandler(file)">
                                    <fa icon="times" />
                                </a>
                            </div>

                        </div>
                    </li>
                </ul>
            </div>
            <input type='button' ref='selectFilesButton' class='k-button'
                   style='margin-left:15px; margin-bottom:15px;' value='Обзор...'
                   @click="selectFilesButtonClickHandler" />
            <input v-show="showUploadButton" type='button' ref='uploadFilesButton'
                   class='k-button' v-bind:class="fileArray.length > 0 ? '' : 'hide'"
                   style='margin-left:15px; margin-bottom:15px;'
                   value='Загрузить' @click="uploadFilesButtonClickHandler" />
        </div>

    </div>

</template>

<script>

    import Vue from 'vue';

    export default {
        name: 'file-uploader',

        //model: {
        //    prop: 'files',
        //    event: 'change'
        //},

        props: {
            value: {
                default: () => [],
                type: Array
            },
            showUploadButton: {
                default: false,
                type: Boolean
            },
            isMultiple: Boolean
        },

        data() {
            return {
                fileArray: this.value.slice(),
            }
        },

        watch: {
            value: function (newValue) {
                this.fileArray = newValue.slice();
            },
        },

        computed: {
        },

        methods: {

            _change(e) {
                var files = e.target.files;
                if (files) {
                    for (var i = 0, length = files.length; i < length; i++) {
                        this._fileLoad(files[i]);
                    }
                }
            },

            _fileLoad(file) {
                var reader = new FileReader();
                reader.onload = (evt) => {
                    this._fileLoaded(file, evt);
                };
                reader.readAsArrayBuffer(file);
            },

            _fileLoaded(file, e) {
                var newFile = {
                    uid: this._newGuid(),
                    name: file.name,
                    content: this._arrayToBase64(e.target.result),
                    isPreloaded: false
                };

                if (!this.isMultiple) {
                    //не мультивыбор
                    this.fileArray = [];
                }

                this.fileArray.push(newFile);
                this.$emit('fileLoaded', newFile);
                this.$emit('input', this.fileArray);
            },

            _fileRemove: function (file) {
                if (!file) return;

                var ind = this.fileArray.indexOf(file);
                if (ind > -1) this.fileArray.splice(ind, 1);

                this.$emit('fileRemoved', file.uid);
                this.$emit('input', this.fileArray);
            },

            disable: function () {
                this.$refs.selectFilesButton.addClass('k-state-disabled');
                this.$refs.selectFilesButton.attr('disabled', 'disabled');
                this.$refs.uploadFilesButton.addClass('k-state-disabled');
                this.$refs.uploadFilesButton.attr('disabled', 'disabled');
                this.$el.find('.file-remove').addClass('hide');
            },

            enable: function () {
                this.$refs.selectFilesButton.removeClass('k-state-disabled');
                this.$refs.selectFilesButton.removeAttr('disabled');
                this.$refs.uploadFilesButton.removeClass('k-state-disabled');
                this.$refs.uploadFilesButton.removeAttr('disabled');
                this.$el.find('.file-remove').removeClass('hide');
            },

            _newGuid: function () {
                var guid = (this._s4() + this._s4() + "-" + this._s4() + "-4" + this._s4().substr(0, 3) + "-" + this._s4() + "-" + this._s4() + this._s4() + this._s4()).toLowerCase();
                return guid;
            },

            _arrayToBase64: function (buffer) {
                var binary = '';
                var bytes = new Uint8Array(buffer);
                for (var i = 0, length = bytes.byteLength; i < length; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                return window.btoa(binary);
            },

            selectFilesButtonClickHandler() {
                this.$refs.attachments.click();
            },

            uploadFilesButtonClickHandler() {
                this.$emit('tnFilesUpload');
            },

            clear: function () {
                this.$refs.attachments.value = null;
                this.fileArray.splice(0, this.fileArray.length);
                this.$emit('input', this.fileArray);
            },

            _s4() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            },

            removeFileClickHandler(file) {
                this._fileRemove(file);

                var elementVal = this.$refs.attachments.value;
                var elementValArr = elementVal.split(',');
                for (var index = 0; index < elementValArr.length; index++) {
                    if (elementValArr[index].indexOf(file.name) !== -1) {
                        elementValArr.splice(index, 1);
                        elementVal = elementValArr.join(',');
                        this.$refs.attachments.value = elementVal;
                        break;
                    }
                }

                return false;
            },

        },

    }

</script>

<style scoped lang="scss">

    .tn-file-uploader .files .file {
        position: relative;
        overflow: hidden;
        width: 99px;
        height: 80px;
        padding: 5px;
        text-align: center;
    }

    .tn-file-uploader .files .file .panel-body {
        padding: 3px;
    }

    .tn-file-uploader .files .file .file-icon {
        font-size: 32px;
    }

    .tn-file-uploader .files .file .file-name {
        overflow: hidden;
        font-size: 10px;
        text-overflow: ellipsis;
    }

    .tn-file-uploader .files .file .file-remove {
        position: absolute;
        top: 2px;
        right: 5px;
        color: #ff6f6f;
        cursor: pointer;
    }

    .file-remove :hover {
        color: #ff0f0f;
    }

</style>