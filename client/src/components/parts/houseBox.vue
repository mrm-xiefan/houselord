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
                      utils.event.$emit('REFRESH_HOUSE')
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
        manager.selectedHouse = house
        this.$router.push({path: '/room/' + house._id})
      }
    }
  }
</script>

<style scoped>
  .house-box {
    float: left;
    width: 280px;
    height: auto;
    margin: 10px;
    padding: 0px;
    background: #f4f4f4;
    border-radius: 3px;
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.4);
    cursor: pointer;
  }
  .house-box:hover {
    box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.4);
  }
  .image-container {
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    width: 100%;
    height: auto;
    position: relative;
  }
  .resize-picture {
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    width: 100%;
    height: auto;
  }
  .house-tool {
    position: absolute;
    bottom: 0px;
    padding: 5px;
    margin: 5px;
    font-size: 24px;
    text-align: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    z-index: 100;
    opacity: 0.7;
  }
  .house-tool:hover {
    opacity: 1;
  }
  .delete-tool {
    right: 55px;
  }
  .edit-tool {
    right: 5px;
  }
  .house-info {
    width: 100%;
    text-align: center;
    padding: 10px;
  }
</style>
