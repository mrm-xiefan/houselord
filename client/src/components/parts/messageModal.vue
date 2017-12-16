<template>
  <div class="modal fade in" id="message-modal" tabindex="-1" role="dialog" aria-labelledby="messageModalLabel" aria-hidden="true" data-show="true" data-keyboard="false" data-backdrop="static">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title"><i :class="{'fa': true, 'fa-info-circle': type == 'info', 'fa-question-circle': type == 'select', 'fa-warning': type == 'warn'}"></i>{{title}}</h4>
        </div>
        <div :class="{'modal-body': true, 'text-blue': (type == 'info') || (type == 'select'), 'text-danger': type == 'warn'}">
          {{message}}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal" v-show="type != 'select'" v-on:click="excuteYes">確認</button>
          <button type="button" class="btn btn-default" data-dismiss="modal" v-show="type == 'select'" v-on:click="excuteYes">はい</button>
          <button type="button" class="btn btn-default" data-dismiss="modal" v-show="type == 'select'" v-on:click="excuteNo">いいえ</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import CONST from '@/store/const.js'
  import manager from '@/store/manager.js'
  import utils from '@/tool/utils.js'

  export default {
    props: ['manager'],
    data() {
      return {
        type: '',
        title: '',
        message: '',
        yes: null,
        no: null
      }
    },
    mounted() {
      let self = this
      utils.event.$on('SHOW_MESSAGE', (code, yes, no) => {
        self.type = CONST.type[code] || 'warn'
        self.title = CONST.title[code] || 'ERROR'
        self.message = CONST.message[code] || 'Unknown error!'
        self.yes = yes
        self.no = no
        $('#message-modal').modal('show')
      })
    },
    beforeDestroy() {
      utils.event.$off('SHOW_MESSAGE')
    },
    methods: {
      excuteYes() {
        if (this.yes) {
          this.yes()
        }
      },
      excuteNo() {
        if (this.no) {
          this.no()
        }
      }
    }
  }
</script>

<style scoped>
  #message-modal {
    z-index: 9999;
  }
  .modal-header {
    padding: 12px 22px 10px;
    background: #5CC2EF;
  }
  .modal-header h4 {
    color: #fff;
    font-size: 22px;
    font-weight: 700;
  }
  .modal-header .close {
    margin: 0;
    color: #fff;
    text-shadow: none;
    opacity: 1;
  }
  .modal-header .close{
    font-size: 28px;
  }
  .modal-header .close:focus {
    outline: none;
  }
  .modal-title i {
    margin-right: 10px;
  }
  .modal-body {
    min-height: 150px;
  }
  .btn {
    width: 100px;
  }
</style>
