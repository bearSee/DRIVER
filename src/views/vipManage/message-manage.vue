

<template>
  <div class="message-manage">
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
      <template #message="{ row }">
        <el-button
          type="text"
          @click.native="handlerViewMessage(row)">
          {{ row.message }}
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
    <!-- 消息内容 弹窗 -->
    <el-dialog
      class="message-dialog center"
      width="800px"
      title="消息内容"
      append-to-body
      lock-scroll
      v-dialogDrag
      v-if="messageVisible"
      :visible.sync="messageVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <div class="message-info">
        message
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
    name: 'MessageManage',
    data() {
        return {
            searchInfo: [
                {
                    label: '状态',
                    code: '1',
                    type: 'select',
                    options: [],
                },
                {
                    label: '消息标题',
                    code: '3',
                    type: 'text',
                },
            ],
            tableColumn: [
                {
                    label: '消息标题',
                    code: '1',
                },
                {
                    label: '消息类别',
                    code: '2',
                },
                {
                    label: '发送范围',
                    code: '3',
                },
                {
                    label: '消息内容',
                    code: 'message',
                    type: 'slot',
                },
                {
                    label: '发送时间',
                    code: '5',
                },
                {
                    label: '创建人',
                    code: '6',
                },
                {
                    label: '创建时间',
                    code: '7',
                },
                {
                    label: '状态',
                    code: '8',
                },
                {
                    label: '操作',
                    code: 'operate',
                    type: 'slot',
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
                7: `test${i}`,
                8: `test${i}`,
                message: 'test',
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
                        label: '消息标题',
                        code: '1',
                        type: 'text',
                    },
                    {
                        label: '消息类别',
                        code: '2',
                        type: 'select',
                        options: [],
                    },
                    {
                        label: '发送范围',
                        code: '3',
                        type: 'select',
                        options: [],
                    },
                    {
                        label: '消息内容',
                        code: 'message',
                        type: 'textarea',
                    },
                    {
                        label: '状态',
                        code: '8',
                        type: 'select',
                        options: [],
                    },
                ],
                editItemInfo: [],
                form: {},
            },
            messageVisible: false,
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
        handlerViewMessage(row) {
            console.log('row', row);
            this.messageVisible = true;
        },
        handlerExport() {},
    },
};
</script>

<style lang="scss">
// @import "@/assets/scss/theme.scss";

.message-manage {

}
.message-dialog {
    .el-dialog__body {
    }
}
</style>
