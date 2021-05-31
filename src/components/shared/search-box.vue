<template>
    <div class="custom-search-input">
        <div class="input-group">
            <input v-model="searchString" type="text" class="search-query k-textbox" placeholder="Поиск" @keypress="onKeypress" />
            <span class="input-group-btn" title="найти">
                <button type="button" disabled>
                    <fa icon="search" size="sm" />
                </button>
            </span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'search-box',
    data() {
        return {
            searchString: '',
        };
    },
    watch: {
        searchString(newValue, oldValue) {
            if(oldValue != '' && oldValue.length > 1 && newValue == '') {
                this.$emit('clear');
            } else {
                this.$emit('change', newValue);
            }
        },
    },
    methods: {
        onKeypress(e) {
            if(e.key == 'Enter') {
                this.$emit('search', this.searchString);
            }
        },
    },
}
</script>

<style scoped>

.custom-search-input {
    margin:0;
    padding: 0;
}
 
.custom-search-input .search-query {
    width:100%;
    padding-right: 30px;
    padding-left: 10px;
    border-radius: 0 !important;
}
 
.custom-search-input button {
    z-index: 2;
    position: absolute;
    right:0;
    border: 0;
    background: none;
    /** belows styles are working good */
    padding: 4px 10px;
    margin-top: 2px;
    margin-bottom: 0;
    color:#ccc;
    cursor: pointer;
    border-radius: 3px;
    /* IE7-8 doesn't have border-radius, so don't indent the padding */
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
}

.custom-search-input button:hover {
    color:#656565;
}
 
.search-query:focus{
    z-index: 0;   
}

</style>