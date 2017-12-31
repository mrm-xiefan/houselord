<template>
  <div class="content-wrapper">
    <section class="content" v-on:click="closeSide">
      <div class="bg-blue room-header">
        <i class="fa fa-edit"></i> 部屋編集
      </div>

      <div class="bg-gray-light room-body">
        <h4>1.物件情報を変更する</h4>
        <div class="row">
          <div class="col-md-4">
            <div class="input-group">
              <label class="input-label"><span class="text-red require">(＊)</span>物件名：</label>
              <div class="input-text">
                <input v-model="manager.room.house.name" type="text" class="form-control" placeholder="入力">
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="input-group">
              <label class="input-label">築年月：</label>
              <div class="input-text">
                <input v-model="manager.room.house.built" type="text" class="form-control" placeholder="入力">
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="input-group button-margin">
              <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                <span class="dropdown-text" v-if="manager.room.house.construction == ''">構造</span>
                <span class="dropdown-text" v-else>{{constructionName}}</span>
              </button>
              <ul class="dropdown-menu">
                <li v-for="construction in manager.constructions" class="selection-item">
                  <a v-on:click="setConstruction(construction)">{{construction.name}}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="input-group">
              <label class="input-label"><span class="text-red require">(＊)</span>アドレス：</label>
              <div class="input-text">
                <input v-model="manager.room.house.address" type="text" class="form-control" placeholder="入力">
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="input-group">
              <label class="input-label">交通：</label>
              <div class="input-text">
                <input v-model="manager.room.house.traffic" type="text" class="form-control" placeholder="入力">
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="input-group">
              <label class="input-label">備考：</label>
              <div class="input-text">
                <input v-model="manager.room.house.note" type="text" class="form-control" placeholder="入力">
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="house-photos" v-if="manager.room.house.photos && manager.room.house.photos.length > 0" v-masonry transition-duration="0.3s" item-selector=".house-photos">
              <div class="house-photo" v-masonry-tile :key="manager.room.house._id + index" v-for="photo, index in manager.room.house.photos" v-on:click="showDetail(photo)">
                <img class="resize-picture" :src="photo.thumbnail">
                <i class="fa fa-close bg-blue" v-on:click.stop="removeHousePhoto(index)"></i>
              </div>
            </div>
            <div class="room-action">
              <button type="button" class="btn btn-primary" style="width: 200px;" v-on:click="uploadHousePhotos()">
                <i class="fa fa-upload"></i> 物件写真をアップロード
              </button>
            </div>
          </div>
        </div>

        <h4 class="margin-top">2.部屋情報を変更する</h4>
        <div class="row">
          <div class="col-md-4">
            <div class="input-group">
              <label class="input-label"><span class="text-red require">(＊)</span>部屋番号：</label>
              <div class="input-text">
                <input v-model="manager.room.room.number" type="text" class="form-control" placeholder="入力">
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="input-group button-margin">
              <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                <span class="dropdown-text" v-if="manager.room.room.layout == ''">間取り</span>
                <span class="dropdown-text" v-else>{{layoutName}}</span>
              </button>
              <ul class="dropdown-menu">
                <li v-for="layout in manager.layouts" class="selection-item">
                  <a v-on:click="setLayout(layout)">{{layout.name}}</a>
                </li>
              </ul>
            </div>
          </div>
          <div class="col-md-4">
            <div class="input-group button-margin">
              <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                <span class="dropdown-text" v-if="manager.room.room.aspect == ''">取引態様</span>
                <span class="dropdown-text" v-else>{{aspectName}}</span>
              </button>
              <ul class="dropdown-menu">
                <li v-for="aspect in manager.aspects" class="selection-item">
                  <a v-on:click="setAspect(aspect)">{{aspect.name}}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <div class="input-group">
              <label class="input-label">礼金：</label>
              <div class="input-text">
                <input v-model="manager.room.room.keyMoney" type="number" class="form-control" step="1000" placeholder="入力">
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="input-group">
              <label class="input-label"><span class="text-red require">(＊)</span>家賃：</label>
              <div class="input-text">
                <input v-model="manager.room.room.rent" type="number" class="form-control" step="1000" placeholder="入力">
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="input-group">
              <label class="input-label">敷金：</label>
              <div class="input-text">
                <input v-model="manager.room.room.deposit" type="number" class="form-control" step="1000" placeholder="入力">
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <div class="input-group">
              <label class="input-label">管理費：</label>
              <div class="input-text">
                <input v-model="manager.room.room.management" type="number" class="form-control" step="1000" placeholder="入力">
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="input-group">
              <label class="input-label">面積：</label>
              <div class="input-text">
                <input v-model="manager.room.room.area" type="text" class="form-control" placeholder="入力">
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="input-group button-margin">
              <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                <span class="dropdown-text" v-if="manager.room.room.direction == ''">部屋方角</span>
                <span class="dropdown-text" v-else>{{directionName}}</span>
              </button>
              <ul class="dropdown-menu">
                <li v-for="direction in manager.directions" class="selection-item">
                  <a v-on:click="setDirection(direction)">{{direction.name}}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="room-photos" v-if="manager.room.room.photos && manager.room.room.photos.length > 0" v-masonry transition-duration="0.3s" item-selector=".room-photo">
              <div class="room-photo" v-masonry-tile :key="manager.room.room._id + index" v-for="photo, index in manager.room.room.photos" v-on:click="showDetail(photo)">
                <img class="resize-picture" :src="photo.thumbnail">
                <i class="fa fa-close bg-blue" v-on:click.stop="removeRoomPhoto(index)"></i>
              </div>
            </div>
            <div class="room-action">
              <button type="button" class="btn btn-primary" style="width: 200px;" v-on:click="uploadRoomPhotos()">
                <i class="fa fa-upload"></i> 部屋写真をアップロード
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="room-action">
        <button type="button" class="btn btn-primary" :disabled="!isValid" v-on:click="save()">
            <i class="fa fa-save"></i> 保存
          </button>
        <button type="button" class="btn btn-default text-blue" v-on:click="backward">
          <i class="fa fa-reply"></i> 戻る
        </button>
      </div>
    </section>
  </div>
</template>

<script>
  import CONST from '@/store/const.js'
  import manager from '@/store/manager.js'
  import utils from '@/tool/utils.js'

  export default {
    props: ['manager'],
    mounted() {
      $('body').layout('fix')
    },
    computed: {
      isValid() {
        if (!manager.room.house.name) return false
        if (!manager.room.house.address) return false
        if (!manager.room.room.number) return false
        if (Number(manager.room.room.rent) <= 0) return false
        if (Number(manager.room.room.keyMoney) < 0) return false
        if (Number(manager.room.room.deposit) < 0) return false
        if (Number(manager.room.room.management) < 0) return false
        return true
      },
      aspectName() {
        if (manager.room.room.aspect) {
          return CONST.aspects[manager.room.room.aspect].name
        }
        return ''
      },
      directionName() {
        if (manager.room.room.direction) {
          return CONST.directions[manager.room.room.direction].name
        }
        return ''
      },
      constructionName() {
        if (manager.room.house.construction) {
          return CONST.constructions[manager.room.house.construction].name
        }
        return ''
      },
      layoutName() {
        if (manager.room.room.layout) {
          return CONST.layouts[manager.room.room.layout].name
        }
        return ''
      }
    },
    methods: {
      closeSide() {
        if ($('.control-sidebar').hasClass('control-sidebar-open')) {
          $('.control-sidebar').removeClass('control-sidebar-open')
        }
      },
      setAspect(aspect) {
        manager.room.room.aspect = aspect.value
      },
      setDirection(direction) {
        manager.room.room.direction = direction.value
      },
      setConstruction(construction) {
        manager.room.house.construction = construction.value
      },
      setLayout(layout) {
        manager.room.room.layout = layout.value
      },
      showDetail(photo) {
        utils.event.$emit('MEDIA_DETAIL', photo)
      },
      removeHousePhoto(index) {
        manager.room.house.photos.splice(index, 1)
        let house = {
          _id: manager.room.house._id,
          photos: manager.room.house.photos
        }
        utils.restPost('/api/updateHouse', {house: house}).then(
          response => {
            if (response) {
              //
            }
          }
        )
      },
      removeRoomPhoto(index) {
        manager.room.room.photos.splice(index, 1)
        let room = {
          _id: manager.room.room._id,
          photos: manager.room.room.photos
        }
        utils.restPost('/api/updateRoom', {room: room}).then(
          response => {
            if (response) {
              //
            }
          }
        )
      },
      uploadHousePhotos() {
        let self = this
        utils.event.$emit('SHOW_UPLOAD', (photos) => {
          if (!photos || photos.length <= 0) {
            return
          }
          for (let i = 0; i < photos.length; i ++) {
            manager.room.house.photos.push(photos[i])
          }
          let house = {
            _id: manager.room.house._id,
            photos: manager.room.house.photos
          }
          utils.restPost('/api/updateHouse', {house: house}).then(
            response => {
              if (response) {
                //
              }
            }
          )
        })
      },
      uploadRoomPhotos() {
        let self = this
        utils.event.$emit('SHOW_UPLOAD', (photos) => {
          if (!photos || photos.length <= 0) {
            return
          }
          for (let i = 0; i < photos.length; i ++) {
            manager.room.room.photos.push(photos[i])
          }
          let room = {
            _id: manager.room.room._id,
            photos: manager.room.room.photos
          }
          utils.restPost('/api/updateRoom', {room: room}).then(
            response => {
              if (response) {
                //
              }
            }
          )
        })
      },
      save() {
        let self = this
        let house = {
          _id: manager.room.house._id,
          name: manager.room.house.name,
          built: manager.room.house.built,
          construction: manager.room.house.construction,
          address: manager.room.house.address,
          traffic: manager.room.house.traffic,
          note: manager.room.house.note
        }
        let room = {
          _id: manager.room.room._id,
          number: manager.room.room.number,
          layout: manager.room.room.layout,
          aspect: manager.room.room.aspect,
          area: manager.room.room.area,
          direction: manager.room.room.direction,
          keyMoney: manager.room.room.keyMoney,
          rent: manager.room.room.rent,
          deposit: manager.room.room.deposit,
          management: manager.room.room.management
        }
        utils.restPost('/api/saveRoom', {house: house, room: room}).then(
          response => {
            if (response) {
              self.$router.push({name: 'house'})
            }
          }
        )
      },
      backward() {
        this.$router.go(-1)
      }
    }
  }
</script>

<style scoped>
  h4 {
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #ccc;
  }
  .margin-top {
    margin-top: 40px;
  }
  .room-header {
    padding: 15px;
    border-radius: 3px;
    margin-bottom: 10px;
  }
  .room-body {
    padding: 15px;
    border: 1px solid #aaa;
    border-radius: 3px;
  }
  .input-group {
    display: flex;
    width: 100%;
    margin-bottom: 10px;
  }
  .button-margin {
    margin-left: 50px;
  }
  .button-margin .btn {
    width: 205px;
  }
  .dropdown-menu {
    max-height: 200px;
    overflow-y: auto;
  }
  .input-label {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 120px;
    padding: 5px;
    margin: 0px;
  }
  .input-text {
    width: calc(100% - 120px);
    margin-right: 20px;
  }
  .house-photos,
  .room-photos {
    width: 100%;
    min-height: 200px;
    overflow: hidden;
  }
  .house-photo,
  .room-photo {
    float: left;
    cursor: pointer;
    position: relative;
    width: 200px;
    height: auto;
    margin: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .resize-picture {
    width: 100%;
    height: auto;
  }
  .house-photo i,
  .room-photo i {
    position: absolute;
    top: 3px;
    right: 3px;
    font-size: 18px;
    font-weight: 100;
    transition: .2s;
    height: 25px;
    width: 25px;
    border-radius: 50%;
    padding: 3px 0px 0px 5px;
  }
  .house-photo i:hover,
  .room-photo i:hover {
    opacity: 0.7;
  }
  .upload-input {
    padding-left: 35px;
    padding-right: 35px;
  }
  .room-action {
    margin-top: 20px;
    width: 100%;
    display: flex;
    justify-content: space-around;
  }
  .room-action button {
    width: 120px;
  }
</style>
