<template>
  <div class="wrapper">
    <lockScreen :manager="manager"></lockScreen>
    <appHeader :manager="manager"></appHeader>
    <appSideMenu :manager="manager"></appSideMenu>
    <centralizedRoomBody :manager="manager" v-if="manager.room.house && !manager.room.house.distributed"></centralizedRoomBody>
    <distributedRoomBody :manager="manager" v-if="manager.room.house && manager.room.house.distributed"></distributedRoomBody>
    <appFooter :manager="manager"></appFooter>
    <messageModal :manager="manager"></messageModal>
    <appControlPanel :manager="manager"></appControlPanel>
    <uploadModal :manager="manager"></uploadModal>
    <mediaDetailModal :manager="manager"></mediaDetailModal>
    <div class="control-sidebar-bg"></div>
  </div>
</template>

<script>
  import CONST from '@/store/const.js'
  import manager from '@/store/manager.js'
  import utils from '@/tool/utils.js'

  import lockScreen from '@/components/parts/lockScreen'
  import appHeader from '@/components/appHeader'
  import appSideMenu from '@/components/appSideMenu'
  import centralizedRoomBody from '@/components/room/centralizedRoomBody'
  import distributedRoomBody from '@/components/room/distributedRoomBody'
  import appFooter from '@/components/appFooter'
  import messageModal from '@/components/parts/messageModal'
  import appControlPanel from '@/components/appControlPanel'
  import uploadModal from '@/components/parts/uploadModal'
  import mediaDetailModal from '@/components/parts/mediaDetailModal'
  export default {
    props: ['manager'],
    components: {
      lockScreen: lockScreen,
      appHeader: appHeader,
      appSideMenu: appSideMenu,
      centralizedRoomBody: centralizedRoomBody,
      distributedRoomBody: distributedRoomBody,
      appFooter: appFooter,
      messageModal: messageModal,
      appControlPanel: appControlPanel,
      uploadModal: uploadModal,
      mediaDetailModal: mediaDetailModal
    },
    mounted() {
      utils.socketEmit('enterLobby', {})
    }
  }
</script>

<style scoped>

</style>
