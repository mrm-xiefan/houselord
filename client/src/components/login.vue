<template>
  <div class="wrapper">
    <div class="fullscreen">
      <div class="login-box">
        <div class="login-logo">
          HouseLord
        </div>
        <div class="login-box-body">
          <p class="login-box-msg">すでにアカウントをお持ちの場合、ログインしてご利用ください。</p>
          <div class="form-group has-feedback">
            <input id="login-user" v-model="manager.user._id" type="text" class="form-control" placeholder="Account" @keyup.enter="foucusPassword()">
            <span class="glyphicon glyphicon-user form-control-feedback"></span>
          </div>
          <div class="form-group has-feedback">
            <input id="login-password" v-model="manager.user.password" type="password" class="form-control" placeholder="Password" @keyup.enter="login()">
            <span class="glyphicon glyphicon-lock form-control-feedback"></span>
          </div>
          <div class="row">
            <div class="col-xs-8 middle-padding">
              <router-link to="/register">アカウントを持っていない場合</router-link>
            </div>
            <div class="col-xs-4">
              <button type="submit" class="btn btn-primary btn-block btn-flat" v-on:click="login()">ログイン</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <lockScreen :manager="manager"></lockScreen>
    <messageModal :manager="manager"></messageModal>
  </div>
</template>

<script>
  import CONST from '@/store/const.js'
  import manager from '@/store/manager.js'
  import utils from '@/tool/utils.js'

  import lockScreen from '@/components/parts/lockScreen'
  import messageModal from '@/components/parts/messageModal'
  export default {
    props: ['manager'],
    components: {
      lockScreen: lockScreen,
      messageModal: messageModal
    },
    created() {
      manager.logout()
    },
    methods: {
      foucusPassword() {
        if (manager.user._id != '') {
          $('#login-password').focus()
        }
      },
      login() {
        let self = this
        let path = self.$route.query.path
        if (manager.user._id == '' || manager.user.password == '') {
          utils.event.$emit('SHOW_MESSAGE', 'B004', () => {
            $('#message-modal').on('hidden.bs.modal', () => {
              if (manager.user._id == '') {
                $('#login-user').focus()
              }
              else {
                $('#login-password').focus()
              }
            })
          })
          return
        }
        utils.authenticate({username: manager.user._id, password: manager.user.password}).then(
          response => {
            if (response) {
              manager.login(response, () => {
                if (path) {
                  self.$router.push({path: path})
                }
                else {
                  self.$router.push({path: '/'})
                }
              })
            }
          }
        )
      }
    }
  }
</script>

<style scoped>
  .fullscreen {
    background: #d2d6de;
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .middle-padding {
    padding: 7px 5px 7px 16px;
  }
</style>
