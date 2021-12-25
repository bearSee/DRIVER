

<template>
  <div class="vip-manage">
    <sib-table
      ref="sibTable"
      border
      stripe
      :row-size="4"
      :search-info="searchInfo"
      :table-column="tableColumn"
      :table-data="tableData"
      :request-config="requestConfig">
      <template #content-body>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click.native="handlerAdd">
          新增
        </el-button>
        <el-button
          type="primary"
          @click.native="handlerExport">
          导 出
        </el-button>
      </template>
      <template #integral="{ row }">
        <el-button
          type="text"
          @click.native="handlerPointDetail(row)">
          {{ row.integral }}
        </el-button>
      </template>
      <template #operate="{ row }">
        <el-button
          type="text"
          @click.native="handlerEdit(row)">
          编辑
        </el-button>
        <el-button
          type="text"
          @click.native="handlerDelete(row)">
          删除
        </el-button>
        <el-button
          type="text"
          @click.native="handlerManagePoints(row)">
          积分管理
        </el-button>
      </template>
    </sib-table>
    <!-- 新增、修改弹窗 -->
    <el-dialog
      class="center"
      width="500px"
      append-to-body
      lock-scroll
      v-dialogDrag
      v-if="dialogConfig.visible"
      :title="dialogConfig.title"
      :visible.sync="dialogConfig.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <sib-form
        submit-text="保存"
        cancel-text="取消"
        :item-info="dialogConfig.itemInfo"
        :form="dialogConfig.form"
        @submit="handlerSubmit"
        @reset="dialogConfig.visible = false"
      />
    </el-dialog>
    <!-- 积分管理 弹窗 -->
    <el-dialog
      class="point-dialog center"
      width="800px"
      title="积分管理"
      append-to-body
      lock-scroll
      v-dialogDrag
      v-if="pointVisible"
      :visible.sync="pointVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <div class="base-info">
        <div class="title">
          基本信息
        </div>
        <sib-form
          border
          :row-size="2"
          :disabled="true"
          :item-info="baseItemInfo"
          :form="baseForm"
        />
      </div>
      <div class="point-info">
        <div class="title">
          积分管理
        </div>
        <sib-form
          submit-text="保存"
          cancel-text="取消"
          :item-info="pointItemInfo"
          @submit="handlerSubmitPoint"
          @reset="pointVisible = false"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
    name: 'VipManage',
    data() {
        return {
            searchInfo: [
                {
                    label: '人员类型',
                    code: '1',
                    type: 'select',
                    options: [],
                },
                {
                    label: '公司/平台',
                    code: '2',
                    type: 'text',
                },
                {
                    label: '车牌号码',
                    code: '3',
                    type: 'text',
                },
            ],
            tableColumn: [
                {
                    label: '人员类型',
                    code: '1',
                },
                {
                    label: '真实姓名',
                    code: '2',
                },
                {
                    label: '手机号码',
                    code: '3',
                },
                {
                    label: '身份证号码',
                    code: '4',
                },
                {
                    label: '公司/平台',
                    code: '5',
                },
                {
                    label: '车牌号码',
                    code: '6',
                },
                {
                    label: '积分',
                    code: 'integral',
                    type: 'slot',
                },
                {
                    label: '对应标签',
                    code: '8',
                },
                {
                    label: '操作',
                    code: 'operate',
                    type: 'slot',
                    width: 150,
                },
            ],
            tableData: Array(22).fill().map((_, i) => ({
                id: i,
                1: `test${i}`,
                2: `test${i}`,
                3: `test${i}`,
                4: `test${i}`,
                5: `test${i}`,
                6: `test${i}`,
                integral: 'test',
            })),
            requestConfig: {
                // url: '/edc-profile-service/organization/findPage',
                // method: 'post',
                // params: {},
                // callback: res => res.data,
            },
            dialogConfig: {
                title: '',
                type: 'add',
                visible: false,
                itemInfo: [],
                addItemInfo: [
                    {
                        label: '人员类型',
                        code: '1',
                        type: 'text',
                    },
                    {
                        label: '真实姓名',
                        code: '2',
                        type: 'text',
                    },
                    {
                        label: '手机号码',
                        code: '3',
                        type: 'text',
                    },
                    {
                        label: '身份证号码',
                        code: '4',
                        type: 'text',
                    },
                    {
                        label: '公司/平台',
                        code: '5',
                        type: 'text',
                    },
                    {
                        label: '车牌号码',
                        code: '6',
                        type: 'text',
                    },
                    {
                        label: '积分',
                        code: '7',
                        type: 'text',
                    },
                    {
                        label: '对应标签',
                        code: '8',
                        type: 'text',
                    },
                ],
                editItemInfo: [],
                form: {},
            },
            pointVisible: false,
            baseItemInfo: [
                {
                    label: '人员类型',
                    code: '1',
                    type: 'label',
                },
                {
                    label: '真实姓名',
                    code: '2',
                    type: 'label',
                },
                {
                    label: '手机号码',
                    code: '3',
                    type: 'label',
                },
                {
                    label: '身份证号码',
                    code: '4',
                    type: 'label',
                },
                {
                    label: '公司/平台',
                    code: '5',
                    type: 'label',
                },
                {
                    label: '车牌号码',
                    code: '6',
                    type: 'label',
                },
                {
                    label: '积分',
                    code: 'integral',
                    type: 'label',
                },
                {
                    label: '对应标签',
                    code: '8',
                    type: 'label',
                },
            ],
            baseForm: {},
            pointItemInfo: [
                {
                    label: '变动类型',
                    code: '1',
                    type: 'radio',
                    options: [
                        {
                            key: '1',
                            value: '发放积分',
                        },
                        {
                            key: '2',
                            value: '清零积分',
                        },
                        {
                            key: '3',
                            value: '删除积分',
                        },
                    ],
                    required: true,
                },
                {
                    label: '变动数量',
                    code: '2',
                    type: 'text',
                    valueType: 'number',
                    maxlength: 10,
                    width: 'calc(50% - 10px)',
                },
                {
                    label: '变动后',
                    code: '3',
                    type: 'label',
                    width: 'calc(50% - 10px)',
                },
                {
                    label: '系统消息',
                    code: '4',
                    type: 'textarea',
                },
                {
                    label: '变动原因',
                    code: '5',
                    type: 'textarea',
                },
            ],
        };
    },
    methods: {
        // 删除
        handlerDelete(row) {
            this.handlerBatchDelete([row]);
        },
        // 批量删除
        handlerBatchDelete(rows) {
            if (!rows.length) {
                this.$message.warning('请至少勾选一条数据');
                return;
            }
            this.$confirm('确定删除吗？', '温馨提示', {
                type: 'warning',
                confirmButtonText: '确定删除',
            }).then(() => {
                this.$http.post('/edc-profile-service/organization/remove', { ids: rows.map(({ id }) => id) }).then(() => {
                    this.$message.success('删除成功');
                    if (this.$refs.sibTable) this.$refs.sibTable.getTableData();
                });
            });
        },
        // 打开新增弹窗
        handlerAdd() {
            this.dialogConfig.title = '新增';
            this.dialogConfig.type = 'add';
            this.dialogConfig.itemInfo = this.dialogConfig.addItemInfo;
            this.dialogConfig.form = {};
            this.dialogConfig.visible = true;
        },
        // 打开编辑弹窗
        handlerEdit(row) {
            const { addItemInfo, editItemInfo } = this.dialogConfig;
            this.dialogConfig.title = '编辑';
            this.dialogConfig.type = 'update';
            this.dialogConfig.itemInfo = editItemInfo && editItemInfo.length ? editItemInfo : (addItemInfo || []);
            this.dialogConfig.form = JSON.parse(JSON.stringify(row));
            this.dialogConfig.visible = true;
        },
        // 创建、编辑用户提交
        handlerSubmit(form, cb) {
            const { type } = this.dialogConfig;
            const url = `/edc-profile-service/organization/${type}`;

            this.$http.post(url, form).then(() => {
                this.$message.success('保存成功');
                this.dialogConfig.visible = false;
                if (this.$refs.sibTable) this.$refs.sibTable.getTableData();
            }).finally(cb);
        },
        handlerManagePoints(row) {
            this.baseForm = row;
            this.pointVisible = true;
        },
        handlerPointDetail(row) {
            console.log('row', row);
        },
        handlerSubmitPoint(form, cb) {
            this.$http.post('', form).then(() => {
                this.$message.success('保存成功');
                this.pointVisible = false;
                if (this.$refs.sibTable) this.$refs.sibTable.getTableData();
            }).finally(cb);
        },
        handlerExport() {},
    },
};
</script>

<style lang="scss">
// @import "@/assets/scss/theme.scss";

.vip-manage {

}
.point-dialog {
    .el-dialog__body {
        padding-top: 0!important;
        .base-info, .point-info {
            .title {
                margin: 20px 0;
                font-size: 18px;
                font-weight: 600;
                color: #333;
            }
        }
    }
}
</style>
