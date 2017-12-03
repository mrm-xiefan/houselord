<template>
  <div class="content-wrapper">
    <section class="content" v-on:click="closeSide">
      <div class="houses-area">
        <div class="house-action">
          <button type="button" class="btn btn-primary" v-on:click="addHouse">
            <i class="fa fa-plus-circle"></i> 登録
          </button>
          <button type="button" class="btn btn-primary">
            <i class="fa fa-plus-circle"></i> インポート
          </button>
          <button type="button" class="btn btn-primary">
            <i class="fa fa-print"></i> 印刷
          </button>
        </div>
        <div class="house-items">
          <ul>
            <li :class="{'house-item': true, 'house-item-selected': manager.user.selectedHouse && house._id == manager.user.selectedHouse}" v-for="house in manager.houses" v-on:click="selectHouse(house)">
              {{house.name}}
              <i class="tag-edit fa fa-edit" v-on:click.stop=""></i>
              <i class="tag-close fa fa-close" v-on:click.stop=""></i>
            </li>
          </ul>
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
    components: {
      // houseBox: houseBox
    },
    methods: {
      closeSide() {
        if ($('.control-sidebar').hasClass('control-sidebar-open')) {
          $('.control-sidebar').removeClass('control-sidebar-open')
        }
      },
      addHouse() {
        this.$router.push({name: 'addHouse'})
      },
      selectHouse(house) {
        utils.restPost('/api/selectHouse', {_id: house._id}).then(
          response => {
            if (response) {
              manager.user.selectedHouse = house._id
              manager.refreshRoom(response)
            }
          }
        )
      }
    }
  }
</script>

<style scoped>
  .houses-area {
    width: 100%;
    overflow: hidden;
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #ccc;
  }
  .house-action {
    margin-bottom: 20px;
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
  .house-action button {
    width: 120px;
    margin-right: 10px;
  }
  .house-items {
    width: 100%;
    /* overflow: hidden; */
  }
  .house-items ul {
    display: flex;
    flex-wrap: wrap;
    margin: 0;
    padding: 0;
  }
  .house-items li {
    margin: 3px;
    padding: 5px;
    color: #fff;
    font-size: 12px;
    font-weight: 100;
    text-align: center;
    list-style: none;
    background: #333;
    border-radius: 2px;
    cursor: pointer;
  }
  .house-items .tag-edit,
  .house-items .tag-close {
    margin-left: 4px;
    padding: 0px;
    font-size: 18px;
    font-weight: 100;
    transition: .2s;
  }
  .house-items .tag-edit {
    margin-left: 10px;
  }
  .house-items .tag-edit:hover,
  .house-items .tag-close:hover {
    opacity: 0.7;
  }
  .house-item-selected {
    background: #605ca8 !important;
  }
</style>
