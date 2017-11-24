<template>
  <aside class="main-sidebar">
    <section class="sidebar">
      <div class="user-panel">
        <div class="pull-left image">
          <img src="../assets/avatar.png" class="img-circle" alt="User Image">
        </div>
        <div class="pull-left info">
          <p>{{manager.user._id}}</p>
          <a v-if="manager.socket && manager.socket.connected" v-on:click="disconnect()"><i class="fa fa-circle text-success"></i> Online</a>
          <a v-else v-on:click="connect()"><i class="fa fa-circle text-red"></i> Offline</a>
        </div>
      </div>
      <ul id='side-menu-tree' class="sidebar-menu" data-widget="tree">
        <li class="header">ナビゲーション</li>
        <li :class="{'active': manager.controller.currentApp == 'house'}">
          <router-link to="/">
            <i class="fa fa-circle-o"></i> <span>ハウス</span>
          </router-link>
        </li>
        <li :class="{'active': manager.controller.currentApp == 'meter'}">
          <router-link to="/meter">
            <i class="fa fa-circle-o"></i> <span>メーター</span>
          </router-link>
        </li>
        <li :class="{'active': manager.controller.currentApp == 'report'}">
          <router-link to="/report">
            <i class="fa fa-circle-o"></i> <span>レポート</span>
          </router-link>
        </li>
      </ul>
    </section>
  </aside>
</template>

<script>
  import CONST from '@/store/const.js'
  import manager from '@/store/manager.js'
  import utils from '@/tool/utils.js'

  export default {
    props: ['manager'],
    mounted() {
      $('#side-menu-tree').tree()
    },
    updated() {
      this.$nextTick(() => {
        $('#side-menu-tree').tree()
      })
    },
    methods: {
      connect() {
        manager.initSocket(() => {})
      },
      disconnect() {
        manager.socket.disconnect()
      }
    }
  }
</script>

<style scoped>
  a {
    cursor: pointer;
  }
</style>
