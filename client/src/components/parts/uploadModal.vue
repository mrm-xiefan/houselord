<template>
  <div class="modal fade in" id="upload-modal" tabindex="-1" role="dialog" aria-labelledby="uploadModalLabel" aria-hidden="true" data-show="true" data-keyboard="false" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" id="close-upload" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title text-blue">UPLOAD FILES</h4>
        </div>
        <div class="modal-body">
          <input id="upload-input" type="file" class="file" multiple></input>
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
        next: null
      }
    },
    created() {
      let self = this
      utils.event.$on('SHOW_UPLOAD', (next) => {
        if (next) {
          self.next = next
        }
        else {
          self.next = null
        }
        $('#upload-modal').modal('show')
      })
    },
    beforeDestroy() {
      utils.event.$off('SHOW_UPLOAD')
    },
    mounted() {
      let self = this
      let uploadUrl = ''
      if (manager.controller.cors) {
        uploadUrl = CONST.developHost
      }
      else {
        uploadUrl = '/'
      }
      uploadUrl += 'uploadFiles'
      $('#upload-input').fileinput({
        uploadUrl: uploadUrl,
        allowedFileExtensions : ['JPG', 'JPEG', 'PNG', 'TIF', 'TIFF'],
        // overwriteInitial: false,
        maxFilesNum: 20,
        maxFileSize: 2000000,
        // previewFileType: 'any',
        // showCaption: true,
        // showUpload: false,
        // showRemove: false,
        showCancel: false,
        showClose: false,
        showBrowse: true,
        browseOnZoneClick: true,
        // removeFromPreviewOnError: false,
        // previewFileIcon: '<i class="fa fa-file"></i>',
        browseIcon: '<i class="fa fa-folder-open-o"></i>',
        removeIcon: '<i class="fa fa-trash"></i>',
        removeClass: 'btn btn-primary',
        cancelIcon: '<i class="fa fa-ban"></i>',
        cancelClass: 'btn btn-primary',
        uploadIcon: '<i class="fa fa-upload"></i>',
        uploadClass: 'btn btn-primary',
        // msgValidationErrorIcon: '<i class="fa fa-info-circle"></i>',
        fileActionSettings: {
          showRemove: true,
          removeIcon: '<i class="fa fa-trash"></i>',
          showUpload: false,
          uploadIcon: '<i class="fa fa-upload"></i>',
          showZoom: false,
          indicatorNew: ''
        },
        // slugCallback: (filename) => {
        //   return filename.replace('(', '_').replace(']', '_')
        // },
        uploadAsync: false
      })
      $('#upload-input').on('filepreajax', (event, previewId, index) => {
        $('#close-upload').hide()
        utils.event.$emit('LOCK_SCREEN', 'lock')
      })
      // $('#upload-input').on('fileloaded', () => {
      //   let cnt = $(this).closest('.file-input').find('.file-preview-frame').size()
      //   if (cnt > 1) {
      //     for (let idx = cnt - 2; idx >= 0; idx --) {
      //       $(this).closest('.file-input').find('.file-preview-frame:eq(' + idx + ') .kv-file-remove').click()
      //     }
      //   }
      // })
      $('#upload-input').on('filebatchuploadsuccess', (event, data, previewId, index) => {
        utils.event.$emit('LOCK_SCREEN', 'unlock')
        let form = data.form, files = data.files, extra = data.extra, response = data.response, reader = data.reader
        if (!response.error) {
          if (self.next) {
            self.next(response.data)
            self.next = null
          }
        }
        else {
          utils.event.$emit('SHOW_MESSAGE', response.error)
        }
        $('#upload-input').fileinput('clear')
        $('#close-upload').show()
        $('#upload-modal').modal('hide')
      })
      // $('#upload-input').on('fileuploaded', (event, data, previewId, index) => {
      //   $('#close-upload').show()
      // })
      // $('#upload-input').on('fileuploaderror', (event, numFiles, label) => {
      // })
      $('#upload-input').on('fileuploaderror', (event, numFiles, label) => {
        utils.event.$emit('LOCK_SCREEN', 'unlock')
        $('#close-upload').show()
      })
      $('#upload-input').on('filebatchuploaderror', (event, numFiles, label) => {
        utils.event.$emit('LOCK_SCREEN', 'unlock')
        $('#upload-input').fileinput('clear')
        $('#close-upload').show()
        $('#upload-modal').modal('hide')
        utils.event.$emit('SHOW_MESSAGE', 'S006')
      })
    }
  }
</script>

<style scoped>

</style>
