<!-- 
    Выбор маскируемых защит ЕСУ = САУ + СДКУ
    в диалогах формирования шаблонов и разрешений 
-->

<template>

<div class="v-flex full-size">

    <div v-if="!readOnly && groupsBySystem.length > 0" class="h-flex">
        <div class="v-flex" style="width: 100px;">
            <div class="h-flex">
                <button class="k-button" :disabled="readOnly" @click="onAddGroup" title="Добавить группу" style="flex: 1;">
                    <fa icon="plus"></fa>
                </button>
                <button class="k-button" :disabled="readOnly || value.length <= 1" @click="onRemoveGroup" title="Удалить группу" style="flex: 1; margin-left: 4px;">
                    <fa icon="times"></fa>
                </button>
            </div>
            <div style="margin-top: 4px;">
                <dropdownlist   ref="group"
                                :disabled="value.length == 0"
                                name="group"
                                :data-source="groupsBySystem"
                                data-text-field="_t"
                                data-value-field="Number"
                                v-model="selectedGroup"
                                style="width: 100%;">
                </dropdownlist>
            </div>
        </div>
        <textarea   v-if="originalSelectedGroup != null"
                    class="k-textarea" 
                    cols="1" rows="1"
                    placeholder="Заголовок группы защит/готовностей, подлежащих маскированию"
                    :disabled="readOnly" 
                    v-model="originalSelectedGroup.Header"
                    style="resize: vertical; overflow: auto; width: 100%; margin-left: 4px;"></textarea>
    </div>

    <esu-mask-catalog-selector
        v-if="!readOnly"
        :selected-items="groupSelectedMasks"
        style="flex: 1; min-height: 0; margin-bottom: 16px; "
        @select="onSelect"
        @unselect="onUnselect">
    </esu-mask-catalog-selector>
    <div style="margin-bottom: 8px; font-weight: bold;">Выбранные защиты / готовности</div>
    <esu-mask-simple-list 
        v-if="!readOnly"
        :groupNumber="selectedGroup != null ? selectedGroup.Number : null"
        :items="groupSelectedMaskInfos"
        @unselect="onUnselect"
        @maskUp="onMaskUp"
        @maskDown="onMaskDown"
        style="flex: 1; min-height: 0;"></esu-mask-simple-list>
    <esu-mask-simple-grouped-list
        v-if="readOnly" 
        :items="groupsBySystem"
        style="flex: 1; min-height: 0;"></esu-mask-simple-grouped-list>
</div>

</template>

<script>

import EsuMaskCatalogSelector from '@/components/mask/esu-mask-catalog-selector';
import EsuMaskSimpleList from '@/components/mask/esu-mask-simple-list';
import EsuMaskSimpleGroupedList from '@/components/mask/esu-mask-simple-grouped-list';
import Dropdownlist from '@/components/shared/dropdownlist';

export default {
    name: 'esu-masks-selector',
    components: {
        EsuMaskCatalogSelector,
        EsuMaskSimpleList,
        EsuMaskSimpleGroupedList,
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
            selectedGroup: this.value != null ? this.value.find(p => p.System.Name == 'ESU' && p.Number == 1) : null,
            system: 'ESU',
        };
    },
    methods: {
        onSelect(mask) {
            if(this.groupsBySystem.length == 0) {
                this.selectedGroup = {
                    Number: 1,
                    Header: 'Перед проведением работ диспетчер маскирует защиты и источники защит ЕСУ',
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

        onMaskUp(maskId) {
            let groupNumber = this.selectedGroup.Number;
            let other = this.value.filter(p => p.Number != groupNumber || p.System.Name != this.system);

            let maskNumber = this.selectedGroup.Items.find(p => p.Mask.Id == maskId).Number;

            let currentGroup = { 
                Number: groupNumber, 
                Header: this.selectedGroup.Header, 
                System: { Name: this.system },
                Items: this.selectedGroup.Items.map(p => {
                    let number = (p.Number == maskNumber - 1) ? maskNumber :
                                    (p.Number == maskNumber ? maskNumber - 1 : p.Number);
                    return {
                        Number: number,
                        Mask: p.Mask,
                    };
                }),
            };

            this.$emit('input', [...other, currentGroup]);
        },

        onMaskDown(maskId) {
            let groupNumber = this.selectedGroup.Number;
            let other = this.value.filter(p => p.System.Name != this.system || p.Number != groupNumber);

            let maskNumber = this.selectedGroup.Items.find(p => p.Mask.Id == maskId).Number;

            let currentGroup = { 
                Number: groupNumber, 
                Header: this.selectedGroup.Header, 
                System: { Name: this.system },
                Items: this.selectedGroup.Items.map(p => {
                    let number = (p.Number == maskNumber + 1) ? maskNumber :
                                    (p.Number == maskNumber ? maskNumber + 1 : p.Number);
                    return {
                        Number: number,
                        Mask: p.Mask,
                    };
                }),
            };

            this.$emit('input', [...other, currentGroup]);
        },

        onAddGroup() {
            let max = this.groupsBySystem.length > 0 ? Math.max(...this.groupsBySystem.map(p => p.Number)) : 0;
            max++;
            let maskGroup = { Number: max, Header: '', System: { Name: this.system }, Items: [] };
            this.$emit('input', [...this.value, maskGroup]);
            this.selectedGroup = maskGroup;
        },

        onRemoveGroup() {
            let number = this.selectedGroup.Number;
            let other = this.value.filter(p => p.Number != this.selectedGroup.Number || p.System.Name != this.system);
            for(let item of other.filter(p => p.System.Name == this.system)) {
                if(item.Number > number) item.Number = item.Number - 1;
            }
            this.selectedGroup = this.originalSelectedGroup;
            this.$emit('input', other);
        },
    },
}

</script>

<style lang="scss" scoped>

</style>