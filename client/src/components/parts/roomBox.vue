<template>
  <div class="room-box" v-on:click="openRoom(room)">
    <div class="image-container">
      <div class="room-tool delete-tool bg-purple" v-on:click.stop="deleteRoom(room)">
        <i class="glyphicon glyphicon-trash"></i>
      </div>
      <!-- <div class="room-tool edit-tool bg-blue" v-on:click.stop="editRoom(room)">
        <i class="glyphicon glyphicon-edit"></i>
      </div> -->
      <!-- <img class="resize-picture" :src="room.getPhoto()"></img> -->
    </div>
    <div class="room-info text-muted">
      {{room.number}}
    </div>
  </div>
</template>

<script>
  import CONST from '@/store/const.js'
  import manager from '@/store/manager.js'
  import utils from '@/tool/utils.js'

  export default {
    props: ['manager', 'room'],
    methods: {
      deleteRoom(room) {
        utils.event.$emit(
          'SHOW_MESSAGE',
          'I002',
          () => {
            utils.restPost('/api/deleteRoom', room.toJSON()).then(
              response => {
                if (response) {
                  for (let i = 0; i < manager.rooms.length; i ++) {
                    if (manager.rooms[i]._id == room._id) {
                      manager.rooms.splice(i, 1)
                      break
                    }
                  }
                }
              }
            )
          }
        )
      },
      editRoom(room) {
        utils.event.$emit('HOUSE_DETAIL', utils.clone(room))
      },
      openRoom(room) {
        console.log('open')
      }
    }
  }
</script>

<style scoped>
  .room-box {
    float: left;
    width: 200px;
    height: auto;
    margin: 10px;
    padding: 0px;
    background: #f4f4f4;
    border-radius: 3px;
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.4);
    cursor: pointer;
  }
  .room-box:hover {
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
  .room-tool {
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
  .room-tool:hover {
    opacity: 1;
  }
  .delete-tool {
    right: 30px;
  }
  .edit-tool {
    right: 0px;
  }
  .room-info {
    width: 100%;
    text-align: center;
    padding: 10px;
  }
</style>
