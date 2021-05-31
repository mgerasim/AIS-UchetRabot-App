<template>
    <kendo-dropdownlist
        ref="dropdownlist"
        v-on="listeners"
        v-bind="attrs"
        @select="onSelect"
        :data-value-field="dataValueField"
        :value="selectedKey">
    </kendo-dropdownlist>
</template>

<script>

import Vue from 'vue';

export default {
    name: 'dropdownlist',
    props: [
        'value',
        'dataValueField',
    ],
    watch: {
        value(newValue) {
            if(newValue == null) {
                this.$refs.dropdownlist.kendoWidget().select(p => p[this.dataValueField] == null);
                Vue.nextTick(() => {
                    this.$refs.dropdownlist.kendoWidget().select(p => p[this.dataValueField] == null);
                    this.$refs.dropdownlist.kendoWidget().refresh();
                });
            } else {
                this.$refs.dropdownlist.kendoWidget().select(p => p[this.dataValueField] == newValue[this.dataValueField]);
                Vue.nextTick(() => {
                    this.$refs.dropdownlist.kendoWidget().select(p => p[this.dataValueField] == newValue[this.dataValueField]);
                    this.$refs.dropdownlist.kendoWidget().refresh();
                });
            }
        },
    },
    computed: {
        listeners() {
            const { input, ...listeners } = this.$listeners;
            return listeners;
        },

        attrs() {
            const { value, ...attrs } = this.$attrs;
            return attrs;
        },
        
        selectedKey() {
            if(this.value == null) return null;
            return this.value[this.dataValueField];
        },
    },
    methods: {
        onSelect(event) {
            this.$emit('input', event.dataItem);
        },
    },
}

</script>

<style lang="scss" scoped>

</style>