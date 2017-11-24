<template>
  <router-view :manager="manager"></router-view>
</template>

<script>
  import CONST from '@/store/const.js'
  import manager from '@/store/manager.js'
  import utils from '@/tool/utils.js'

  export default {
    props: ['manager']
  }
</script>

<style>
  /* .navbar-static-top,
  .gradient-header {
    background: -webkit-linear-gradient(left, #00B5ED, #51DCE5);
    background: linear-gradient(to right, #00B5ED, #51DCE5);
  } */
</style>
