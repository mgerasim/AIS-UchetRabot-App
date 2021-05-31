<template>

<div class="full-size">
    <job-list class="full-size"></job-list>
    <vu-modal-wrapper></vu-modal-wrapper>
</div>

</template>

<script>

import JobList from '@/components/job/job-list.vue';

export default {
    name: 'jobs-page',
    components: {
        JobList,
    },
}

</script>

<style lang="scss" scoped>

</style>