<template>
  <div id="2" class="22" @click="handleXX">
    <div>ddd</div>
    <div />
  </div>
</template>

<script>
  import xx from './index'
  import Vue from 'vue'
  import { wait } from 'lodash-uni'

  export default Vue.extend({
    data: () => ({
      z: 0,
    }),
    computed: {
      yy() {
        return `${this.xx}2`
      },
    },
    methods: {
      handleXX() {
        console.log(this.xx)
      },
    },
  })
</script>

<style module>
  .dd {
    color: red;
  }
</style>

<style module="styles">
  .dd2 {
    color: red;
  }
</style>

<style lang="scss">
  .xxx {
    color: red;

    &.oo {
      font-size: 20px;
    }
  }
</style>
