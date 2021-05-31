<template>
    <div style="height: 100%;">

        <Grid :style="{height: '100%'}"
            :data-items="items"
            :columns="columns"
            :sortable="true"
            :sort= "sort"
            :pageable="true"
            :skip="skip"
            :take="take"
            :total="total"
            @change="change"
            @pagechange="onPageChange"
            @sortchange="onSortChange">

            <template v-slot:dateTemplate="{props, listeners}">
                <td :class="props.className">{{ formatDate(props.field, props.dataItem) }}</td>
            </template>
        </Grid>

    </div>
</template>

<script>

import Vue from 'vue';
import axios from 'axios';
import UserEditor from '@/components/user/user-editor.vue';
import CommandCell from '@/components/user/user-list-command-cell';
import moment from 'moment';

export default {
    name: 'user-list',
    components: {
    },
    data() {
        return {
            skip: 0,
            take: 10,
            total: null,
            sort: [
                { field: 'DisplayName', dir: 'asc' }
            ],
            items: [],
            columns: [
                { field: "UserName", title: "Имя пользователя", width: 150 },
                { field: "DisplayName", title: "Отображаемое имя", width: 'auto' },
                { field: "LastRequest", title: "Последняя авторизация", width: 190, cell: 'dateTemplate' },
                { field: "DepartmentName", title: "Отдел", width: 400 },
                { field: "PositionName", title: "Должность", width: 300 },
                { field: "TabNumber", title: "Табельный номер", width: 150 },
                { field: "Role.DisplayName", title: "Роль", width: 200 },
                { title: " ", cell: CommandCell, width: 50 },
            ],
        }
    },
    computed: {
    },
    methods: {
        loadItems() {
            axios.post(`../api/user/read`, { request: { take: this.take, skip: this.skip, sort: this.sort } })
            .then(response => {
                if(response.data.HasError) throw response.data.ErrorMessage; 
                this.items = response.data.Result.Data;
                this.total = response.data.Result.Total;
            })
            .catch(e => {
                console.log(e);
                alert(e);
            });
        },

        change(dataItem) {
            this.$modals.open({
                component: UserEditor,
                props: {
                    id: dataItem.Id,
                },
                onClose: user => {
                    this.refreshRow(user);
                },
            });
        },

        refreshRow(user) {
            let index = this.items.findIndex(p => p.Id == user.Id);
            if(index == -1) {
                this.items.push(user);
            } else {
                Vue.set(this.items, index, user);
            }
        },

        onPageChange: function(e) {
            console.log(e);
            this.skip = e.page.skip;
            this.take = e.page.take;
            this.loadItems();
        },

        onSortChange: function(e) {
            console.log(e);
            this.sort = e.sort;
            this.loadItems();
        },

        formatDate(fieldName, dataItem) {
            const path = fieldName.split('.');
            let data = dataItem;
            path.forEach((p) => {
                data = data ? data[p] : undefined;
            });
            return moment(data).format('YYYY-MM-DD hh:mm:ss');
        },
    },
    created: function () {
        this.loadItems();
    },
}

</script>