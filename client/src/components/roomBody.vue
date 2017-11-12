<template>
  <div class="content-wrapper">
    <section class="content" v-on:click="closeSide">
      <div class="house-detail" v-if="manager.selectedHouse">
        <div class="box box-solid box-primary">
          <div class="box-header">
            {{manager.selectedHouse.name}}
            <div class="pull-right box-tools">
              <button type="button" class="btn btn-box-tool" data-widget="collapse">
                <i class="fa fa-minus"></i>
              </button>
            </div>
          </div>
          <div class="box-body text-blue">
            <div class="house-photo">
              <img class="resize-picture" :src="manager.selectedHouse.getPhoto()"></img>
            </div>
            <div class="house-info">
              <div class="house-row">
                <div class="house-title"><i class="fa fa-user"></i> オーナー：</div><div class="house-content">{{manager.selectedHouse.owner}}</div>
              </div>
              <div class="house-row">
                <div class="house-title"><i class="fa fa-map-pin"></i> アドレス：</div><div class="house-content">{{manager.selectedHouse.address}}</div>
              </div>
              <div class="house-row">
                <div class="house-title"><i class="fa fa-sticky-note"></i> 備考：</div><div class="house-content">{{manager.selectedHouse.note}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="row" v-for="index in Math.ceil(manager.selectedHouse.rooms.length / 2)">
          <div class="col-md-6">
            <roomBox :manager="manager" :room="manager.selectedHouse.rooms[(index - 1) * 2]"></roomBox>
          </div>
          <div class="col-md-6" v-if="manager.selectedHouse.rooms[(index - 1) * 2 + 1]">
            <roomBox :manager="manager" :room="manager.selectedHouse.rooms[(index - 1) * 2 + 1]"></roomBox>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import CONST from '@/store/const.js'
  import manager from '@/store/manager.js'
  import utils from '@/tool/utils.js'

  import Room from '@/store/room.js'
  import roomBox from '@/components/parts/roomBox'
  export default {
    props: ['manager'],
    mounted() {
      $('body').layout('fix')
      $('.box').boxWidget()
    },
    components: {
      roomBox: roomBox
    },
    methods: {
      closeSide() {
        if ($('.control-sidebar').hasClass('control-sidebar-open')) {
          $('.control-sidebar').removeClass('control-sidebar-open')
        }
      },
      addRoom() {
        console.log('add room')
      }
    },
    beforeDestroy() {
      manager.selectedHouse = null
    }
  }
</script>

<style scoped>
  section.content {
    height: 100%;
  }
  .box-body {
    display: flex;
  }
  .house-photo {
    border-radius: 3px;
    width: 180px;
    height: auto;
    margin: 10px;
  }
  .resize-picture {
    border-radius: 3px;
    width: 100%;
    height: auto;
    border: 1px solid #0073b7;
  }
  .house-info {
    width: calc(100% - 180px);
  }
  .house-row {
    margin: 10px;
    padding: 10px;
    font-size: 18px;
    overflow: hidden;
    background: #eee;
    border-radius: 5px;
  }
  .house-title {
    width: 120px;
    float: left;
  }
  .house-content {
    float: left;
    width: calc(100% - 120px);
  }
</style>
