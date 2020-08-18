<template>
  <div id="2" class="22" @click="handleXX">
    dd
    <div />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import xx from './index'

  export interface x {}

  export default Vue.extend({
    data: () => ({
      xx,
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
