<template>
  <div id="2" class="22" @click="handleXX">
    dd
    <div>ddd</div>
    <div />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import xx from './index'

  export interface x {
    x: 1
  }

  enum XX {
    x = 1,
  }

  export default Vue.extend({
    data: () => ({
      xx,
      XX,
      z: 0 as number,
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

<style>
  .dd {
    color: red;
  }
</style>
