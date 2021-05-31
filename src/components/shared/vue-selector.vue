<template>

    <div tabindex="0"
         @keypress="onKeypress($event)"
         @focus="onFocus($event)"
         @blur="onBlur($event)"
         @mouseover="onGlobalMouseover($event)"
         @mouseout="onGlobalMouseout($event)"
         ref="main">

        <div class="k-widget k-dropdown k-header" @mouseup="onMouseup($event)">
            <span class="k-dropdown-wrap k-state-default" 
                  ref="control"
                  v-bind:class="[{'k-state-default': !focused}, {'k-state-focused': focused}]">
                <span class="k-input">{{ display }}</span>
                <span class="k-select">
                    <span class="k-icon k-i-arrow-s"></span>
                </span>
            </span>
        </div>

        <div class="k-list-container k-popup k-group k-reset disable-text-select"
             style="position: absolute; z-index: 10013;"
             v-bind:style="{ display: showList ? 'block' : 'none', width: width, top: top }"
             ref="list">
            <div class="k-list-optionlabel"
                 v-bind:class="value == null ? ['k-state-selected', 'k-state-focused'] : []"
                 v-if="optionLabel != null"
                 @mouseover="onMouseover($event)" @mouseout="onMouseout($event)"
                 @click="onLabelClick">{{ optionLabel }}</div>
            <div class="k-group-header" style="display: none;"></div>
            <div class="k-list-scroller"
                 v-bind:style="{ height: data.length > 7 ? '150px' : 'auto'}"
                 ref="scroller">
                <ul class="k-list k-reset" @click="onItemClick($event)">
                    <li class="k-item"
                        @mouseover="onMouseover($event)" @mouseout="onMouseout($event)"
                        v-bind:class="_valueIsEqual(value, item) ? ['k-state-selected', 'k-state-focused'] : []"
                        v-for="(item, index) in data"
                        :key="'item_' + index"
                        :data-index="index">
                        {{ _getFieldValue(item, displayField) }}
                    </li>
                </ul>
            </div>
        </div>

    </div>



    <!--<select :value="value" @input="updateValue($event.target.value)">
        <option v-if="optionLabel != null" :value="null">{{ optionLabel }}</option>
        <option v-for="item in data" :value="_getFieldValue(item, valueField)">
            {{ _getFieldValue(item, displayField) }}
        </option>
    </select>-->

</template>

<script>

    import Vue from 'vue';
    import axios from 'axios';

    //dataSource: Array | dataSourceDescription
    //dataSourceDescription: {
    //    url: String
    //    method: String ['POST' | 'GET']
    //    params: Object [sample {id: 54}]
    //}

    export default {
        name: 'vue-selector',
        props: {
            dataSource: [Array, Object],
            optionLabel: String,
            displayField: String,
            valueField: String,
            value: null,
        },
        data() {
            return {
                data: [],
                requestUrl: null,
                requestMethod: null,
                requestParams: null,
                index: null,
                showList: false,
                width: '100px',
                top: '0px',
                focused: false,
            }
        },
        computed: {
            display: function() {
                if (this.value == null) return this.optionLabel;
                for (const dataItem of this.data) {
                    if (this._valueIsEqual(this.value, dataItem)) {
                        return this._getFieldValue(dataItem, this.displayField);
                    }
                }
                return '';
            },
        },
        methods: {
            _getIndex() {
                //console.log('_getIndex:');
                if (this.value == null) {
                    //console.log('_getIndex: value is null');
                    return null;
                }
                for (let i = 0; i < this.data.length; i++) {
                    const dataItem = this.data[i];
                    if (this._valueIsEqual(this.value, dataItem)) {
                        return i;
                    }
                }
                //console.log('_getIndex: not found');
                //console.log(JSON.stringify(this.data));
                //console.log(JSON.stringify(this.value));
                return null;
            },

            _valueIsEqual(value, dataItem) {
                const currValue = this._getFieldValue(dataItem, this.valueField);
                if (currValue instanceof Object) {
                    if (JSON.stringify(value) == JSON.stringify(currValue)) return true;
                } else {
                    if (currValue == this.value) return true;
                }
                return false;
            },

            _getFieldValue(item, property) {
                if (property == null) return item;
                const splitted = property.split('.');
                let val = item;
                for (let i = 0; i < splitted.length; i++) {
                    val = val[splitted[i]];
                }
                return val;
            },

            _changePositionByIndex(index) {
                this.index = index;
                let value = index == null ? null : this._getFieldValue(this.data[this.index], this.valueField);
                this.$emit('input', value);
                this.$emit('change', value);
            },

            onItemClick($event) {
                console.log("onItemClick");
                const li = $event.originalTarget;
                this._changePositionByIndex(li.dataset.index);
                this._closeSelector();
                setTimeout(() => {
                    this.$el.focus();
                }, 100);
            },

            onLabelClick() {
                console.log("onLabelClick");
                this._changePositionByIndex(null);
                this._closeSelector();
                this.$el.focus();
                setTimeout(() => {
                    this.$el.focus();
                }, 100);
            },

            onKeypress($event) {
                if ($event.code === 'ArrowDown' || $event.code === 'ArrowRight') {
                    if (this.index == null) {
                        this._changePositionByIndex(0);
                        this._fixScrollPosition();
                    } else if (this.index < this.data.length - 1) {
                        this._changePositionByIndex(this.index + 1);
                        this._fixScrollPosition();
                    }
                    $event.preventDefault();
                    $event.stopPropagation();
                } else if ($event.code === 'ArrowUp' || $event.code === 'ArrowLeft') {
                    if (this.index > 0) {
                        this._changePositionByIndex(this.index - 1);
                        this._fixScrollPosition();
                    } else if (this.index === 0 && this.optionLabel != null) {
                        this._changePositionByIndex(null);
                    }

                    $event.preventDefault();
                    $event.stopPropagation();
                }
            },

            _fixScrollPosition() {
                const scroller = this.$refs.list.querySelector('.k-list-scroller');
                const scrollerRect = scroller.getBoundingClientRect();
                const selectedNode = this.$refs.list.querySelector(`.k-list-scroller > .k-list > .k-item[data-index="${this.index}"]`);
                const selectedNodeRect = selectedNode.getBoundingClientRect();
                const offset = selectedNodeRect.top - scrollerRect.top;
                if (offset < 0) {
                    //выше
                    scroller.scrollTop = scroller.scrollTop + offset;
                } else if (offset > scrollerRect.height) {
                    //ниже
                    scroller.scrollTop = offset;
                }
            },

            onGlobalMouseover($event) {
                this.$refs.control.classList.add('k-state-hover');
            },

            onGlobalMouseout($event) {
                this.$refs.control.classList.remove('k-state-hover');
            },

            onMouseover($event) {
                const element = $event.originalTarget;
                element.classList.add('k-state-hover');
            },

            onMouseout($event) {
                const element = $event.originalTarget;
                element.classList.remove('k-state-hover');
            },

            onFocus($event) {
                console.log('onFocus');
                this.focused = true;
            },

            onBlur($event) {
                console.log('onBlur');
                let current = $event.explicitOriginalTarget;
                console.log(current);
                while (current) {
                    if (current === this.$refs.main) {
                        // в контроле
                        setTimeout(() => {
                            //this._closeSelector();
                            this.$el.focus();
                        }, 500);
                        return;
                    }
                    current = current.parentElement;
                }

                this._closeSelector();
                this.focused = false;
            },

            onMouseup($event) {
                if ($event.button === 0) {
                    if (this.showList) {
                        this._closeSelector()
                    } else {
                        this._openSelector()
                    }
                }
            },

            _openSelector() {
                this.width = `${this.$refs.control.clientWidth-5}px`;
                this.showList = true;

                Vue.nextTick(() => {
                    const windowHeight = window.innerHeight;
                    const clientRect = this.$el.getBoundingClientRect();
                    const listRect = this.$refs.list.getBoundingClientRect();

                    const upSpace = clientRect.top;
                    const downSpace = windowHeight - clientRect.bottom;

                    let down;

                    if (downSpace > listRect.height) {
                        down = true;
                    } else if (upSpace > listRect.height) {
                        down = false;
                    } else if (downSpace > upSpace) {
                        down = true;
                    } else {
                        down = false;
                    }

                    if (down) {
                        this.top = null;
                        this.$refs.control.classList.add('k-state-active');
                        this.$refs.control.classList.add('k-state-border-down');
                        this.$refs.list.classList.add('k-state-border-up');
                    } else {
                        this.top = `-${listRect.height}px`;
                        this.$refs.control.classList.add('k-state-active');
                        this.$refs.control.classList.add('k-state-border-up');
                        this.$refs.list.classList.add('k-state-border-down');
                    }

                    if (this.value != null) {
                        this._fixScrollPosition();
                    }
                });
            },

            _closeSelector() {
                this.showList = false;
                this.$refs.list.classList.remove('k-state-border-up');
                this.$refs.list.classList.remove('k-state-border-down');
                this.$refs.control.classList.remove('k-state-border-down');
                this.$refs.control.classList.remove('k-state-border-up');
                this.$refs.control.classList.remove('k-state-active');
            },

            _loadItems(url, method, params) {
                if (url == null || url == '') return;
                if (method == null || method == '') return;

                axios({
                    method: method,
                    url: url,
                    data: params
                }).then(response => {
                    this.data = response.data;
//                    console.log('_loadItems');
//                    console.log(this.value);
                    this.index = this._getIndex();
                });
            },

            handleScroll: function (event) {
                this._closeSelector();
            },

            _setDataSource(dataSource) {
                if (dataSource instanceof Array) {
                    this.data = dataSource;
                    //console.log('_setDataSource');
                    //console.log(this.value);
                    this.index = this._getIndex();
                } else if (dataSource instanceof Object) {
                    this._loadItems(dataSource.url, dataSource.method, dataSource.params);
                }
            },
        },

        watch: {
            dataSource: function (newDataSource, oldDataSource) {
                if (JSON.stringify(newDataSource) != JSON.stringify(oldDataSource)) {
                    this._setDataSource(newDataSource);
                }
            },

            value: function (newValue, oldValue) {
                if (newValue instanceof Object) {
                    if (JSON.stringify(newValue) != JSON.stringify(oldValue)) {
                        this.index = this._getIndex();
                    }
                } else {
                    if (newValue != this.value) {
                        this.index = this._getIndex();
                    }
                }
            }
        },

        beforeCreate: function () {
            console.log("beforeCreate");
        },
        created: function () {
            // уже есть параметры
            window.addEventListener('scroll', this.handleScroll);
            this._setDataSource(this.dataSource);
            console.log("created");
        },
        beforeMount: function () {
            console.log("beforeMount");
        },
        mounted: function () {
            console.log("mounted");
        },
        beforeUpdate: function () {
            console.log("beforeUpdate");
        },
        updated: function () {
            console.log("updated");
        },
        beforeDestroy: function () {
            console.log("beforeDestroy");
        },
        destroyed: function () {
            window.removeEventListener('scroll', this.handleScroll);
            console.log("destroyed");
        }
    }
</script>

<style scoped>

    .disable-text-select {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

</style>