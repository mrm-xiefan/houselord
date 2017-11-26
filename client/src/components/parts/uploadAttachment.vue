<template>
  <div>
    <input id="upload-input-attachment" type="file" class="file" multiple></input>
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
        next: null,
        error: null
      }
    },
    created() {
      let self = this
      utils.event.$on('TRIGGER_UPLOAD', (next, error) => {
        if ($('#upload-input-attachment').fileinput('getFilesCount') > 0) {
          if (next) {
            self.next = next
          }
          else {
            self.next = null
          }
          if (error) {
            self.error = error
          }
          else {
            self.error = null
          }
          utils.event.$emit('LOCK_SCREEN', 'lock')
          $('#upload-input-attachment').fileinput('upload')
        }
        else {
          if (next) {
            next([])
          }
        }
      })
    },
    beforeDestroy() {
      utils.event.$off('TRIGGER_UPLOAD')
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
      $('#upload-input-attachment').fileinput({
        uploadUrl: uploadUrl,
        // allowedFileExtensions : null,
        // overwriteInitial: false,
        maxFilesNum: 20,
        maxFileSize: 2000000,
        // previewFileType: 'any',
        showCaption: true,
        showUpload: false,
        // showRemove: false,
        // showCancel: false,
        showClose: false,
        showBrowse: true,
        showPreview: false,
        browseOnZoneClick: false,
        // removeFromPreviewOnError: false,
        // previewFileIcon: '<i class="fa fa-file"></i>',
        browseIcon: '<i class="fa fa-paperclip"></i>',
        browseLabel: 'Attachment',
        browseClass: 'btn btn-default',
        removeIcon: '<i class="fa fa-chain-broken"></i>',
        removeLabel: 'Clear',
        removeClass: 'btn btn-default',
        cancelIcon: '<i class="fa fa-ban"></i>',
        cancelClass: 'btn btn-default',
        uploadIcon: '<i class="fa fa-upload"></i>',
        uploadClass: 'btn btn-default',
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
      $('#upload-input-attachment').on('filebatchuploadsuccess', (event, data, previewId, index) => {
        utils.event.$emit('LOCK_SCREEN', 'unlock')
        let form = data.form, files = data.files, extra = data.extra, response = data.response, reader = data.reader
        if (!response.error) {
          if (self.next) {
            self.next(response.data)
            self.next = null
            self.error = null
          }
        }
        else {
          utils.event.$emit('SHOW_MESSAGE', response.error)
          if (self.error) {
            self.error()
            self.next = null
            self.error = null
          }
        }
        $('#upload-input-attachment').fileinput('clear')
      })
      // $('#upload-input-attachment').on('fileuploaded', (event, data, previewId, index) => {
      // })
      // $('#upload-input-attachment').on('fileuploaderror', (event, numFiles, label) => {
      // })
      $('#upload-input-attachment').on('filebatchuploaderror', (event, numFiles, label) => {
        utils.event.$emit('LOCK_SCREEN', 'unlock')
        $('#upload-input-attachment').fileinput('clear')
        utils.event.$emit('SHOW_MESSAGE', 'S006')
        if (self.error) {
          self.error()
          self.next = null
          self.error = null
        }
      })
    }
  }
</script>

<style scoped>

</style>
