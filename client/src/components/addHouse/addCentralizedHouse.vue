<template>
  <div class="wrapper">
    <lockScreen :manager="manager"></lockScreen>
    <appHeader :manager="manager"></appHeader>
    <appSideMenu :manager="manager"></appSideMenu>
    <addCentralizedHouseBody :manager="manager"></addCentralizedHouseBody>
    <feeModal :manager="manager"></feeModal>
    <appFooter :manager="manager"></appFooter>
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
  import addCentralizedHouseBody from '@/components/addHouse/addCentralizedHouseBody'
  import feeModal from '@/components/parts/feeModal'
  import appFooter from '@/components/appFooter'
  import messageModal from '@/components/parts/messageModal'
  import appControlPanel from '@/components/appControlPanel'
  export default {
    props: ['manager'],
    components: {
      lockScreen: lockScreen,
      appHeader: appHeader,
      appSideMenu: appSideMenu,
      addCentralizedHouseBody: addCentralizedHouseBody,
      feeModal: feeModal,
      appFooter: appFooter,
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
