<template>

<div class="full-size">
    <monitoring-job-list></monitoring-job-list>
</div>

</template>

<script>

import MonitoringJobList from '@/components/monitoring/monitoring-job-list';

export default {
    name: 'test-page',
    components: {
        MonitoringJobList,
    },
    data() {
        return {
        };
    },
    methods: {
    },
}
</script>

<style lang="scss" scoped>

</style>