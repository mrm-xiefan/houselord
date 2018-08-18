import manager from '@/store/manager.js'
import CONST from './const.js'
import utils from '@/tool/utils.js'
import moment from 'moment'

class Reporter {
  constructor(data) {
    this.elements = []
    if (data.houses) {
      data.houses.forEach(house => {
        this.elements.push(new HouseReporter(house, this))
      })
    }
  }

  get report () {
    let years = []
    this.elements.forEach(element => {
      utils.mergeReport(years, element.report)
    })
    return years
  }
}

class HouseReporter {
  constructor(data, parent) {
    this.parent = parent
    this._id = data._id
    this.lord = data.lord
    this.name = data.name
    this.elements = []
    if (data.rooms) {
      data.rooms.forEach(room => {
        this.elements.push(new RoomReporter(room, this))
      })
    }
  }

  get report () {
    let years = []
    this.elements.forEach(element => {
      utils.mergeReport(years, element.report)
    })
    return years
  }
}

class RoomReporter {
  constructor(data, parent) {
    this.parent = parent
    this._id = data._id
    this.number = data.number
    this.contracts = []
    if (data.contracts) {
      data.contracts.forEach(contract => {
        this.contracts.push(new ContractReporter(contract, this))
      })
    }
    this.expenses = []
    if (data.expenses) {
      data.expenses.forEach(expense => {
        this.expenses.push(new ExpenseReporter(expense, this))
      })
    }
  }
  get name () {
    return this.parent.name + ' - ' + this.number
  }
  get report () {
    let years = []
    this.contracts.forEach(contract => {
      contract.payments.forEach(payment => {
        utils.report(years, payment)
      })
    })
    this.expenses.forEach(expense => {
      utils.report(years, expense)
    })
    return years
  }
}

class ContractReporter {
  constructor(data, parent) {
    this.parent = parent
    this._id = data._id

    this.start = data.start
    this.end = data.end

    this.payments = []
    if (data.payments) {
      data.payments.forEach(payment => {
        this.payments.push(new PaymentReporter(payment, this))
      })
    }
  }
}

class PaymentReporter {
  constructor(data, parent) {
    this.parent = parent
    this._id = data._id
    this.DRCR = data.DRCR
    this.type = data.type
    this.amount = data.amount
    this.pay = moment(data.pay)
  }
}

class ExpenseReporter {
  constructor(data, parent) {
    this.parent = parent
    this._id = data._id
    this.DRCR = data.DRCR
    this.type = data.type
    this.amount = data.amount
    this.pay = moment(data.pay)
  }
}

export default Reporter
