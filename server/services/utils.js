import conf from 'config'
import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'
import moment from 'moment'
import logger from './logger.js'

class Utils {
  constructor() {
  }
  isFileExist(filename) {
    try {
      fs.statSync(filename)
    }
    catch(err) {
      if (err.code === 'ENOENT') {
        return false
      }
    }
    return true
  }
  writeFile(filename, contents, next) {
    mkdirp(path.dirname(filename), (err) => {
      if (err) {
        logger.error(JSON.stringify(err))
        next('S002')
      }
      else {
        fs.writeFile(filename, contents, (err) => {
          if (err) {
            logger.error(JSON.stringify(err))
            next('S002')
          }
          else {
            next(null)
          }
        })
      }
    })
  }
  appendFile(filename, contents, next) {
    mkdirp(path.dirname(filename), (err) => {
      if (err) {
        logger.error(JSON.stringify(err))
        next('S002')
      }
      else {
        fs.appendFile(filename, contents, (err) => {
          if (err) {
            logger.error(JSON.stringify(err))
            next('S002')
          }
          else {
            next(null)
          }
        })
      }
    })
  }
  deleteFile(filename, next) {
    fs.unlink(filename, (err) => {
      if (err) {
        logger.error(JSON.stringify(err))
        next('S002')
      }
      else {
        next(null)
      }
    })
  }
  readFile(filename, next) {
    fs.readFile(filename, 'utf8', (err, text) => {
      if (err) {
        logger.error(JSON.stringify(err))
        next('S002', null)
      }
      else {
        next(null, text)
      }
    })
  }
  getFileList(filepath, ext, next) {
    let self = this
    fs.readdir(filepath, (err, files) => {
      if (err) {
        logger.error(JSON.stringify(err))
        next('S002', null)
      }
      else {
        let fileList = []
        let idx = 0
        self.filterFile(filepath, files, idx, ext, fileList, (err) => {
          if (err) {
            next(err, null)
          }
          else {
            next(null, fileList)
          }
        })
      }
    })
  }
  filterFile(filepath, files, idx, ext, fileList, next) {
    let self = this
    if (idx >= files.length) {
      next(null)
      return
    }
    else {
      if (!ext || (ext && path.extname(files[idx]) == ('.' + ext))) {
        let filename = path.join(filepath, path.basename(files[idx]))
        let filestat = fs.statSync(filename)
        let name = path.basename(files[idx], path.extname(files[idx]))
        let udate = filestat.mtime.getTime()
        fileList.push({
          file: filename,
          name: name,
          date: udate
        })
        self.filterFile(filepath, files, idx + 1, ext, fileList, next)
      }
      else {
        self.filterFile(filepath, files, idx + 1, ext, fileList, next)
      }
    }
  }
}

export default new Utils()
