<template>
  <div class="modal fade in" id="house-modal" tabindex="-1" role="dialog" aria-labelledby="houseModalLabel" aria-hidden="true" data-show="true" data-keyboard="true" data-backdrop="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">

        <div class="modal-header gradient-header">
          <button type="button" class="close" id="close-detail" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true"><i class="fa fa-close"></i></span></button>
          <h4 class="modal-title">シェアハウス詳細</h4>
        </div>

        <div class="modal-body" v-if="house">
          <div class="select-form-row">
            <div class="select-image">
              <thumbnailAttachment :manager="manager"></thumbnailAttachment>
            </div>
            <div class="select-data">
              <div class="data-row box-2column category">
                <div class="modal-item btn-group">
                  <input v-model="house.owner" type="text" class="form-control" data-toggle="dropdown" placeholder="オーナー">
                  <ul class="dropdown-menu">
                    <li v-for="owner in manager.owners" v-if="owner.visible(house.owner)"><a v-on:click="setOwner(house, owner)">{{owner._id}}</a></li>
                  </ul>
                </div>
                <div class="modal-item">
                  <input v-model="house.name" type="text" class="form-control" placeholder="建築名">
                </div>
              </div>
              <div class="data-row category">
                <div class="modal-item">
                  <input v-model="house.address" type="text" class="form-control" placeholder="アドレス">
                </div>
              </div>
              <div class="data-row category">
                <div class="modal-item">
                  <input v-model="house.note" type="text" class="form-control" placeholder="備考">
                </div>
              </div>
            </div>
          </div>
          <div class="room-form" v-for="room in house.rooms">
            <div class="data-row box-3column">
              <div class="modal-item">
                <input v-model="room.number" type="text" class="form-control" placeholder="ルーム番号">
              </div>
              <div class="modal-item">
                <input v-model="room.size" type="text" class="form-control" placeholder="面積・間取り">
              </div>
              <div class="modal-item">
                <input v-model="room.floor" type="text" class="form-control" placeholder="階層・備考">
              </div>
            </div>
            <div class="data-row box-3column">
              <div class="modal-item">
                <input v-model="room.contract" type="number" class="form-control" placeholder="契約金">
              </div>
              <div class="modal-item">
                <input v-model="room.rent" type="number" class="form-control" placeholder="賃貸料">
              </div>
              <div class="modal-item">
                <input v-model="room.expenses" type="number" class="form-control" placeholder="管理費など">
              </div>
            </div>
          </div>
          <div class="add-room" v-on:click="addRoom()">
            ルーム追加
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" id="close-house-detail" class="btn btn-cancel" data-dismiss="modal" aria-label="Close">キャンセル</button>
          <button type="button" id="save-house-detail" class="btn btn-create" :disabled="!house || !house.lord || !house.name" v-on:click="saveHouse()">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import CONST from '@/store/const.js'
  import manager from '@/store/manager.js'
  import utils from '@/tool/utils.js'

  import House from '@/store/house.js'
  import Room from '@/store/room.js'
  import Owner from '@/store/owner.js'
  import thumbnailAttachment from '@/components/parts/thumbnailAttachment'
  export default {
    props: ['manager'],
    data() {
      return {
        house: null
      }
    },
    components: {
      thumbnailAttachment: thumbnailAttachment
    },
    created() {
      let self = this
      utils.event.$on('HOUSE_DETAIL', (house) => {
        self.house = house
        self.$nextTick(() => {
          utils.event.$emit('CHANGE_INITIAL_THUMBNAIL', self.house.photo)
          $('#house-modal').modal('show')
        })
      })
    },
    beforeDestroy() {
      utils.event.$off('HOUSE_DETAIL')
    },
    methods: {
      setOwner(house, owner) {
        house.owner = owner._id
      },
      addRoom() {
        let room = {
          number: '',
          size: '',
          floor: '',
          contract: '',
          rent: '',
          expenses: ''
        }
        this.house.rooms.push(new Room(room))
      },
      saveHouse() {
        let self = this
        this.house.clearRoom()
        utils.event.$emit('TRIGGER_THUMBNAIL', (data) => {
          if (data) {
            self.house.photo = data.thumbnail
          }
          if (this.house.isNew) {
            utils.restPost('/api/addHouse', self.house.toJSON()).then(
              response => {
                if (response) {
                  manager.houses.push(new House(response))
                  manager.sortHouse()
                  self.saveOwner()
                }
              }
            )
          }
          else {
            utils.restPost('/api/updateHouse', self.house.toJSON()).then(
              response => {
                if (response) {
                  for (let i = 0; i < manager.houses.length; i ++) {
                    if (manager.houses[i]._id == response._id) {
                      manager.houses.splice(i, 1, new House(response))
                    }
                  }
                  self.saveOwner()
                }
              }
            )
          }
        })
      },
      saveOwner() {
        let self = this
        if (manager.isNewOwner(self.house.owner)) {
          let data = {
            _id: self.house.owner,
            lord: manager.user._id
          }
          utils.restPost('/api/addOwner', data).then(
            response => {
              if (response) {
                manager.owners.push(new Owner(response))
                manager.sortOwner()
                $('#house-modal').modal('hide')
              }
            }
          )
        } else {
          $('#house-modal').modal('hide')
        }
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
  .select-form-row {
    display: flex;
    margin-bottom: 10px;
  }
  .select-form-row .select-image {
    flex: 0 0 auto;
    margin-right: 15px;
    width: 300px;
  }
  .select-form-row .select-data {
    flex: 2 1 auto;
  }
  .data-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }
  .data-row .modal-item {
    flex: 1 1 auto;
    margin: 0 5px;
  }
  .data-row .modal-item .btn {
    height: 47px;
    border: none;
  }
  .data-row .modal-item .btn:focus,
  .btn-group.open .dropdown-toggle {
    background: #e6e6e6;
    box-shadow: none;
  }
  .data-row .modal-item label {
    display: none;
  }
  .data-row .modal-item input[type="text"],
  .data-row .modal-item input[type="number"] {
    height: 47px;
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
  .room-form {
    padding: 10px 5px 10px 5px;
    border-top: 1px solid #eee;
  }
  .add-room {
    margin: 0px;
    padding: 10px;
    width: 100%;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 15px;
    letter-spacing: 1px;
    border-radius: 2px;
    background: #605ca8;
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
    .select-form-row {
      flex-direction: column;
    }
    .select-form-row .select-image {
      margin: 0 auto 20px;
      width: 100%;
      max-width: 300px;
    }
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
