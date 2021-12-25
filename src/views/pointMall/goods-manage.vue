

<template>
  <div class="goods-manage">
    <el-tabs
      type="border-card"
      v-model="pageType">
      <el-tab-pane
        label="商品类型"
        name="goodsType" />
      <el-tab-pane
        label="商品列表"
        name="goodsList" />
      <sib-table
        ref="sibTable"
        border
        stripe
        v-loading="isLoading"
        :row-size="5"
        :search-info="searchInfos[pageType]"
        :table-column="tableColumns[pageType]"
        :table-data="tableData"
        :request-config="requestConfigs[pageType]">
        <template #goodsDetail="{ row }">
          <el-button
            type="text"
            @click.native="handlerViewDetail(row)">
            详情
          </el-button>
        </template>
        <template #putShelf="{ row }">
          <sib-item
            v-model="row._putShelf"
            :props="{ type: 'switch', on: '1', off: '0' }"
            @item-change="handlerSubmitPutShelf($event, row)" />
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
    </el-tabs>
    <el-dialog
      class="goods-detail-dialog center"
      title="商品详情"
      append-to-body
      lock-scroll
      v-dialogDrag
      v-if="detailVisible"
      :width="dialogTab === 'detail' ? '500px' : '800px'"
      :visible.sync="detailVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-tabs
        v-model="dialogTab">
        <el-tab-pane
          label="商品详情"
          name="detail" />
        <el-tab-pane
          label="商品照片"
          name="photo" />
        <sib-form
          v-if="dialogTab === 'detail'"
          submit-text="保存"
          cancel-text="取消"
          :item-info="detailItemInfo"
          :form="detailForm"
          @submit="handlerSubmitDetail"
          @reset="detailVisible = false"
        />
        <sib-table
          ref="dialogTable"
          v-else
          border
          stripe
          :table-column="photoTableColumn"
          :table-data="tableData"
          :request-config="photoRequestConfig">
          <template #content-body>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-plus"
              @click.native="handlerAddPhoto(row)">
              上传
            </el-button>
          </template>
          <template #operate="{ row }">
            <el-button
              type="text"
              @click.native="handlerEditPhoto(row)">
              编辑
            </el-button>
            <el-button
              type="text"
              @click.native="handlerDeletePhoto(row)">
              删除
            </el-button>
            <el-button
              type="text"
              @click.native="handlerDownloadPhoto(row)">
              下载
            </el-button>
          </template>
        </sib-table>
      </el-tabs>
    </el-dialog>
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
    <el-dialog
      class="center"
      width="500px"
      append-to-body
      lock-scroll
      v-dialogDrag
      v-if="photoConfig.visible"
      :title="photoConfig.title"
      :visible.sync="photoConfig.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <sib-form
        submit-text="保存"
        cancel-text="取消"
        :item-info="photoConfig.itemInfo"
        :form="photoConfig.form"
        @submit="handlerSubmitPhoto"
        @reset="photoConfig.visible = false"
      />
    </el-dialog>
  </div>
</template>

<script>

export default {
    name: 'GoodsManage',
    data() {
        return {
            isLoading: false,
            pageType: 'goodsType',
            searchInfos: {
                goodsType: [
                    {
                        label: '业务类型',
                        code: '2',
                        type: 'select',
                        options: [],
                    },
                ],
                goodsList: [
                    {
                        label: '商品名称',
                        code: '2',
                        type: 'text',
                    },
                    {
                        label: '商品类型',
                        code: '5',
                        type: 'select',
                        options: [],
                    },
                    {
                        label: '是否推荐',
                        code: '3',
                        type: 'select',
                        options: [
                            {
                                key: '1',
                                value: '是',
                            },
                            {
                                key: '0',
                                value: '否',
                            },
                        ],
                    },
                    {
                        label: '状态',
                        code: '1',
                        type: 'select',
                        options: [
                            {
                                key: '1',
                                value: '售罄',
                            },
                            {
                                key: '2',
                                value: '正常',
                            },
                            {
                                key: '3',
                                value: '已下架',
                            },
                        ],
                    },
                ],
            },
            tableColumns: {
                goodsType: [
                    {
                        label: '商品类型',
                        code: '1',
                    },
                    {
                        label: '操作',
                        code: 'operate',
                        type: 'slot',
                        width: 150,
                    },
                ],
                goodsList: [
                    {
                        label: '商品名称',
                        code: '2',
                    },
                    {
                        label: '商品详情',
                        code: 'goodsDetail',
                        type: 'slot',
                    },
                    {
                        label: '数量',
                        code: '4',
                    },
                    {
                        label: '是否推荐',
                        code: '5',
                    },
                    {
                        label: '状态',
                        code: '6',
                    },
                    {
                        label: '上架',
                        code: 'putShelf',
                        type: 'slot',
                    },
                    {
                        label: '操作',
                        code: 'operate',
                        type: 'slot',
                        width: 150,
                    },
                ],
            },
            tableData: Array(22).fill().map((_, i) => ({
                id: i,
                1: `test${i}`,
                2: `test${i}`,
                3: `test${i}`,
                4: `test${i}`,
                5: `test${i}`,
                6: `test${i}`,
            })),
            requestConfigs: {
                goodsType: {
                    // url: '/edc-profile-service/organization/findPage',
                    // method: 'post',
                    // params: {},
                    // callback: res => res.data,
                },
                goodsList: {
                    // url: '/edc-profile-service/organization/findPage',
                    // method: 'post',
                    // params: {},
                    // callback: res => res.data,
                },
            },
            dialogConfig: {
                title: '',
                type: 'add',
                visible: false,
                itemInfo: [],
                addItemInfos: {
                    goodsType: [
                        {
                            label: '商品类型',
                            code: '2',
                            type: 'text',
                            required: true,
                        },
                    ],
                    goodsList: [
                        {
                            label: '商品名称',
                            code: '2',
                            type: 'text',
                            required: true,
                        },
                        {
                            label: '数量',
                            code: '4',
                            type: 'number',
                            required: true,
                        },
                        {
                            label: '是否推荐',
                            code: '3',
                            type: 'select',
                            options: [
                                {
                                    key: '1',
                                    value: '是',
                                },
                                {
                                    key: '0',
                                    value: '否',
                                },
                            ],
                        },
                        {
                            label: '状态',
                            code: 'status',
                            type: 'select',
                            options: [
                                {
                                    key: '1',
                                    value: '售罄',
                                },
                                {
                                    key: '2',
                                    value: '正常',
                                },
                                {
                                    key: '3',
                                    value: '已下架',
                                },
                            ],
                            required: true,
                        },
                    ],
                },
                editItemInfos: [],
                form: {},
            },
            currrentRow: {},
            detailVisible: false,
            dialogTab: 'detail',
            detailItemInfo: [
                {
                    label: '商品详情',
                    code: '1',
                    type: 'textarea',
                },
                {
                    label: '是否推荐',
                    code: '3',
                    type: 'select',
                    options: [
                        {
                            key: '1',
                            value: '是',
                        },
                        {
                            key: '0',
                            value: '否',
                        },
                    ],
                },
                {
                    label: '推荐理由',
                    code: '2',
                    type: 'textarea',
                },
                {
                    label: '价格',
                    code: '4',
                    type: 'number',
                },
                {
                    label: '兑换次数',
                    code: '5',
                    type: 'number',
                },
                {
                    label: '兑换时间',
                    code: '6',
                    type: 'daterange',
                    startCode: 'startDate',
                    endCode: 'endDate',
                },
                {
                    label: '自提地址',
                    code: '7',
                    type: 'textarea',
                },
            ],
            detailForm: {},
            photoTableColumn: [
                {
                    label: '附件',
                    code: '1',
                },
                {
                    label: '是否首页',
                    code: '2',
                },
                {
                    label: '排序',
                    code: '3',
                },
                {
                    label: '备注',
                    code: '4',
                },
                {
                    label: '操作',
                    code: 'operate',
                    type: 'slot',
                    width: 150,
                },
            ],
            photoRequestConfig: {
                // url: '/edc-profile-service/organization/findPage',
                // method: 'post',
                // params: {},
                // callback: res => res.data,
            },
            photoConfig: {
                title: '',
                type: 'add',
                visible: false,
                itemInfo: [],
                addItemInfo: [
                    {
                        label: '附件',
                        code: '1',
                        type: 'upload',
                    },
                    {
                        label: '是否首页',
                        code: '2',
                        type: 'select',
                        options: [
                            {
                                key: '1',
                                value: '是',
                            },
                            {
                                key: '0',
                                value: '否',
                            },
                        ],
                    },
                    {
                        label: '排序',
                        code: '3',
                        type: 'number',
                    },
                    {
                        label: '备注',
                        code: '4',
                        type: 'textarea',
                    },
                ],
                editItemInfo: [],
                form: {},
            },
        };
    },
    methods: {
        handlerViewDetail(row) {
            this.currrentRow = row;
            this.detailVisible = true;
            this.$http.post('/', { id: row.id }).then((res) => {
                this.detailForm = res && res.data && res.data.data || {};
                this.detailVisible = true;
            });
        },
        handlerSubmitPutShelf(value, row) {
            this.isLoading = true;
            this.$http.post('/', { value, id: row.id }).then(() => {
                this.$message.success('保存成功');
            }).catch(() => {
                // eslint-disable-next-line no-underscore-dangle
                row._putShelf = row.putShelf;
            }).finally(() => {
                this.isLoading = false;
            });
        },
        // 删除
        handlerDelete({ id }) {
            this.$confirm('确定删除吗？', '温馨提示', {
                type: 'warning',
                confirmButtonText: '确定删除',
            }).then(() => {
                const url = this.pageType === 'goodsType' ? '/url1' : '/url2';
                this.$http.post(url, { id }).then(() => {
                    this.$message.success('删除成功');
                    if (this.$refs.sibTable) this.$refs.sibTable.getTableData();
                });
            });
        },
        // 打开新增弹窗
        handlerAdd() {
            this.dialogConfig.title = '新增';
            this.dialogConfig.type = 'add';
            this.dialogConfig.itemInfo = this.dialogConfig.addItemInfos[this.pageType];
            this.dialogConfig.form = {};
            this.dialogConfig.visible = true;
        },
        // 打开编辑弹窗
        handlerEdit(row) {
            const { addItemInfos, editItemInfos } = this.dialogConfig;
            this.dialogConfig.title = '编辑';
            this.dialogConfig.type = 'update';
            this.dialogConfig.itemInfo = editItemInfos[this.pageType] && editItemInfos[this.pageType].length ? editItemInfos[this.pageType] : (addItemInfos[this.pageType] || []);
            this.dialogConfig.form = JSON.parse(JSON.stringify(row));
            this.dialogConfig.visible = true;
        },
        // 创建、编辑用户提交
        handlerSubmit(form, cb) {
            const { type } = this.dialogConfig;
            const urlConfig = {
                add: {
                    goodsType: '/url1',
                    goodsList: '/url2',
                },
                update: {
                    goodsType: '/url3',
                    goodsList: '/url4',
                },
            };

            this.$http.post(urlConfig[type][this.pageType], form).then(() => {
                this.$message.success('保存成功');
                this.dialogConfig.visible = false;
                if (this.$refs.sibTable) this.$refs.sibTable.getTableData();
            }).finally(cb);
        },
        // 提交商品详情
        handlerSubmitDetail(form, cb) {
            this.$http.post('', form).then(() => {
                this.$message.success('保存成功');
                this.detailVisible = false;
                if (this.$refs.sibTable) this.$refs.sibTable.getTableData();
            }).finally(cb);
        },
        handlerAddPhoto() {
            this.photoConfig.title = '新增';
            this.photoConfig.type = 'add';
            this.photoConfig.itemInfo = this.photoConfig.addItemInfo;
            this.photoConfig.form = {};
            this.photoConfig.visible = true;
        },
        handlerEditPhoto(row) {
            const { addItemInfo, editItemInfo } = this.photoConfig;
            this.photoConfig.title = '编辑';
            this.photoConfig.type = 'update';
            this.photoConfig.itemInfo = editItemInfo && editItemInfo.length ? editItemInfo : (addItemInfo || []);
            this.photoConfig.form = JSON.parse(JSON.stringify(row));
            this.photoConfig.visible = true;
        },
        handlerSubmitPhoto(form, cb) {
            this.$http.post('', form).then(() => {
                this.$message.success('保存成功');
                this.detailVisible = false;
                if (this.$refs.dialogTable) this.$refs.dialogTable.getTableData();
            }).finally(cb);
        },
        // 删除
        handlerDeletePhoto({ id }) {
            this.$confirm('确定删除吗？', '温馨提示', {
                type: 'warning',
                confirmButtonText: '确定删除',
            }).then(() => {
                this.$http.post('url', { id }).then(() => {
                    this.$message.success('删除成功');
                    if (this.$refs.dialogTable) this.$refs.dialogTable.getTableData();
                });
            });
        },
        handlerDownloadPhoto(row) {
            if (row.url) window.download(row.url);
        },
    },
};
</script>

<style lang="scss">
// @import "@/assets/scss/theme.scss";

.goods-manage {
    .el-tabs {
        height: 100%;
        .el-tabs__content {
            height: calc(100% - 40px);
        }
    }
}
.goods-detail-dialog {
    .el-dialog__body {
        .el-tabs {
            .el-tabs__content .sib-table {
                height: 500px;
            }
        }
    }
}
</style>
