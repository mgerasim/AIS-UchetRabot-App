<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <div @click="onTest">TEST</div>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import TestDialog from '@/components/TestDialog';

export default {
  name: 'home',
  components: {
    HelloWorld
  },
  methods: {
      onTest() {
        this.$modals.open({
            component: TestDialog
        });
      },
  },
}
</script>
