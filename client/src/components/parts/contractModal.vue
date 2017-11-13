<template>
  <div class="modal fade in" id="contract-modal" tabindex="-1" role="dialog" aria-labelledby="contractModalLabel" aria-hidden="true" data-show="true" data-keyboard="true" data-backdrop="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">

        <div class="modal-header gradient-header">
          <button type="button" class="close" id="close-detail" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true"><i class="glyphicon glyphicon-remove"></i></span></button>
          <h4 class="modal-title">契約 - {{manager.selectedHouse? manager.selectedHouse.name : ''}} - {{room? room.number: ''}}</h4>
        </div>

        <div class="modal-body" v-if="room">

          <div class="select-data">
            <div class="data-row box-2column category">
              <div class="modal-item btn-group">
                <input v-model="resident" type="text" class="form-control" data-toggle="dropdown" placeholder="入力">
                <span class="input-group-label">居住者:</span>
                <!-- <ul class="dropdown-menu">
                  <li v-for="one in manager.residents" v-if="one.visible(resident)"><a v-on:click="setResident(one)">{{one._id}}</a></li>
                </ul> -->
              </div>
              <div class="modal-item">
                <input v-model="phone" type="text" class="form-control" placeholder="入力">
                <span class="input-group-label">電話番号:</span>
              </div>
            </div>
            <div class="data-row category">
              <div class="modal-item">
                <input v-model="note" type="text" class="form-control" placeholder="入力">
                <span class="input-group-label">備考:</span>
              </div>
            </div>
          </div>

            <div class="data-row box-3column category">
              <div class="modal-item">
                <input v-model="keyMoney" type="number" class="form-control" placeholder="入力">
                <span class="input-group-label">礼金:</span>
              </div>
              <div class="modal-item">
                <input v-model="deposit" type="number" class="form-control" placeholder="入力">
                <span class="input-group-label">敷金:</span>
              </div>
              <div class="modal-item">
                <input v-model="rent" type="number" class="form-control" placeholder="入力">
                <span class="input-group-label">家賃:</span>
              </div>
            </div>
            <div class="data-row box-3column category">
              <div class="modal-item">
                <input id="start-date" type="text" class="form-control" placeholder="選択">
                <span class="input-group-label">開始日:</span>
              </div>
              <div class="modal-item">
                <input v-model="month" type="number" class="form-control" placeholder="入力">
                <span class="input-group-label">賃貸月数:</span>
              </div>
              <div class="modal-item">
                <input v-model="day" type="number" class="form-control" placeholder="入力">
                <span class="input-group-label">支払日:</span>
              </div>
            </div>

        </div>

        <div class="modal-footer">
          <button type="button" id="close-contract-detail" class="btn btn-cancel" data-dismiss="modal" aria-label="Close">キャンセル</button>
          <button type="button" id="save-contract-detail" class="btn btn-create" :disabled="!room" v-on:click="saveContract()">確定</button>
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
        room: null,
        resident: '',
        phone: '',
        note: '',
        keyMoney: 0,
        deposit: 0,
        rent: 0,
        start: 0,
        month: 0,
        day: '毎月1日'
      }
    },
    mounted() {
      let self = this
      utils.event.$on('CONTRACT_DETAIL', (room) => {
        self.room = room
        self.keyMoney = room.keyMoney
        self.deposit = room.deposit
        self.rent = room.rent
        self.$nextTick(() => {
          $('#contract-modal').modal('show')
          self.pickDate()
        })
      })
    },
    beforeDestroy() {
      utils.event.$off('CONTRACT_DETAIL')
    },
    methods: {
      pickDate() {
        console.log(111)
        let self = this
        // if (this.start) {
        //   $('#start-date').val(utils.formatDate(this.start))
        // }
        // else {
          $('#start-date').val('')
        // }
        $('#start-date').datepicker({
          autoclose: true,
          language: 'ja',
          format: 'yyyy/mm/dd'
        })
        // .change(self.changeStart)
        // .on('changeDate', self.changeStart)
      },
      // changeStart() {
      //   let start = new Date($('#start-date').val())
      //   this.start = start.valueOf()
      //   console.log(44444)
      // },
      saveContract() {
        let self = this
        // let data = {
        //   _id: self.contract.owner,
        //   lord: manager.user._id
        // }
        // utils.restPost('/api/addOwner', data).then(
        //   response => {
        //     if (response) {
        //       manager.owners.push(new Owner(response))
        //       manager.sortOwner()
        //       $('#contract-modal').modal('hide')
        //     }
        //   }
        // )
      }
    }
  }
</script>

<style scoped>
  /* header */
  .modal-header {
    padding: 12px 22px 10px;
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
  .modal-header .close i {
    font-size: 28px;
  }
  .modal-header .close:focus {
    outline: none;
  }

  /* body */
  .modal-body {
    padding: 22px;
  }
  .select-data {
    flex: 2 1 auto;
    margin-bottom: 20px;
    border-bottom: 1px solid #eee;
  }
  .data-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }
  .data-row .modal-item {
    flex: 1 1 auto;
    margin: 0 5px;
    position: relative;
  }
  .data-row .modal-item .btn {
    height: 46px;
    border: none;
  }
  .modal-item input {
    padding-left: 70px;
  }
  .long-label input {
    padding-left: 85px;
  }
  .data-row .modal-item .btn:focus,
  .btn-group.open .dropdown-toggle {
    background: #e6e6e6;
    box-shadow: none;
  }
  .input-group-label {
    position: absolute;
    top: 13px;
    left: 5px;
    font-size: 14px;
    color: #aaa;
  }
  .data-row .modal-item label {
    display: none;
  }
  .data-row .modal-item input[type="text"],
  .data-row .modal-item input[type="number"] {
    height: 46px;
    background: #f4f4f4;
    border: none;
    border-radius: 4px;
  }
  .category {
    margin-bottom: 22px;
  }
  .category .modal-item {
    font-size: 18px;
  }

  /* footer */
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    padding: 0;
    border: none;
    background: #2D2D2D;
  }
  .modal-footer .btn {
    display: block;
    margin: 0;
    padding: 13px 0;
    width: 200px;
    color: #fff;
    font-size: 18px;
    font-weight: 700;
    border: none;
    border-radius: 0;
  }
  .modal-footer .btn-create {
    background: #ced941;
  }
  .modal-footer .btn-cancel {
    background: #3e3e3e;
  }

  /* responsive */
  @media (max-width: 992px) {
    .modal-footer {
      display: flex;
      justify-content: space-between;;
    }
    .modal-footer .btn {
      width: 50%;
    }
  }
  @media (max-width: 480px) {
    .data-row {
      flex-direction: column;
      margin: 0;
    }
    .data-row .modal-item {
      margin: 0 0 10px;
    }
  }
</style>
