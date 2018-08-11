<template>
  <header class="main-header">
    <a class="logo" v-on:click="triggerIcon()">
      <span class="logo-mini"><b>RM</b></span>
      <span class="logo-lg">ReinsManage</span>
    </a>
    <nav class="navbar navbar-static-top">
      <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </a>
      <div class="navbar-custom-menu">
        <ul class="nav navbar-nav">

          <li class="dropdown notifications-menu">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown">
              <i class="fa fa-bell-o"></i>
              <span class="label label-success">5</span>
            </a>
            <ul class="dropdown-menu">
              <li class="header">リマインド</li>
              <li>
                <ul class="menu">
                  <li>
                    <router-link to="/">
                      <i class="fa fa-warning text-yellow"></i> 賃金催促
                    </router-link>
                  </li>
                  <li>
                    <router-link to="/">
                      <i class="fa fa-info-circle text-blue"></i> 年末調整
                    </router-link>
                  </li>
                  <li>
                    <router-link to="/">
                      <i class="fa fa-exclamation-triangle text-red"></i> 返済日だよ！
                    </router-link>
                  </li>
                  <li>
                    <router-link to="/">
                      <i class="fa fa-info-circle text-blue"></i> もう〜サボらないと生きていけなくなってしまっているから
                    </router-link>
                  </li>
                  <li>
                    <router-link to="/">
                      <i class="fa fa-info-circle text-blue"></i> メーター故障中
                    </router-link>
                  </li>
                </ul>
              </li>
              <li class="footer">
                <router-link to="/">
                  <i class="fa fa-calendar"></i> タスク管理へ
                </router-link>
              </li>
            </ul>
          </li>

          <li>
            <a href="#" v-on:click="logout()"><i class="glyphicon glyphicon-log-out"></i> ログアウト</a>
          </li>
          <!-- <li>
            <a href="#" data-toggle="control-sidebar"><i class="fa fa-gears"></i></a>
          </li> -->
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
  import CONST from '@/store/const.js'
  import manager from '@/store/manager.js'
  import utils from '@/tool/utils.js'

  export default {
    props: ['manager'],
    methods: {
      backward() {
        this.$router.go(-1)
      },
      goTop() {
        $('html, body').animate({scrollTop: 0}, 'fast')
      },
      triggerIcon() {
        // this.$router.push({path: '/'})
      },
      logout() {
        utils.restGet('/logout').then(
          response => {
            if (response) {
              utils.router.push({name: 'login'})
            }
          }
        )
      }
    }
  }
</script>

<style scoped>

</style>
