<template>

  <div class="content-wrapper">
    <section class="content" v-on:click="closeSide">
      <div class="elements-area">
        <div class="element-items">
          <ul>
            <li class="element-item element-item-selected" v-if="manager.report.reporting.parent" v-on:click="selectElement(manager.report.reporting.parent)">
              <i class="fa fa-long-arrow-up"></i>
            </li>
            <li class="element-item" v-for="element in manager.report.reporting.elements" v-if="manager.report.reporting.elements" v-on:click="selectElement(element)">
              {{element.name}}
            </li>
          </ul>
        </div>
      </div>
      <div>
        <div class="box box-solid box-primary">
          <div class="box-header with-border">
            <h3 class="box-title">{{manager.report.reporting.name || '全物件'}}</h3>
          </div>
          <div class="box-body">
            <table class="table">
              <tr class="bg-blue">
                <th style="width: 70px;">年</th>
                <th style="width: 50px;">月</th>
                <th>収入</th>
                <th>支出</th>
              </tr>
              <template v-for="year in manager.report.reporting.report">
                <tr>
                  <td class="bg-gray">{{year.text}}</td>
                  <td class="bg-gray"></td>
                  <td class="bg-gray">{{year.DR}}</td>
                  <td class="bg-gray">{{year.CR}}</td>
                </tr>
                <tr v-for="month in year.months" v-if="year.months">
                  <td class="bg-gray"></td>
                  <td>{{month.text}}</td>
                  <td>{{month.DR}}</td>
                  <td>{{month.CR}}</td>
                </tr>
              </template>
            </table>
          </div>
        </div>
      </div>
    </section>
  </div>

</template>

<script>
  import CONST from '@/store/const.js'
  import manager from '@/store/manager.js'
  import utils from '@/tool/utils.js'

  export default {
    props: ['manager'],
    mounted() {
      $('body').layout('fix')
    },
    methods: {
      closeSide() {
        if ($('.control-sidebar').hasClass('control-sidebar-open')) {
          $('.control-sidebar').removeClass('control-sidebar-open')
        }
      },
      selectElement(element) {
        manager.report.reporting = element
      }
    }
  }
</script>

<style>
  .elements-area {
    width: 100%;
    overflow: hidden;
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #ccc;
  }
  .element-items {
    width: 100%;
  }
  .element-items ul {
    display: flex;
    flex-wrap: wrap;
    margin: 0;
    padding: 0;
  }
  .element-items li {
    margin: 3px;
    padding: 5px;
    color: #333;
    font-size: 12px;
    font-weight: 100;
    text-align: center;
    list-style: none;
    background: #d4d4d4;
    border-radius: 2px;
    cursor: pointer;
  }
  .element-item-selected {
    color: #fff !important;
    background: #3c8dbc !important;
    padding: 5px 10px !important;
  }
  .box-body {
    padding: 1px;
  }
  th, td {
    padding: 10px;
  }
  td {
    border: solid 1px #eee;
  }
</style>
