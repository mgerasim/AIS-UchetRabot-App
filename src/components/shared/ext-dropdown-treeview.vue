<template>

<div>
    <kendo-dropdownlist ref="dropdown"
                        :id="'dropdown_' + uid"
                        @open="onOpen">
    </kendo-dropdownlist>
    <div v-show="treeviewVisible">
        <kendo-treeview ref="treeview"
                        :id="'treeview_' + uid"
                        :data-source="dataSource"
                        :data-text-field="dataTextField"
                        :checkboxes="true"
                        @check="onCheck"
                        @select="onSelect"
                        :style="treeviewStyle"
                        v-on-clickaway="away">
        </kendo-treeview>
    </div>
</div>

</template>

<script>

import Vue from 'vue';
import { mixin as clickaway } from 'vue-clickaway';

export default {
    name: 'ext-dropdown-treeview',
    props: {
        dataSource: { type: Array, required: true },
        dataTextField: { type: String, default: 'text' },
        dataValueField: { type: String },
        closeOnSelect: { type: Boolean, default: false },
        defaultLabel: { type: String, required: false },
    },
    mixins: [ clickaway ],
    computed: {
        treeviewStyle() {
            let style = {
                'border': "1px solid #ccc",
                'position': "absolute",
                'border-radius': "4px",
                'box-shadow': "0 5px 10px rgba(0, 0, 0, 0.2)",
                "background-color": this.$refs.dropdown != null ? this.$refs.dropdown.kendoWidget().list.css("background-color") : "white",
                'z-index': 10000,
                'padding-right': '16px',
            };

            return  style;
        },
    },
    data() {
        return {
            uid: new Date().getTime(),
            treeviewVisible: false,
            checkedValues: [],
            text: '',
        };
    },
    methods: {
        onOpen(e) {
            e.preventDefault();
            if(!this.treeviewVisible) {
                setTimeout(() => {
                    //this.count++;
                    this.treeviewVisible = true;
                }, 100);
            }
            this.$refs.dropdown.kendoWidget().close();
        },

        onSelect(e) {
            e.preventDefault();  
        },

        onCheck(e) {
            let dataItem = this.$refs.treeview.kendoWidget().dataItem(e.node);
            if(dataItem.checked) {
                if(this.dataValueField != undefined) {
                    this.checkedValues.push(dataItem[this.dataValueField]);
                } 
                else {
                    this.checkedValues.push(dataItem);
                }
            } 
            else {
                if(this.dataValueField != undefined) {
                    let index = this.checkedValues.findIndex(p => p == dataItem[this.dataValueField]);
                    if(index > -1) this.checkedValues.splice(index, 1);
                }
                else {
                    let index = this.checkedValues.findIndex(p => p.uid == dataItem.uid);
                    if(index > -1) this.checkedValues.splice(index, 1);
                }
            }

            if(this.dataValueField != undefined) {
                let text = [...this.$refs.treeview.kendoWidget().items()]
                    .map(p => this.$refs.treeview.kendoWidget().dataItem(p))
                    .filter(p => this.checkedValues.some(q => q == p[this.dataValueField]))
                    .map(p => p[this.dataTextField])
                    .reduce((accumulator, currentValue) => {
                        return `${accumulator}${accumulator != '' ? ', ' : ''}${currentValue}`;
                    }, '');
                text = text == '' ? this.defaultLabel : text;
                this.$refs.dropdown.kendoWidget().text(text);
                this.$refs.dropdown.kendoWidget().wrapper[0].title = text;
            }
            else {
                let text = [...this.$refs.treeview.kendoWidget().items()]
                    .map(p => this.$refs.treeview.kendoWidget().dataItem(p))
                    .filter(p => this.checkedValues.some(q => q.uid == p.uid))
                    .map(p => p[this.dataTextField])
                    .reduce((accumulator, currentValue) => {
                        return `${accumulator}${accumulator != '' ? ', ' : ''}${currentValue}`;
                    }, '');
                this.$refs.dropdown.kendoWidget().text(text);
                this.$refs.dropdown.kendoWidget().wrapper[0].title = text;
            }

            this.$emit('select', this.checkedValues);
        },

        away() {
            if(this.treeviewVisible) {
                this.treeviewVisible = false;
            }
        },
    },
    created() {
        Vue.nextTick(() => {
            this.$refs.treeview.kendoWidget().wrapper[0].style.padding = 0;
            let element = this.$refs.dropdown.kendoWidget().wrapper[0].querySelector('span.k-input');
            element.style.display = 'inline';
            this.$refs.dropdown.kendoWidget().text(this.defaultLabel);
            this.$refs.dropdown.kendoWidget().wrapper[0].title = this.defaultLabel;
        });
    },
}

</script>

<style scoped lang="scss">

</style>