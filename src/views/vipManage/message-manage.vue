

<template>
  <div class="message-manage">
    <sib-table
      ref="sibTable"
      border
      stripe
      :row-size="4"
      :page-param-keys="pageParamKeys"
      :search-info="searchInfo"
      :table-column="tableColumn"
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
          {{ row.content }}
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
        {{ currentRow.content }}
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
    name: 'MessageManage',
    data() {
        return {
            pageParamKeys: {
                pageIndex: 'page',
                pageSize: 'limit',
            },
            searchInfo: [
                {
                    label: '状态',
                    code: 'status',
                    type: 'select',
                    options: [],
                    optionProps: {
                        key: 'dicKey',
                        value: 'dicValue',
                    },
                    requestConfig: {
                        url: '/dict/select/list/MSG_STATUS',
                        method: 'get',
                        params: {},
                        callback: res => (res.data || {}).list || [],
                    },
                },
                {
                    label: '消息标题',
                    code: 'title',
                    type: 'text',
                },
            ],
            tableColumn: [
                {
                    label: '消息标题',
                    code: 'title',
                },
                {
                    label: '消息类别',
                    code: 'msgTypeName',
                },
                {
                    label: '发送范围',
                    code: 'sendRangeName',
                },
                {
                    label: '消息内容',
                    code: 'message',
                    type: 'slot',
                    showOverflowTooltip: true,
                },
                {
                    label: '发送时间',
                    code: 'sendDt',
                },
                {
                    label: '创建人',
                    code: 'sendUsers',
                },
                {
                    label: '创建时间',
                    code: 'createdDt',
                },
                {
                    label: '状态',
                    code: 'statusName',
                },
                {
                    label: '操作',
                    code: 'operate',
                    type: 'slot',
                },
            ],
            requestConfig: {
                url: '/message/queryPage',
                method: 'post',
                params: {},
                callback: res => ((res.data || {}).page || {}).list || [],
                stringify: true,
            },
            dialogConfig: {
                title: '',
                type: 'save',
                visible: false,
                itemInfo: [],
                addItemInfo: [
                    {
                        label: '消息标题',
                        code: 'title',
                        type: 'text',
                        maxlength: 100,
                        required: true,
                    },
                    {
                        label: '消息类别',
                        code: 'msgType',
                        type: 'select',
                        options: [],
                        optionProps: {
                            key: 'dicKey',
                            value: 'dicValue',
                        },
                        requestConfig: {
                            url: '/dict/select/list/MSG_TYPE',
                            method: 'get',
                            params: {},
                            callback: res => (res.data || {}).list || [],
                        },
                        required: true,
                    },
                    {
                        label: '发送范围',
                        code: 'sendRange',
                        type: 'select',
                        options: [],
                        optionProps: {
                            key: 'dicKey',
                            value: 'dicValue',
                        },
                        requestConfig: {
                            url: '/dict/select/list/MSG_SEND_RANGE',
                            method: 'get',
                            params: {},
                            callback: res => (res.data || {}).list || [],
                        },
                        required: true,
                    },
                    {
                        label: '消息内容',
                        code: 'content',
                        type: 'textarea',
                        maxlength: 500,
                        required: true,
                    },
                    {
                        label: '发送会员标签',
                        code: 'sendLabel',
                        type: 'select',
                        options: [],
                        optionProps: {
                            key: 'dicKey',
                            value: 'dicValue',
                        },
                        requestConfig: {
                            url: '/dict/select/list/USER_LABEL',
                            method: 'get',
                            params: {},
                            callback: res => (res.data || {}).list || [],
                        },
                        required: true,
                    },
                ],
                editItemInfo: [],
                form: {},
            },
            messageVisible: false,
            currentRow: {},
        };
    },
    methods: {
        // 删除
        handlerDelete(row) {
            this.$confirm('确定删除吗？', '温馨提示', {
                type: 'warning',
                confirmButtonText: '确定删除',
            }).then(() => {
                this.$http.post('/message/delete', this.$qs.stringify({ messageId: row.id })).then(() => {
                    this.$message.success('删除成功');
                    if (this.$refs.sibTable) this.$refs.sibTable.getTableData();
                });
            });
        },
        // 打开新增弹窗
        handlerAdd() {
            this.dialogConfig.title = '新增';
            this.dialogConfig.type = 'save';
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
            const url = `/message/${type}`;

            this.$http.post(url, form).then(() => {
                this.$message.success('保存成功');
                this.dialogConfig.visible = false;
                if (this.$refs.sibTable) this.$refs.sibTable.getTableData();
            }).finally(cb);
        },
        handlerViewMessage(row) {
            this.currentRow = row;
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
