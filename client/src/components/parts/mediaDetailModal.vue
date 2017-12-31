<template>
  <div class="modal fade in" id="media-detail-modal" tabindex="-1" role="dialog" aria-labelledby="mediaDetailModalLabel" aria-hidden="true"
    data-show="true" data-keyboard="true" data-backdrop="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" id="close-detail" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title text-blue">
            <i class="fa fa-info-circle" style="margin-right: 3px"></i>Preview
          </h4>
        </div>
        <div class="modal-body" v-if="object">
          <div class="image-container">
            <img class="resize-picture" :src="object.file" v-if="object.file"></img>
            <img class="resize-picture" src="/static/noimage.png" v-else></img>
          </div>
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
        object: null
      }
    },
    mounted() {
      let self = this
      utils.event.$on('MEDIA_DETAIL', (object) => {
        self.object = object
        $('#media-detail-modal').modal('show')
      })
      $('#media-detail-modal').on('hidden.bs.modal', (event) => {
        self.object = null
      })
    },
    beforeDestroy() {
      utils.event.$off('MEDIA_DETAIL')
      $('#media-detail-modal').off('hidden.bs.modal')
    }
  }
</script>

<style scoped>
  #media-detail-modal .modal-header .close {
    margin-top: 0px;
  }
  #media-detail-modal .modal-header {
    padding: 7px 15px 5px;
  }
  #media-detail-modal .modal-title {
    color: #333 !important;
    font-size: 14px;
    font-weight: 100;
    letter-spacing: 1px;
  }
  #media-detail-modal .modal-header i {
    display: none;
  }
  #media-detail-modal .modal-body {
    padding: 0;
  }
  #media-detail-modal .modal-body .audio-container {
    padding: 20px 0;
    text-align: center;
  }
  video {
    width: 100%;
  }
  audio {
    width: 100%;
  }
  .audio-container img {
    flex: 0 0 auto;
    margin-right: 20px;
    width: 185px;
    height: 185px;
    background: #e8e9e9;
  }
  .resize-picture {
    width: 100%;
    height: 100%
  }
</style>
