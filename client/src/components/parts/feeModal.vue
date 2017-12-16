<template>
  <div class="modal fade in" id="fee-modal" tabindex="-1" role="dialog" aria-labelledby="feeModalLabel" aria-hidden="true" data-show="true" data-keyboard="true" data-backdrop="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">

        <div class="modal-header gradient-header">
          <button type="button" class="close" id="close-detail" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true"><i class="glyphicon glyphicon-remove"></i></span>
          </button>
          <h4 class="modal-title">費用</h4>
        </div>

        <div class="modal-body">
          <div class="row">
            <div class="col-sm-6 column-block">
              <div class="btn-group">
                <button type="button" class="btn btn-primary dropdown-toggle block-button" data-toggle="dropdown">
                  <span class="dropdown-text" v-if="type == ''">費用種類</span>
                  <span class="dropdown-text" v-else>{{typeName}}</span>
                </button>
                <ul class="dropdown-menu">
                  <li v-for="type in manager.feeTypes" v-if="type.type != 'once' && (hasMeter || (!hasMeter && type.type != 'meter'))" class="selection-item"><a v-on:click="setType(type)">{{type.name}}</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-6 column-block">
              <label class="input-label">費用名：</label>
              <input v-model="name" type="text" class="form-control" placeholder="入力">
            </div>
          </div>
          <div class="row">
            <div class="col-sm-6 column-block">
              <label class="input-label">基本料金：</label>
              <input v-model="base" type="number" step=1000 class="form-control" placeholder="入力">
            </div>
            <div class="col-sm-6 column-block" v-if="isFeeHasUnit(type)">
              <label class="input-label">使用料金（一単位あたり）：</label>
              <input v-model="price" type="number" step=1000 class="form-control" placeholder="入力">
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" id="close-fee-detail" class="btn btn-cancel" data-dismiss="modal" aria-label="Close">キャンセル</button>
          <button type="button" id="save-fee-detail" class="btn btn-create" :disabled="!isValid" v-on:click="save">保存</button>
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
        name: '',
        base: 0,
        price: 0,
        hasMeter: false
      }
    },
    mounted() {
      let self = this
      utils.event.$on('FEE_DETAIL', (fee, hasMeter, next) => {
        self.hasMeter = hasMeter
        if (fee) {
          self.type = fee.type
          self.name = fee.name
          self.base = fee.base
          self.price = fee.price
        }
        else {
          self.type = ''
          self.name = ''
          self.base = 0
          self.price = 0
        }
        if (next) {
          self.next = next
        }
        else {
          self.next = null
        }
        self.$nextTick(() => {
          $('#fee-modal').modal('show')
        })
      })

    },
    updated() {
      $("input[type='number']").off("click").on("click", function () {
        $(this).select();
      });
    },
    beforeDestroy() {
      utils.event.$off('FEE_DETAIL')
    },
    computed: {
      typeName() {
        return this.type? CONST.feeTypes[this.type].name: ''
      },
      isValid() {
        if (!this.type) return false
        if (!this.name) return false
        if (this.isFeeHasUnit(this.type) && this.base < 0) return false
        if (!this.isFeeHasUnit(this.type) && this.base <= 0) return false
        if (this.isFeeHasUnit(this.type) && this.price <= 0) return false
        return true
      }
    },
    methods: {
      isFeeHasUnit(type) {
        if (!type) return false
        return CONST.feeTypes[type].unit
      },
      setType(type) {
        this.type = type.value
        this.name = type.sample
        if (!this.isFeeHasUnit(this.type)) {
          this.price = 0
        }
      },
      save() {
        let fee = {
          type: this.type,
          name: this.name,
          base: Number(this.base),
          price: Number(this.price)
        }
        if (this.next) {
          this.next(fee)
        }
        this.type = ''
        this.name = ''
        this.base = 0
        this.price = 0
        $('#fee-modal').modal('hide')
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
  .gradient-header {
    background: #00B5ED;
    /* background: -webkit-linear-gradient(left, #00B5ED, #51DCE5);
    background: linear-gradient(to right, #00B5ED, #51DCE5); */
  }

  /* body */
  .modal-body {
    padding: 22px;
  }
  .column-block {
    padding: 10px;
  }
  .btn-group {
    margin: 10px 0px 10px 0px;
  }
  .block-button {
    width: 260px;
    padding: 10px;
  }
  .selection-item {
    width: 260px;
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
</style>
