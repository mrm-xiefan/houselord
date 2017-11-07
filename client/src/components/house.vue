<template>
  <div class="wrapper">
    <lockScreen :manager="manager"></lockScreen>
    <appHeader :manager="manager"></appHeader>
    <appSideMenu :manager="manager"></appSideMenu>
    <houseBody :manager="manager"></houseBody>
    <appFooter :manager="manager"></appFooter>
    <houseModal :manager="manager"></houseModal>
    <messageModal :manager="manager"></messageModal>
    <appControlPanel :manager="manager"></appControlPanel>
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
  import houseBody from '@/components/houseBody'
  import appFooter from '@/components/appFooter'
  import houseModal from '@/components/parts/houseModal'
  import messageModal from '@/components/parts/messageModal'
  import appControlPanel from '@/components/appControlPanel'
  export default {
    props: ['manager'],
    components: {
      lockScreen: lockScreen,
      appHeader: appHeader,
      appSideMenu: appSideMenu,
      houseBody: houseBody,
      appFooter: appFooter,
      houseModal: houseModal,
      messageModal: messageModal,
      appControlPanel: appControlPanel
    },
    mounted() {
      utils.socketEmit('enterLobby', {})
    }
  }
</script>

<style scoped>

</style>
