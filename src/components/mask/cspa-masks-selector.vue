<!-- 
    Выбор маскируемых защит ЦСПА
    в диалогах формирования шаблонов и разрешений 
-->

<template>

<div class="v-flex full-size">
    <cspa-mask-catalog-selector
        v-if="!readOnly"
        :selected-items="groupSelectedMasks"
        style="flex: 1; min-height: 0; margin-bottom: 16px; "
        @select="onSelect"
        @unselect="onUnselect">
    </cspa-mask-catalog-selector>
    <div style="margin-bottom: 8px; font-weight: bold;">Выбранные защиты / готовности</div>
    <cspa-mask-simple-list 
        v-if="!readOnly"
        :groupNumber="selectedGroup != null ? selectedGroup.Number : null"
        :items="groupSelectedMaskInfos"
        @unselect="onUnselect"
        style="flex: 1; min-height: 0;"></cspa-mask-simple-list>
    <cspa-mask-simple-grouped-list
        v-if="readOnly" 
        :items="groupsBySystem"
        style="flex: 1; min-height: 0;"></cspa-mask-simple-grouped-list>
</div>

</template>

<script>

import CspaMaskCatalogSelector from '@/components/mask/cspa-mask-catalog-selector';
import CspaMaskSimpleList from '@/components/mask/cspa-mask-simple-list';
import CspaMaskSimpleGroupedList from '@/components/mask/cspa-mask-simple-grouped-list';
import Dropdownlist from '@/components/shared/dropdownlist';

export default {
    name: 'cspa-masks-selector',
    components: {
        CspaMaskCatalogSelector,
        CspaMaskSimpleList,
        CspaMaskSimpleGroupedList,
        Dropdownlist,
    },
    props: {
        readOnly: { type: Boolean, default: true },
        // {[Number, Header, System, Items: [{Mask, Number}]]}
        value: { type: Array, required: true },
    },
    watch: {
        value(newValue) {
            let groups = newValue.filter(p => p.System.Name == this.system);
            let group;
            if(this.selectedGroup == null) {
                group = groups.length > 0 
                            ? groups[0] 
                            : null;
            } else {
                group = groups.find(p => p.Number == this.selectedGroup.Number);
                if(group == null) {
                    group = groups.length > 0 
                                ? groups[0] 
                                : null;
                }
            }
            this.selectedGroup = group; 
        }
    },
    computed: {
        originalSelectedGroup() {
            if(this.value == null || this.system == null || this.selectedGroup == null) return null;
            return this.groupsBySystem.find(p => p.Number == this.selectedGroup.Number);
        },

        groupSelectedMasks() {
            //выбранные маски в зависимости от группы и системы
            let maskGroup = this.originalSelectedGroup;
            if(maskGroup == null) return [];
            return maskGroup.Items.map(p => p.Mask);
        },

        groupSelectedMaskInfos() {
            //выбранные маски в зависимости от группы и системы
            let maskGroup = this.originalSelectedGroup;
            if(maskGroup == null) return [];
            return maskGroup.Items;
        },

        groupsBySystem() {
            //группы по системе
            if(this.value == null || this.system == null) return [];
            let filtered = this.value.filter(p => p.System.Name == this.system);
            return filtered
                .sort((left, right) => {
                    if(left.Number < right.Number) return +1;
                    if(left.Number > right.Number) return -1;
                    return 0;
                })
                .map(p => Object.assign(p, { _t: `${p.Number} из ${filtered.length}` }));
        },
    },
    data() {
        return {
            selectedGroup: this.value != null ? this.value.find(p => p.System.Name == 'CSPA' && p.Number == 1) : null,
            system: 'CSPA',
        };
    },
    methods: {
        onSelect(mask) {
            if(this.groupsBySystem.length == 0) {
                this.selectedGroup = {
                    Number: 1,
                    Header: '',
                    System: { Name: this.system },
                    Items: [],
                };
            }

            let number = this.selectedGroup.Number;
            let max = this.selectedGroup.Items.length > 0 ? Math.max(...this.selectedGroup.Items.map(p => p.Number)) : 0;
            max++;
            let other = this.value.filter(p => p.Number != number || p.System.Name != this.system);
            if(mask instanceof Array) {
                let current = { 
                    Number: number, 
                    Header: this.selectedGroup.Header,
                    System: { Name: this.system }, 
                    Items: [
                        ...this.selectedGroup.Items, 
                        ...mask.filter(m => !this.selectedGroup.Items.some(t => t.Mask.Id == m.Id)).map(q => { 
                                                        return { Mask: q, Number: max++ };
                                                    })
                    ] 
                };
                this.$emit('input', [...other, current]);
            } else {
                let current = { 
                    Number: number, 
                    Header: this.selectedGroup.Header, 
                    System: { Name: this.system },
                    Items: [
                        ...this.selectedGroup.Items, 
                        { Mask: mask, Number: max } 
                    ]
                };
                this.$emit('input', [...other, current]);
            }
        },

        onUnselect(mask) {
            let number = this.selectedGroup.Number;
            let other = this.value.filter(p => p.Number != number || p.System.Name != this.system);
            if(mask instanceof Array) {
                let current = { 
                    Number: number, 
                    Header: this.selectedGroup.Header, 
                    System: { Name: this.system },
                    Items: [
                        ...this.selectedGroup.Items.filter(p => !mask.some(q => q.Id == p.Mask.Id)).map(p => {
                            return { Mask: p.Mask, Number: p.Number };
                        }), 
                    ] 
                };
                this.$emit('input', [...other, current]);
            } else {
                let maskNumber = this.selectedGroup.Items.find(p => p.Mask.Id == mask.Id).Number;
                let current = { 
                    Number: number, 
                    Header: this.selectedGroup.Header, 
                    System: { Name: this.system },
                    Items: [
                        ...this.selectedGroup.Items.filter(p => p.Mask.Id != mask.Id).map(p => {
                            return { Mask: p.Mask, Number: p.Number > maskNumber ? (p.Number - 1) : p.Number };
                        }), 
                    ] 
                };
                
                this.$emit('input', [...other, current]);
            }
        },
    },
}

</script>

<style lang="scss" scoped>

</style>