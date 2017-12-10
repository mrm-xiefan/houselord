<template>
  <div class="content-wrapper">
    <section class="content" v-on:click="closeSide">
      <h3>展示ページ</h3>
      <div class="row">
        <div class="col-md-6">
          <div class="box box-solid bg-task-gradient">
            <div class="box-header">
              <i class="fa fa-calendar"></i>

              <h3 class="box-title">タスク管理</h3>
              <div class="pull-right box-tools">
                <div class="btn-group">
                  <button type="button" class="btn btn-success btn-sm dropdown-toggle" data-toggle="dropdown">
                    <i class="fa fa-bars"></i></button>
                  <ul class="dropdown-menu pull-right" role="menu">
                    <li><a href="#">タスク追加</a></li>
                    <li><a href="#">クリア</a></li>
                    <li class="divider"></li>
                    <li><a href="#">全てのタスク</a></li>
                  </ul>
                </div>
                <button type="button" class="btn btn-success btn-sm" data-widget="collapse"><i class="fa fa-minus"></i>
                </button>
                <button type="button" class="btn btn-success btn-sm" data-widget="remove"><i class="fa fa-times"></i>
                </button>
              </div>
            </div>
            <div class="box-body no-padding">
              <div id="calendar" style="width: 100%"></div>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="box box-success">
            <div class="box-header">
              <h3 class="box-title">タスク進捗</h3>
              <div class="pull-right box-tools">
                <button type="button" class="btn btn-success btn-sm" data-widget="collapse"><i class="fa fa-minus"></i>
                </button>
                <button type="button" class="btn btn-success btn-sm" data-widget="remove"><i class="fa fa-times"></i>
                </button>
              </div>
            </div>
            <!-- /.box-header -->
            <div class="box-body no-padding">
              <table class="table table-condensed">
                <tbody><tr>
                  <th style="width: 10px">#</th>
                  <th>タスク</th>
                  <th style="width: 150px">進捗</th>
                  <th style="width: 60px">進捗率</th>
                </tr>
                <tr>
                  <td>1.</td>
                  <td>賃金徴収</td>
                  <td>
                    <div class="progress progress-xs progress-striped active">
                      <div class="progress-bar progress-bar-success" style="width: 90%"></div>
                    </div>
                  </td>
                  <td><span class="badge bg-green">90%</span></td>
                </tr>
                <tr>
                  <td>2.</td>
                  <td>返済</td>
                  <td>
                    <div class="progress progress-xs progress-striped active">
                      <div class="progress-bar progress-bar-danger" style="width: 20%"></div>
                    </div>
                  </td>
                  <td><span class="badge bg-red">20%</span></td>
                </tr>
                <tr>
                  <td>3.</td>
                  <td>年末調整</td>
                  <td>
                    <div class="progress progress-xs progress-striped active">
                      <div class="progress-bar progress-bar-primary" style="width: 75%"></div>
                    </div>
                  </td>
                  <td><span class="badge bg-light-blue">75%</span></td>
                </tr>
                <tr>
                  <td>4.</td>
                  <td>精算</td>
                  <td>
                    <div class="progress progress-xs progress-striped active">
                      <div class="progress-bar progress-bar-warning" style="width: 40%"></div>
                    </div>
                  </td>
                  <td><span class="badge bg-yellow">40%</span></td>
                </tr>
              </tbody></table>
            </div>
            <!-- /.box-body -->
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12">
          <div class="box box-primary">
            <div class="box-header ui-sortable-handle" style="cursor: move;">
              <i class="ion ion-clipboard"></i>

              <h3 class="box-title">タスク一覧</h3>

              <div class="box-tools pull-right">
                <ul class="pagination pagination-sm inline">
                  <li><a href="#">«</a></li>
                  <li><a href="#">1</a></li>
                  <li><a href="#">2</a></li>
                  <li><a href="#">3</a></li>
                  <li><a href="#">»</a></li>
                </ul>
              </div>
            </div>
            <!-- /.box-header -->
            <div class="box-body">
              <ul class="todo-list ui-sortable">
                <li>
                  <!-- drag handle -->
                  <span class="handle ui-sortable-handle">
                    <i class="fa fa-ellipsis-v"></i>
                    <i class="fa fa-ellipsis-v"></i>
                  </span>
                  <!-- checkbox -->
                  <input type="checkbox" value="">
                  <!-- todo text -->
                  <span class="text">専門学校留学生寮募集説明会</span>
                  <!-- Emphasis label -->
                  <small class="label label-danger"><i class="fa fa-clock-o"></i> 2 mins</small>
                  <!-- General tools such as edit or delete-->
                  <div class="tools">
                    <i class="fa fa-edit"></i>
                    <i class="fa fa-trash-o"></i>
                  </div>
                </li>
                <li>
                  <span class="handle ui-sortable-handle">
                    <i class="fa fa-ellipsis-v"></i>
                    <i class="fa fa-ellipsis-v"></i>
                  </span>
                  <input type="checkbox" value="">
                  <span class="text">池袋丸マンション更新</span>
                  <small class="label label-info"><i class="fa fa-clock-o"></i> 4 hours</small>
                  <div class="tools">
                    <i class="fa fa-edit"></i>
                    <i class="fa fa-trash-o"></i>
                  </div>
                </li>
                <li>
                  <span class="handle ui-sortable-handle">
                    <i class="fa fa-ellipsis-v"></i>
                    <i class="fa fa-ellipsis-v"></i>
                  </span>
                  <input type="checkbox" value="">
                  <span class="text">タイに出張する</span>
                  <small class="label label-warning"><i class="fa fa-clock-o"></i> 15 day</small>
                  <div class="tools">
                    <i class="fa fa-edit"></i>
                    <i class="fa fa-trash-o"></i>
                  </div>
                </li>
                <li>
                  <span class="handle ui-sortable-handle">
                    <i class="fa fa-ellipsis-v"></i>
                    <i class="fa fa-ellipsis-v"></i>
                  </span>
                  <input type="checkbox" value="">
                  <span class="text">お家で残業する</span>
                  <small class="label label-success"><i class="fa fa-clock-o"></i> 3 hours</small>
                  <div class="tools">
                    <i class="fa fa-edit"></i>
                    <i class="fa fa-trash-o"></i>
                  </div>
                </li>
                <li>
                  <span class="handle ui-sortable-handle">
                    <i class="fa fa-ellipsis-v"></i>
                    <i class="fa fa-ellipsis-v"></i>
                  </span>
                  <input type="checkbox" value="">
                  <span class="text">アメリカに出張する</span>
                  <small class="label label-primary"><i class="fa fa-clock-o"></i> 1 week</small>
                  <div class="tools">
                    <i class="fa fa-edit"></i>
                    <i class="fa fa-trash-o"></i>
                  </div>
                </li>
                <li>
                  <span class="handle ui-sortable-handle">
                    <i class="fa fa-ellipsis-v"></i>
                    <i class="fa fa-ellipsis-v"></i>
                  </span>
                  <input type="checkbox" value="">
                  <span class="text">死ぬまで仕事をする</span>
                  <small class="label label-default"><i class="fa fa-clock-o"></i> 1 month</small>
                  <div class="tools">
                    <i class="fa fa-edit"></i>
                    <i class="fa fa-trash-o"></i>
                  </div>
                </li>
              </ul>
            </div>
            <!-- /.box-body -->
            <div class="box-footer clearfix no-border">
              <button type="button" class="btn btn-default pull-right"><i class="fa fa-plus"></i> Add item</button>
            </div>
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

  import moment from 'moment'
  import 'jquery-ui-touch-punch/jquery.ui.touch-punch.js'
  export default {
    props: ['manager'],
    mounted() {
      $('body').layout('fix')
      $('.box').boxWidget()

      $('#calendar').datepicker({
        language: 'ja',
        format: 'yyyy/mm/dd'
      })
      $('#calendar').datepicker('setDate', moment(new Date()).format('YYYY/MM/DD'))

      $('.todo-list').sortable({
        placeholder         : 'sort-highlight',
        handle              : '.handle',
        forcePlaceholderSize: true,
        zIndex              : 999999
      })
    },
    methods: {
      closeSide() {
        if ($('.control-sidebar').hasClass('control-sidebar-open')) {
          $('.control-sidebar').removeClass('control-sidebar-open')
        }
      }
    }
  }
</script>

<style scoped>
  .bg-task-gradient {
    background: #00a65a;
    background: -webkit-linear-gradient(bottom, #00a65a, #00ca6d);
    background: linear-gradient(to top right, #00a65a, #00ca6d);
    background: -ms-linear-gradient(bottom, #00a65a, #00ca6d) !important;
    background: -moz-linear-gradient(center bottom, #00a65a 0%, #00ca6d 100%) !important;
    background: -o-linear-gradient(#00ca6d, #00a65a) !important;
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#00ca6d', endColorstr='#00a65a', GradientType=0) !important;
    color: #fff;
  }
</style>
