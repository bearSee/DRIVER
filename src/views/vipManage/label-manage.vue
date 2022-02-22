

<template>
  <div class="label-manage">
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
      width="450px"
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
  </div>
</template>

<script>

export default {
    name: 'LabelManage',
    data() {
        return {
            pageParamKeys: {
                pageIndex: 'page',
                pageSize: 'limit',
            },
            searchInfo: [
                {
                    label: '标签名称',
                    code: 'labelName',
                    type: 'text',
                },
            ],
            tableColumn: [
                {
                    label: '标签名称',
                    code: 'labelName',
                },
                {
                    label: '操作',
                    code: 'operate',
                    type: 'slot',
                    width: 150,
                },
            ],
            requestConfig: {
                url: '/label/queryPage',
                method: 'post',
                params: {},
                callback: res => ((res.data || {}).page || {}).list || [],
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
                        label: '标签名称',
                        code: 'labelName',
                        type: 'text',
                        maxlength: 100,
                        required: true,
                    },
                ],
                editItemInfo: [],
                form: {},
            },
        };
    },
    methods: {
        // 删除
        handlerDelete(row) {
            this.$confirm('确定删除吗？', '温馨提示', {
                type: 'warning',
                confirmButtonText: '确定删除',
            }).then(() => {
                this.$http.post('/label/delete', this.$qs.stringify({ labelId: row.id })).then(() => {
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
            const url = `/label/${type}`;

            this.$http.post(url, form).then(() => {
                this.$message.success('保存成功');
                this.dialogConfig.visible = false;
                if (this.$refs.sibTable) this.$refs.sibTable.getTableData();
            }).finally(cb);
        },
    },
};
</script>

<style lang="scss">
// @import "@/assets/scss/theme.scss";

.label-manage {

}
</style>
