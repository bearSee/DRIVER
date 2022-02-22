

<template>
  <div class="vip-manage">
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
        <!-- <el-button
          type="primary"
          icon="el-icon-plus"
          @click.native="handlerAdd">
          新增
        </el-button> -->
        <el-button
          type="primary"
          v-loading="isLoaind"
          @click.native="handlerDownload">
          下载模板
        </el-button>
        <el-upload v-bind="fileConfig">
          <el-button
            size="small"
            type="primary"
            v-loading="isLoaind">
            导 入
          </el-button>
        </el-upload>
        <el-button
          type="primary"
          v-loading="isLoaind"
          @click.native="handlerExport">
          导 出
        </el-button>
      </template>
      <template #integral="{ row }">
        <el-button
          type="text"
          @click.native="handlerPointDetail(row)">
          {{ row.score }}
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
      width="800px"
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
        :row-size="2"
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
          ref="dialogForm"
          submit-text="保存"
          cancel-text="取消"
          :item-info="pointItemInfo"
          @form-item-change="formItemChange"
          @submit="handlerSubmitPoint"
          @reset="pointVisible = false"
        />
      </div>
    </el-dialog>
    <el-dialog
      class="center"
      width="800px"
      title="积分详情"
      append-to-body
      lock-scroll
      v-dialogDrag
      v-if="detailVisible"
      :visible.sync="detailVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <sib-table
        stripe
        :page-param-keys="pageParamKeys"
        :table-column="detailTableColumn"
        :request-config="detailRequestConfig" />
    </el-dialog>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
    name: 'VipManage',
    data() {
        return {
            isLoaind: false,
            pageParamKeys: {
                pageIndex: 'page',
                pageSize: 'limit',
            },
            searchInfo: [
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
                {
                    label: '车牌号码',
                    code: 'vehicleNo',
                    type: 'text',
                },
            ],
            tableColumn: [
                {
                    label: '人员类型',
                    code: 'userTypeName',
                },
                {
                    label: '真实姓名',
                    code: 'userName',
                },
                {
                    label: '手机号码',
                    code: 'mobile',
                },
                {
                    label: '身份证号码',
                    code: 'identityNo',
                },
                {
                    label: '公司/平台',
                    code: 'company',
                },
                {
                    label: '车牌号码',
                    code: 'vehicleNo',
                },
                {
                    label: '积分',
                    code: 'integral',
                    type: 'slot',
                },
                {
                    label: '对应标签',
                    code: 'labelName',
                    formatter: ({ userLabelDtos }) => (userLabelDtos || []).map(({ labelName }) => labelName).join(),
                },
                {
                    label: '操作',
                    code: 'operate',
                    type: 'slot',
                    width: 150,
                },
            ],
            requestConfig: {
                url: '/user/queryPage',
                method: 'post',
                params: {},
                callback: res => (((res.data || {}).page || {}).list || []).map(d => ({ ...d, labelName: (d.userLabelDtos || []).map(({ labelName }) => labelName).join() })),
                totalCallback: res => ((res.data || {}).page || {}).totalCount || 0,
                stringify: true,
            },
            dialogConfig: {
                title: '',
                type: 'save',
                visible: false,
                itemInfo: [],
                addItemInfo: [
                    {
                        label: '会员名称',
                        code: 'userName',
                        type: 'text',
                        maxlength: 30,
                        required: true,
                    },
                    {
                        label: '身份证号码',
                        code: 'identityNo',
                        type: 'text',
                        required: true,
                    },
                    {
                        label: '车牌号码',
                        code: 'vehicleNo',
                        type: 'text',
                        required: true,
                    },
                    {
                        label: '公司/平台',
                        code: 'company',
                        type: 'text',
                        // required: true,
                    },
                    {
                        label: '邀请码',
                        code: 'invitationCode',
                        type: 'text',
                        valueType: 'letter-number',
                        required: true,
                    },
                    {
                        label: '对应标签',
                        code: 'label',
                        showCode: 'labelName',
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
                                to: 'label',
                            },
                            {
                                from: 'labelName',
                                to: 'labelName',
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
                    },
                ],
                editItemInfo: [],
                form: {},
            },
            pointVisible: false,
            baseItemInfo: [
                {
                    label: '人员类型',
                    code: 'userTypeName',
                    type: 'label',
                },
                {
                    label: '真实姓名',
                    code: 'userName',
                    type: 'label',
                },
                {
                    label: '手机号码',
                    code: 'mobile',
                    type: 'label',
                },
                {
                    label: '身份证号码',
                    code: 'identityNo',
                    type: 'label',
                },
                {
                    label: '公司/平台',
                    code: 'company',
                    type: 'label',
                },
                {
                    label: '车牌号码',
                    code: 'vehicleNo',
                    type: 'label',
                },
                {
                    label: '积分',
                    code: 'score',
                    type: 'label',
                },
                {
                    label: '对应标签',
                    code: 'labelName',
                    type: 'label',
                },
            ],
            baseForm: {},
            pointItemInfo: [
                {
                    label: '变动类型',
                    code: 'sourceType',
                    type: 'radio',
                    options: [
                        {
                            key: 'SCORE_SOURCE_ADD',
                            value: '发放积分',
                        },
                        {
                            key: 'SCORE_SOURCE_CLEAR',
                            value: '清零积分',
                        },
                        {
                            key: 'SCORE_SOURCE_DELETE',
                            value: '删除积分',
                        },
                    ],
                    required: true,
                },
                {
                    label: '变动数量',
                    code: 'score',
                    type: 'text',
                    valueType: 'number',
                    maxlength: 10,
                    width: 'calc(50% - 10px)',
                },
                {
                    label: '变动后',
                    code: 'newScore',
                    type: 'label',
                    width: 'calc(50% - 10px)',
                },
                // {
                //     label: '系统消息',
                //     code: '4',
                //     type: 'textarea',
                // },
                {
                    label: '变动原因',
                    code: 'reason',
                    type: 'textarea',
                },
            ],
            detailVisible: false,
            detailTableColumn: [
                {
                    label: '变动类型',
                    code: 'sourceTypeName',
                },
                {
                    label: '变动原因',
                    code: 'reason',
                },
                {
                    label: '变动时间',
                    code: 'updatedDt',
                },
                {
                    label: '变动数量',
                    code: 'score',
                },
            ],
            detailRequestConfig: {
                url: '/user/score/detail',
                method: 'post',
                params: {},
                callback: res => ((res.data || {}).page || {}).list || [],
                totalCallback: res => ((res.data || {}).page || {}).totalCount || 0,
                stringify: true,
            },
            fileConfig: {
                class: 'form-head_upload-file',
                ref: 'fileUpload',
                action: `${this.$http.defaults.baseURL}/user/importExcel`,
                headers: {
                    Authorization: window.localStorage.getItem('Authorization') || '',
                    'i-token': this.$cookies.get('scheduling-i-token') || '',
                },
                name: 'file',
                multiple: false,
                showFileList: false,
                limit: 1,
                accept: '',
                onSuccess: ({ code, msg }) => {
                    this.$refs.fileUpload.clearFiles();
                    if (String(code) === '0') {
                        this.$message.success('上传成功');
                        if (this.$refs.sibTable) this.$refs.sibTable.getTableData();
                        return;
                    }
                    this.$message.error(msg || '上传失败，请稍后重试');
                    // 登录失效拦截
                    if (['10000'].includes(String(code))) {
                        // 清除相关菜单权限
                        this.clearPermissions();
                        this.$router.push('/login');
                    }
                },
                onError: () => {
                    this.$refs.fileUpload.clearFiles();
                },
            },
        };
    },
    methods: {
        ...mapMutations(['clearPermissions']),
        // 删除
        handlerDelete(row) {
            this.$confirm('确定删除吗？', '温馨提示', {
                type: 'warning',
                confirmButtonText: '确定删除',
            }).then(() => {
                this.$http.post('/user/delete', this.$qs.stringify({ userId: row.id })).then(() => {
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
            this.dialogConfig.form = JSON.parse(JSON.stringify({
                ...row,
                label: (row.userLabelDtos || []).map(({ labelId }) => labelId),
            }));
            this.dialogConfig.visible = true;
        },
        // 创建、编辑用户提交
        handlerSubmit(form, cb) {
            const { type } = this.dialogConfig;
            const url = `/user/${type}`;

            this.$http.post(url, { ...form, userLabelDtos: form.label.map((labelId, i) => ({ labelId, labelName: form.labelName[i] })) }).then(() => {
                this.$message.success('保存成功');
                this.dialogConfig.visible = false;
                if (this.$refs.sibTable) this.$refs.sibTable.getTableData();
            }).finally(cb);
        },
        handlerManagePoints(row) {
            this.baseForm = row;
            this.pointVisible = true;
        },
        formItemChange(val, { code }) {
            const form = (this.$refs.dialogForm || {}).currentForm;
            let newScore = Number(this.baseForm.score) || 0;
            if (code === 'sourceType') {
                this.$set(form, 'score', '');
                this.$set(form, 'newScore', val === 'SCORE_SOURCE_CLEAR' ? 0 : newScore);
                const index = this.pointItemInfo.findIndex(info => info.code === 'score');
                this.$set(this.pointItemInfo[index], 'disabled', val === 'SCORE_SOURCE_CLEAR');
            }
            if (code === 'score') {
                if (!form.sourceType) return;
                if (form.sourceType === 'SCORE_SOURCE_DELETE') {
                    if (Number(val) > newScore) {
                        this.$set(form, 'score', newScore);
                        newScore = 0;
                    } else {
                        newScore -= (Number(val) || 0);
                    }
                } else if (form.sourceType === 'SCORE_SOURCE_CLEAR') {
                    newScore = 0;
                } else {
                    newScore += (Number(val) || 0);
                }
                this.$set(form, 'newScore', newScore);
            }
        },
        handlerPointDetail(row) {
            this.detailRequestConfig.params.userId = row.id;
            this.detailVisible = true;
        },
        handlerSubmitPoint(form, cb) {
            form.score = form.score || 0;
            this.$http.post('/user/score/change', { userId: this.baseForm.id, ...form }).then(() => {
                this.$message.success('保存成功');
                this.pointVisible = false;
                if (this.$refs.sibTable) this.$refs.sibTable.getTableData();
            }).finally(cb);
        },
        handlerDownload() {
            this.isLoaind = true;
            this.$http.get('/user/downloadTpl', { responseType: 'blob' }).then((res) => {
                window.download(res, '模板.xlsx');
                this.$message.success('模板下载成功');
            }).finally(() => {
                this.isLoaind = false;
            });
        },
        handlerExport() {
            this.isLoaind = true;
            this.$http.post('/user/exportExcel', this.$qs.stringify(this.$refs.sibTable.searchParams), { responseType: 'blob' }).then((res) => {
                window.download(res, '会员信息.xlsx');
                this.$message.success('导出成功');
            }).finally(() => {
                this.isLoaind = false;
            });
        },
    },
};
</script>

<style lang="scss">
// @import "@/assets/scss/theme.scss";

.vip-manage {
    .form-head_upload-file {
        display: inline-block;
        margin: 0 10px;
    }
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
