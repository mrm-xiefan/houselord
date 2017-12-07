<template>
  <aside class="main-sidebar">
    <section class="sidebar">
      <div class="user-panel">
        <div class="pull-left image" v-on:click="toHome()">
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
        <li :class="{'treeview': true, 'active': manager.controller.currentApp == 'house' || manager.controller.currentApp == 'addHouse'}">
          <a href="#">
            <i class="fa fa-home"></i>
            <span>ハウス</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </a>
          <ul class="treeview-menu">
            <li :class="{'active': manager.controller.currentApp == 'house'}">
              <router-link to="/house">
                <i class="fa fa-circle-o"></i> ハウス一覧
              </router-link>
            </li>
            <li :class="{'active': manager.controller.currentApp == 'addHouse'}">
              <router-link to="/addHouse">
                <i class="fa fa-circle-o"></i> ハウス登録
              </router-link>
            </li>
          </ul>
        </li>
        <li :class="{'active': manager.controller.currentApp == 'owner'}">
          <router-link to="/owner">
            <i class="fa fa-users"></i> <span>オーナー</span>
          </router-link>
        </li>
        <li :class="{'active': manager.controller.currentApp == 'layout'}">
          <router-link to="/layout">
            <i class="fa fa-th-large"></i> <span>間取り</span>
          </router-link>
        </li>
        <li :class="{'active': manager.controller.currentApp == 'meter'}">
          <router-link to="/meter">
            <i class="fa fa-tachometer"></i> <span>メーター</span>
          </router-link>
        </li>
        <li :class="{'active': manager.controller.currentApp == 'expense'}">
          <router-link to="/expense">
            <i class="fa fa-money"></i> <span>経費</span>
          </router-link>
        </li>
        <li :class="{'active': manager.controller.currentApp == 'report'}">
          <router-link to="/report">
            <i class="fa fa-newspaper-o"></i> <span>レポート</span>
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
      },
      toHome() {
        this.$router.push({name: 'home'})
      }
    }
  }
</script>

<style scoped>
  a {
    cursor: pointer;
  }
  .image {
    cursor: pointer;
  }
</style>
