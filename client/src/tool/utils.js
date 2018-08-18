import axios from 'axios/dist/axios.min.js'
import CONST from '@/store/const.js'
import Vue from 'vue'

class Utils {
  constructor() {
  }
  init(cors, router) {
    let options = {
      timeout: CONST.httpTimeout,
      withCredentials: true,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }
    if (cors) {
      options.baseURL = CONST.developHost
    }
    this.api = axios.create(options)
    this.event = new Vue()
    this.socket = null
    this.router = router
  }
  async restGet(api, params, mockData = null, giveMeError = null) {
    var self = this
    let options = {
      params: params
    }
    if (mockData || giveMeError) {
      const mockAdapter = (config) => {
        return new Promise((resolve, reject) => {
          if (giveMeError == 'network') {
            reject({data: null, status: 400})
          }
          else if (giveMeError == 'server') {
            resolve({data: {error: 'S002', data: null}, status: 200})
          }
          else {
            resolve({data: {error: null, data: mockData}, status: 200})
          }
        })
      }
      options.adapter = mockAdapter
    }

    let responseData = null
    // server response should be {error: errorcode, data: json}
    self.event.$emit('LOCK_SCREEN', 'lock')
    await this.api.get(api, options).then(
      response => {
        // console.log(response.data)
        // console.log(response.status)
        self.event.$emit('LOCK_SCREEN', 'unlock')
        // server error
        if (response.data.error) {
          if (response.data.error == 'B900') {
            this.router.push({name: 'error'})
          }
          else {
            self.event.$emit('SHOW_MESSAGE', response.data.error)
          }
        }
        responseData = response.data
      }
    ).catch(
      error => {
        self.event.$emit('LOCK_SCREEN', 'unlock')
        // if (error.response) {
        //   console.log(error.response.headers)
        // }
        // if (error.request) {
        //   console.log(error.request)
        // }
        // console.log(error.message)
        // console.log(error.config)

        // network error
        self.event.$emit('SHOW_MESSAGE', 'S001')
        responseData = {error: 'S001', data: null}
      }
    )

    return new Promise((resolve, reject) => {
      if (responseData.error) {
        // ever thing has done for error, so not reject.
        // but data is null.
        resolve(null)
        // reject(responseData)
      }
      else {
        resolve(responseData.data)
      }
    })
  }
  async restPost(api, params) {
    var self = this
    let options = {
      params: params
    }

    let responseData = null
    // server response should be {error: errorcode, data: json}
    self.event.$emit('LOCK_SCREEN', 'lock')
    await this.api.post(api, options).then(
      response => {
        self.event.$emit('LOCK_SCREEN', 'unlock')
        // server error
        if (response.data.error) {
          if (response.data.error == 'B900') {
            this.router.push({name: 'error'})
          }
          else {
            self.event.$emit('SHOW_MESSAGE', response.data.error)
          }
        }
        responseData = response.data
      }
    ).catch(
      error => {
        self.event.$emit('LOCK_SCREEN', 'unlock')
        // network error
        self.event.$emit('SHOW_MESSAGE', 'S001')
        responseData = {error: 'S001', data: null}
      }
    )

    return new Promise((resolve, reject) => {
      if (responseData.error) {
        resolve(null)
        // reject(responseData)
      }
      else {
        resolve(responseData.data)
      }
    })
  }
  async restPut(api, params) {
    var self = this
    let options = {
      params: params
    }

    let responseData = null
    // server response should be {error: errorcode, data: json}
    self.event.$emit('LOCK_SCREEN', 'lock')
    await this.api.put(api, options).then(
      response => {
        self.event.$emit('LOCK_SCREEN', 'unlock')
        // server error
        if (response.data.error) {
          if (response.data.error == 'B900') {
            this.router.push({name: 'error'})
          }
          else {
            self.event.$emit('SHOW_MESSAGE', response.data.error)
          }
        }
        responseData = response.data
      }
    ).catch(
      error => {
        self.event.$emit('LOCK_SCREEN', 'unlock')
        // network error
        self.event.$emit('SHOW_MESSAGE', 'S001')
        responseData = {error: 'S001', data: null}
      }
    )

    return new Promise((resolve, reject) => {
      if (responseData.error) {
        resolve(null)
        // reject(responseData)
      }
      else {
        resolve(responseData.data)
      }
    })
  }
  async restDelete(api, params) {
    var self = this
    let options = {
      data: params,
      params: params
    }

    let responseData = null
    // server response should be {error: errorcode, data: json}
    self.event.$emit('LOCK_SCREEN', 'lock')
    await this.api.delete(api, options).then(
      response => {
        self.event.$emit('LOCK_SCREEN', 'unlock')
        // server error
        if (response.data.error) {
          if (response.data.error == 'B900') {
            this.router.push({name: 'error'})
          }
          else {
            self.event.$emit('SHOW_MESSAGE', response.data.error)
          }
        }
        responseData = response.data
      }
    ).catch(
      error => {
        self.event.$emit('LOCK_SCREEN', 'unlock')
        // network error
        self.event.$emit('SHOW_MESSAGE', 'S001')
        responseData = {error: 'S001', data: null}
      }
    )

    return new Promise((resolve, reject) => {
      if (responseData.error) {
        resolve(null)
        // reject(responseData)
      }
      else {
        resolve(responseData.data)
      }
    })
  }
  async authenticate(user) {
    var self = this

    let responseData = null
    self.event.$emit('LOCK_SCREEN', 'lock')
    await this.api.post('/authenticate', user).then(
      response => {
        self.event.$emit('LOCK_SCREEN', 'unlock')
        // server error
        if (response.data.error) {
          if (response.data.error == 'B900') {
            this.router.push({name: 'error'})
          }
          else {
            self.event.$emit('SHOW_MESSAGE', response.data.error)
          }
        }
        responseData = response.data
      }
    ).catch(
      error => {
        self.event.$emit('LOCK_SCREEN', 'unlock')
        // network error
        self.event.$emit('SHOW_MESSAGE', 'S001')
        responseData = {error: 'S001', data: null}
      }
    )

    return new Promise((resolve, reject) => {
      if (responseData.error) {
        resolve(null)
        // reject(responseData)
      }
      else {
        resolve(responseData.data)
      }
    })
  }
  socketEmit(event, params) {
    if (!this.socket) {
      return
    }
    if (this.socket.connected) {
      this.socket.emit(event, params)
    }
    else {
      this.event.$emit('SHOW_MESSAGE', 'S005')
    }
  }
  formatDate(date) {
    if (!date) {
      return ''
    }
    let jdate = new Date(date)
    return [
      jdate.getFullYear(),
      jdate.getMonth() + 1,
      jdate.getDate()
    ].join('/')
  }
  formatTime(date) {
    if (!date) {
      return ''
    }
    let jdate = new Date(date)
    return ('0' + jdate.getHours()).slice(-2) + ':'
      + ('0' + jdate.getMinutes()).slice(-2) + ':'
      + ('0' + jdate.getSeconds()).slice(-2)
  }
  formatDateTime(date) {
    if (!date) {
      return ''
    }
    return this.formatDate(date) + ' ' + this.formatTime(date)
  }
  formatMoney(number) {
    if (!number && number !== 0) {
      return ''
    }
    let fixed = number.toFixed(0)
    let delimiter = '.'
    let splitedNum = fixed.toString().split(delimiter)
    let replacedNum = splitedNum[0].replace(/(\d)(?=(\d{3})+$)/g , '$1,')
    if (splitedNum[1]) {
      replacedNum = replacedNum + delimiter + splitedNum[1]
    }
    return replacedNum
  }
  formatNumber(number) {
    if (!number && number !== 0) {
      return ''
    }
    let delimiter = '.'
    let splitedNum = number.toString().split(delimiter)
    let replacedNum = splitedNum[0].replace(/(\d)(?=(\d{3})+$)/g , '$1,')
    if (splitedNum[1]) {
      replacedNum = replacedNum + delimiter + splitedNum[1]
    }
    return replacedNum
  }
  formatPercentage(number) {
    if (!number && number !== 0) {
      return ''
    }
    let per = Math.round(number * 10000) / 100
    return per + '%'
  }
  formatSize(size) {
    if (!size && size !== 0) {
      return ''
    }
    if (size < 1000) {
      return size + ' Byte'
    }
    else if (size < 1024 * 1000) {
      let ksize = size / 1024
      ksize = ksize.toFixed(2)
      let delimiter = '.'
      let splitedNum = ksize.toString().split(delimiter)
      let replacedNum = splitedNum[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,')
      return replacedNum + delimiter + splitedNum[1] + ' KB'
    }
    else if (size < 1024 * 1024 * 1000) {
      let msize = size / 1024 / 1024
      msize = msize.toFixed(2)
      let delimiter = '.'
      let splitedNum = msize.toString().split(delimiter)
      let replacedNum = splitedNum[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,')
      return replacedNum + delimiter + splitedNum[1] + ' MB'
    }
    else {
      let gsize = size / 1024 / 1024 / 1024
      gsize = gsize.toFixed(2)
      let delimiter = '.'
      let splitedNum = gsize.toString().split(delimiter)
      let replacedNum = splitedNum[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,')
      return replacedNum + delimiter + splitedNum[1] + ' GB'
    }
  }
  precise(number) {
    return Math.round(number * 100000) / 100000
  }
  clone(orig) {
    return Object.assign(Object.create(Object.getPrototypeOf(orig)), orig)
  }
  copy(text) {
    let copyFrom = document.createElement("textarea")
    copyFrom.textContent = text
    let bodyElm = document.getElementsByTagName("body")[0]
    bodyElm.appendChild(copyFrom)
    copyFrom.select()
    let retVal = document.execCommand('copy')
    bodyElm.removeChild(copyFrom)
    return retVal
  }
  getBytes(text) {
    return(encodeURIComponent(text).replace(/%../g,"x").length)
  }
  report(years, payment) {
    const existYear = years.find(year => {
      return year.text === payment.pay.format('YYYY年')
    })
    if (existYear) {
      const existMonth = existYear.months.find(month => {
        return month.text === payment.pay.format('M月')
      })
      if (payment.DRCR === 'DR') {
        existYear.DR += parseInt(payment.amount)
      }
      if (payment.DRCR === 'CR') {
        existYear.CR += parseInt(payment.amount)
      }
      if (existMonth) {
        if (payment.DRCR === 'DR') {
          existMonth.DR += parseInt(payment.amount)
        }
        if (payment.DRCR === 'CR') {
          existMonth.CR += parseInt(payment.amount)
        }
      } else {
        let month = {
          text: payment.pay.format('M月'),
          DR: 0,
          CR: 0
        }
        if (payment.DRCR === 'DR') {
          month.DR = parseInt(payment.amount)
        }
        if (payment.DRCR === 'CR') {
          month.CR = parseInt(payment.amount)
        }
        existYear.months.push(month)
      }
    } else {
      let year = {
        text: payment.pay.format('YYYY年'),
        DR: 0,
        CR: 0,
        months: []
      }
      let month = {
        text: payment.pay.format('M月'),
        DR: 0,
        CR: 0
      }
      if (payment.DRCR === 'DR') {
        year.DR = parseInt(payment.amount)
        month.DR = parseInt(payment.amount)
      }
      if (payment.DRCR === 'CR') {
        year.CR = parseInt(payment.amount)
        month.CR = parseInt(payment.amount)
      }
      year.months.push(month)
      years.push(year)
    }
  }
  mergeReport (origin, years) {
    for (let i = 0; i < years.length; i++) {
      const year = years[i]
      let existYear = origin.find(one => {
        return year.text === one.text
      })
      if (existYear) {
        for (let j = 0; j < year.months.length; j++) {
          const month = year.months[j]
          existYear.DR += month.DR
          existYear.CR += month.CR
          let existMonth = existYear.months.find(one => {
            return month.text === one.text
          })
          if (existMonth) {
            existMonth.DR += month.DR
            existMonth.CR += month.CR
          } else {
            existYear.months.push(month)
          }
        }
      } else {
        origin.push(year)
      }
    }
  }
}

export default new Utils()
