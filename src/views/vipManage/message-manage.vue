

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
          :disabled="String(row.status) === '1'"
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
        ref="dialogFrom"
        submit-text="保存"
        cancel-text="取消"
        :item-info="dialogConfig.itemInfo"
        :form="dialogConfig.form"
        @form-item-change="formItemChange"
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
const sendLabel = {
    label: '发送会员标签',
    code: 'sendLabel',
    showCode: 'sendLabelName',
    type: 'table',
    dataType: 'array',
    tableConfig: {
        multiple: true,
        rowSize: 2,
        pageParamKeys: {
            pageIndex: 'page',
            pageSize: 'limit',
        },
        query: [
            {
                label: '标签名称',
                code: 'labelName',
                type: 'text',
            },
        ],
        field: [
            {
                label: '标签名称',
                code: 'labelName',
            },
        ],
    },
    trans: [
        {
            from: 'id',
            to: 'sendLabel',
        },
        {
            from: 'labelName',
            to: 'sendLabelName',
        },
    ],
    requestConfig: {
        url: '/label/queryPage',
        method: 'post',
        params: {},
        pageParamKeys: {
            pageIndex: 'page',
            pageSize: 'limit',
        },
        callback: res => ((res && res.data || {}).page || {}).list || [],
    },
    required: true,
};
const sendUsers = {
    label: '会员列表',
    code: 'sendUsers',
    showCode: 'sendUsersName',
    type: 'table',
    dataType: 'array',
    pickerWidth: '1000px',
    tableConfig: {
        multiple: true,
        rowSize: 3,
        pageParamKeys: {
            pageIndex: 'page',
            pageSize: 'limit',
        },
        query: [
            {
                label: '人员类型',
                code: 'userType',
                type: 'select',
                options: [],
                optionProps: {
                    key: 'dicKey',
                    value: 'dicValue',
                },
                requestConfig: {
                    url: '/dict/select/list/USER_TYPE',
                    method: 'get',
                    params: {},
                    callback: res => (res.data || {}).list || [],
                },
            },
            {
                label: '公司/平台',
                code: 'company',
                type: 'text',
            },
        ],
        field: [
            {
                label: '真实姓名',
                code: 'userName',
            },
            {
                label: '人员类型',
                code: 'userTypeName',
            },
            {
                label: '公司/平台',
                code: 'company',
            },
            {
                label: '手机号码',
                code: 'mobile',
            },
        ],
    },
    trans: [
        {
            from: 'id',
            to: 'sendUsers',
        },
        {
            from: 'userName',
            to: 'sendUsersName',
        },
    ],
    requestConfig: {
        url: '/user/queryPage',
        method: 'post',
        params: {},
        pageParamKeys: {
            pageIndex: 'page',
            pageSize: 'limit',
        },
        callback: res => ((res && res.data || {}).page || {}).list || [],
    },
    required: true,
};

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
                    code: 'createdUserName',
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
                        label: '发送时间',
                        labelTips: '请控制您所设置的 “发送时间“ 距离当前时间至少 3 分钟',
                        type: 'datetime',
                        code: 'sendDt',
                        pickerOptions: {
                            disabledDate: date => date.getTime() <= (new Date().getTime() - 24 * 3600 * 1000),
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
            this.$http.post('/message/findUserByRange', this.$qs.stringify({ messageId: row.id })).then((res) => {
                res = res && res.data && res.data.data || {};
                const data = {
                    ...row,
                    sendUsers: res.sendUsers,
                    sendUsersName: (res.sendUsersName || []).join(),
                    sendLabel: res.sendLabel,
                    sendLabelName: (res.sendLabelName || []).join(),
                };
                const { addItemInfo, editItemInfo } = this.dialogConfig;
                this.dialogConfig.title = '编辑';
                this.dialogConfig.type = 'update';
                this.dialogConfig.itemInfo = editItemInfo && editItemInfo.length ? editItemInfo : (addItemInfo || []);
                this.formItemChange(data.sendRange, { code: 'sendRange' });
                this.dialogConfig.form = JSON.parse(JSON.stringify(data));
                this.dialogConfig.visible = true;
            });
        },
        formItemChange(val, { code }) {
            if (code === 'sendRange') {
                const itemInfo = window.deepCopy(this.dialogConfig.itemInfo);
                const { currentForm = {} } = this.$refs.dialogFrom || {};

                const lindex = this.dialogConfig.itemInfo.findIndex(item => item.code === 'sendLabel');
                if (val === 'MSG_SEND_RANGE_SIGN') {
                    if (lindex < 0) itemInfo.push(sendLabel);
                } else if (lindex > -1) {
                    itemInfo.splice(lindex, 1);
                    this.$set(currentForm, 'sendLabel', null);
                }

                const uindex = this.dialogConfig.itemInfo.findIndex(item => item.code === 'sendUsers');
                if (val === 'MSG_SEND_RANGE_SET') {
                    if (uindex < 0) itemInfo.push(sendUsers);
                } else if (uindex > -1) {
                    itemInfo.splice(uindex, 1);
                    this.$set(currentForm, 'sendUsers', null);
                    this.$set(currentForm, 'sendUsersName', null);
                }

                this.dialogConfig.itemInfo = itemInfo;
                this.$nextTick(() => {
                    if (this.$refs.dialogFrom) this.$refs.dialogFrom.reSetFormItemWidth();
                });
            }
        },
        // 创建、编辑用户提交
        handlerSubmit(form, cb) {
            const sendDt = new Date(form.sendDt).getTime();
            if (sendDt < (new Date().getTime() + 3 * 60 * 1000)) {
                this.$message.warning('请控制您所设置的 “发送时间“ 距离当前时间至少 3 分钟');
                cb();
                return;
            }
            if (form.sendUsersName && typeof form.sendUsersName === 'string') {
                form.sendUsersName = form.sendUsersName.split(',');
            }
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
        handlerExport() {
            this.$http.post('/message/exportExcel', this.$qs.stringify(this.$refs.sibTable.searchParams), { responseType: 'blob' }).then((res) => {
                window.download(res, '消息列表.xlsx');
                this.$message.success('导出成功');
            });
        },
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
