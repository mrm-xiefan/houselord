<template>
  <div class="house-box" v-on:click="openHouse(house)">
    <div class="image-container">
      <div class="house-tool delete-tool bg-purple" v-on:click.stop="deleteHouse(house)">
        <i class="glyphicon glyphicon-trash"></i>
      </div>
      <div class="house-tool edit-tool bg-blue" v-on:click.stop="editHouse(house)">
        <i class="glyphicon glyphicon-edit"></i>
      </div>
      <img class="resize-picture" :src="house.getPhoto()"></img>
    </div>
    <div class="house-info text-muted">
      {{house.name}}
    </div>
  </div>
</template>

<script>
  import CONST from '@/store/const.js'
  import manager from '@/store/manager.js'
  import utils from '@/tool/utils.js'

  export default {
    props: ['manager', 'house'],
    methods: {
      deleteHouse(house) {
        utils.event.$emit(
          'SHOW_MESSAGE',
          'I002',
          () => {
            utils.restPost('/api/deleteHouse', house.toJSON()).then(
              response => {
                if (response) {
                  for (let i = 0; i < manager.houses.length; i ++) {
                    if (manager.houses[i]._id == house._id) {
                      manager.houses.splice(i, 1)
                      break
                    }
                  }
                }
              }
            )
          }
        )
      },
      editHouse(house) {
        utils.event.$emit('HOUSE_DETAIL', utils.clone(house))
      },
      openHouse(house) {
        console.log('open')
      }
    }
  }
</script>

<style scoped>
  .house-box {
    float: left;
    width: 150px;
    height: 200px;
    margin: 10px;
    padding: 0px;
    background: #f4f4f4;
    border: 1px solid #eee;
    border-radius: 3px;
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.4);
    cursor: pointer;
    position: relative;
  }
  .house-box:hover {
    box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.4);
  }
  .image-container {
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    width: 100%;
    height: 150px;
    position: relative;
  }
  .resize-picture {
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    width: 100%;
    height: auto;
    max-height: 150px;
  }
  .house-tool {
    position: absolute;
    bottom: 0px;
    padding: 5px;
    margin: 5px;
    font-size: 9px;
    text-align: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    z-index: 100;
    opacity: 0.7;
  }
  .house-tool:hover {
    opacity: 1;
  }
  .delete-tool {
    right: 30px;
  }
  .edit-tool {
    right: 0px;
  }
  .house-info {
    width: 100%;
    text-align: center;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 10px;
    position: absolute;
    bottom: 0px;
  }
</style>
