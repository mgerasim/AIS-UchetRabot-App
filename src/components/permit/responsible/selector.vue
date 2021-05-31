<template>

<div class="full-size">
    <div class="full-size">
        <div class="h-flex full-size">
            <div v-if="!readOnly" class="first-column v-flex">
                <div class="all-persons-row">
                    <div style="flex: 1; min-width: 0; display: flex; flex-flow: column nowrap; height: 100%;">
                        <div class="h-flex" style="flex: 0 0 auto; width: 100%; margin-bottom: 8px;">
                            <div style="flex: 0 0 250px;">
                                <dropdownlist   :data-source="branches"
                                                data-text-field="Name"
                                                data-value-field="Id"
                                                v-model="selectedBranch"
                                                style="width: 100%;">
                                </dropdownlist>
                            </div>
                            <div style="flex: 0 0 250px; margin-left: 8px;">
                                <dropdownlist   :data-source="departments"
                                                data-text-field="Name"
                                                data-value-field="Id"
                                                v-model="selectedDepartment"
                                                style="width: 100%;">
                                </dropdownlist>
                            </div>
                            <div style="flex: 1 100%; min-width: 0;"></div>
                            <div style="flex: 0 auto;">
                                <button class="k-button k-button-icon" style="margin-left: 8px;" @click="openPersonsDialog" title="Справочник сотрудников">
                                    <fa icon="users" size="lg"></fa>
                                </button> 
                            </div>
                        </div>

                        <div class="h-flex" style="flex: 0 0 auto; width: 100%; margin-bottom: 8px;">
                            <div style="flex: 1 100%; min-width: 0;">
                                <search-box
                                        @search="onSearch($event)"
                                        @change="onSearch($event)"
                                        @clear="onSearch(null)" />
                            </div>
                        </div>

                        <div class="person-list">
                            <kendo-listbox  ref="optional"
                                            :data-source="filteredPersons"
                                            data-text-field="Name"
                                            data-value-field="Id"
                                            :template="personItemTemplate"
                                            style="flex: 1 1 100%; min-height: 0; width: 100%; height: 100%;">
                            </kendo-listbox>                    
                        </div>
                    </div>
                </div>
            </div>

            <div class="second-column v-flex">
                <div class="v-flex" style="flex: 1;">
                    <span style="text-align: right; font-size: 0.9rem;">Ответственные за организацию и безопасное производство работ</span>
                    <div class="type-0-row h-flex" style="flex: 1 1 100%; min-height: 0;">
                        <div v-if="!readOnly" class="v-flex actions">
                            <button class="k-button k-button-icon" @click="select0right">
                                <fa icon="chevron-right"></fa>
                            </button>
                            <button class="k-button k-button-icon" @click="select0left">
                                <fa icon="chevron-left"></fa>
                            </button>
                        </div>
                        <div style="flex: 1 1 100%;">
                            <div class="person-list">
                                <kendo-listbox  ref="select0"
                                                :data-source="selected0"
                                                data-text-field="Name"
                                                data-value-field="Id"
                                                :template="personItemTemplate"
                                                style="width: 100%; height: 100%;">
                                </kendo-listbox>                    
                            </div>
                        </div>
                    </div>
                </div>
                <div class="v-flex" style="flex: 1;">
                    <span style="text-align: right; margin-top: 8px; font-size: 0.9rem;">Ответственные за подготовку и проведение работ</span>
                    <div class="type-0-row h-flex" style="flex: 1 1 100%; min-height: 0;">
                        <div v-if="!readOnly" class="v-flex actions">
                            <button class="k-button k-button-icon" @click="select1right">
                                <fa icon="chevron-right"></fa>
                            </button>
                            <button class="k-button k-button-icon" @click="select1left">
                                <fa icon="chevron-left"></fa>
                            </button>
                        </div>
                        <div style="flex: 1 1 100%;">
                            <div class="person-list">
                                <kendo-listbox  ref="select1"
                                                :data-source="selected1"
                                                data-text-field="Name"
                                                data-value-field="Id"
                                                :template="personItemTemplate"
                                                class="person-list"
                                                style="width: 100%; height: 100%;">
                                </kendo-listbox>                    
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="needMask" class="v-flex" style="flex: 1;">
                    <span style="text-align: right; margin-top: 8px; font-size: 0.9rem;">Ответственные за наложение и снятие режима «маскирование»</span>
                    <div class="type-0-row h-flex" style="flex: 1 1 100%; min-height: 0;">
                        <div v-if="!readOnly" class="v-flex actions">
                            <button class="k-button k-button-icon" @click="select2right">
                                <fa icon="chevron-right"></fa>
                            </button>
                            <button class="k-button k-button-icon" @click="select2left">
                                <fa icon="chevron-left"></fa>
                            </button>
                        </div>
                        <div style="flex: 1 1 100%;">
                            <div class="person-list">
                                <kendo-listbox  ref="select2"
                                                :data-source="selected2"
                                                data-text-field="Name"
                                                data-value-field="Id"
                                                :template="personItemTemplate"
                                                class="person-list"
                                                style="width: 100%; height: 100%;">
                                </kendo-listbox>                    
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="isLinearPart" class="v-flex" style="flex: 1;">
                    <span style="text-align: right; margin-top: 8px; font-size: 0.9rem;">Ответственные за отключение силового питания со стороны ЩСУ-0,4 кВ, ИБП</span>
                    <div class="type-0-row h-flex" style="flex: 1 1 100%; min-height: 0;">
                        <div v-if="!readOnly" class="v-flex actions">
                            <button class="k-button k-button-icon" @click="select3right">
                                <fa icon="chevron-right"></fa>
                            </button>
                            <button class="k-button k-button-icon" @click="select3left">
                                <fa icon="chevron-left"></fa>
                            </button>
                        </div>
                        <div style="flex: 1 1 100%;">
                            <div class="person-list">
                                <kendo-listbox  ref="select3"
                                                :data-source="selected3"
                                                data-text-field="Name"
                                                data-value-field="Id"
                                                :template="personItemTemplate"
                                                class="person-list"
                                                style="width: 100%; height: 100%;">
                                </kendo-listbox>                    
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

</template>

<script>

import Vue from 'vue';
import SearchBox from '@/components/shared/search-box';
import { debounce } from '@/core/helpers/utils';
import Guid from '@/core/helpers/guid';
import Dropdownlist from '@/components/shared/dropdownlist';
import { mapState } from 'vuex';
import PersonService from '@/core/services/person-service';
import PersonsDialog from '@/components/person/persons-dialog';

export default {
    name: 'responsible-selector',
    components: {
        SearchBox,
        Dropdownlist,
    },
    props: {
        branchId: { type: Number },
        departmentId: { type: Number },

        value: { type: Array, required: true },
        needMask: { type: Boolean, required: true },
        isLinearPart: { type: Boolean, required: true },
        readOnly: { type: Boolean, default: false },
    },
    watch: {
        branchId(newValue, oldValue) {
            this.selectedBranch = this.branches.find(p => p.Id == newValue);
            this.filterChanged();
        },

        departmentId(newValue, oldValue) {
            this.selectedDepartment = this.departments.find(p => p.Id == newValue);
            this.filterChanged();
        },

        selectedDepartment(newValue, oldValue) {
            this.filterChanged();
        },

        selectedBranch(newValue, oldValue) {
            this.filterChanged();
        },
    },
    computed: {
		...mapState({
            departments: state => [{ Id: null, Name: '-= Все отделы =-'}, ...state.departments],
            branches: state => [{ Id: null, Name: '-= Все подразделения =-'}, ...state.branches],
        }),

        filteredPersons() {
            if(this.searchString == null || this.searchString.trim() == '') return this.persons;
            let splitted = this.searchString.split(' ').filter(p => p.trim() != '').map(p => p.toLowerCase());
            return this.persons.filter(p => splitted.every(t => p.Name.toLowerCase().includes(t)));
        },

        selected0() { 
            return this.value.filter(p => p.ResponsiblePersonType.Value == 0); 
        },

        selected1() {
            return this.value.filter(p => p.ResponsiblePersonType.Value == 1);
        },

        selected2() {
            return this.value.filter(p => p.ResponsiblePersonType.Value == 2);
        },

        selected3() {
            return this.value.filter(p => p.ResponsiblePersonType.Value == 3);
        },
    },
    data() {
        return {
            selectedDepartment: { Id: this.departmentId },
            selectedBranch: { Id: this.branchId },
            persons: [],
            searchString: null,
        };
    },
    methods: {
        loadPersons() {
            PersonService.getAllByBranchAndDepartment(this.selectedBranch.Id, this.selectedDepartment.Id)
                .then(response => {
                    if(response.data.HasError) throw response.data.ErrorMessage;
                    this.persons = response.data.Result;
                })
                .catch(error => {
                    console.log(error);
                    alert(`Ошибка при получении списка ответственных: ${error}`);
                });
        },

        filterChanged() {
            this.loadPersons();
        },

        personItemTemplate(dataItem) {
            let template = `<span class="text-ellipsis">{{ output }}</span>`;

            var itemTemplate = Vue.component('name-component', {
                template: template,
                data() {
                    return {
                        templateArgs: {},
                    };
                },
                computed: {
                    output() {
                        let name = this.templateArgs.Name != null ? this.templateArgs.Name : "";
                        let position = this.templateArgs.Position != null ? (this.templateArgs.Position.substring(0, 1).toLowerCase() + this.templateArgs.Position.substring(1)) : "";
                        let phone = this.templateArgs.Phone != null ? this.templateArgs.Phone : "";

                        let result = name;

                        if(result != "" && position != "") result += ", ";
                        result += position;

                        if(result != "" && phone != "") result += ", ";
                        result += phone;

                        return result;
                    },
                },
                methods: {
                }
            });

            return {
                template: itemTemplate,
                templateArgs: dataItem
            };
        },

        onSearch: debounce(function(value) {
            this.searchString = value;
        }, 500),

        selectRight(personType) {
            let dataItem = this.$refs.optional.kendoWidget().dataItem(this.$refs.optional.kendoWidget().select());
            if(dataItem == null) return;

            let item = {
                Guid: Guid.generate(),
                ResponsiblePersonType: { Value: personType, },
                Person: { 
                    Id: dataItem.Id,
                    Name: dataItem.Name,
                    Position: dataItem.Position,
                    Phone: dataItem.Phone, 
                },
                Name: dataItem.Name,
                Position: dataItem.Position,
                Phone: dataItem.Phone,
            };

            this.$emit('input', [ ...this.value.filter(p => !(p.Person.Id == dataItem.Id && p.ResponsiblePersonType.Value == personType)), item ]);
        },

        select0right() {
            this.selectRight(0);
        },

        select0left() {
            let dataItem = this.$refs.select0.kendoWidget().dataItem(this.$refs.select0.kendoWidget().select());
            if(dataItem == null) return;
            this.$emit('input', this.value.filter(p => p.Guid != dataItem.Guid)); 
            this.$refs.select0.kendoWidget().clearSelection();
        },

        select1right() {
            this.selectRight(1);
        },

        select1left() {
            let dataItem = this.$refs.select1.kendoWidget().dataItem(this.$refs.select1.kendoWidget().select());
            if(dataItem == null) return;
            this.$emit('input', this.value.filter(p => p.Guid != dataItem.Guid)); 
            this.$refs.select1.kendoWidget().clearSelection();
        },

        select2right() {
            this.selectRight(2);
        },

        select2left() {
            let dataItem = this.$refs.select2.kendoWidget().dataItem(this.$refs.select2.kendoWidget().select());
            if(dataItem == null) return;
            this.$emit('input', this.value.filter(p => p.Guid != dataItem.Guid)); 
            this.$refs.select2.kendoWidget().clearSelection();
        },

        select3right() {
            this.selectRight(3);
        },

        select3left() {
            let dataItem = this.$refs.select3.kendoWidget().dataItem(this.$refs.select3.kendoWidget().select());
            if(dataItem == null) return;
            this.$emit('input', this.value.filter(p => p.Guid != dataItem.Guid)); 
            this.$refs.select3.kendoWidget().clearSelection();
        },

        openPersonsDialog() {
            this.$modals.open({
                component: PersonsDialog,
                onDismiss: () => {
                    this.loadPersons();
                },
            });
        }

    },
    created() {
        this.loadPersons();
    },
}

</script>

<style lang="scss" scoped>

.first-column {
    flex: 1;
    margin-right: 8px;
}

.second-column {
    flex: 1;
}

.all-persons-row {
    margin-top: 8px;
    flex: 1 1 100%;
    min-height: 0;
}

.actions {
    margin-right: 8px; 
    margin-top: auto; 
    margin-bottom: auto;

    button:not(:first-child) {
        margin-top: 4px;
    }
}

.person-list {
    height: 100%;
    width: 100%;
    //font-size: 0.8rem !important;
}

</style>