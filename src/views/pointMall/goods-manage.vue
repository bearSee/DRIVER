

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
        :page-param-keys="pageParamKeys"
        :search-info="searchInfos[pageType]"
        :table-column="tableColumns[pageType]"
        :request-config="requestConfigs[pageType]">
        <template #content-body>
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click.native="handlerAdd">
            新增
          </el-button>
        </template>
        <template #goodsDetail="{ row }">
          <el-button
            type="text"
            @click.native="handlerViewDetail(row)">
            详情
          </el-button>
        </template>
        <template #publishStatus="{ row }">
          <sib-item
            v-model="row.publishStatus"
            :props="{ type: 'switch', on: 'Y', off: 'N' }"
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
          :form="currrentRow"
          @submit="handlerSubmitDetail"
          @reset="detailVisible = false"
        />
        <sib-table
          ref="dialogTable"
          v-else
          border
          stripe
          :page-param-keys="pageParamKeys"
          :table-column="photoTableColumn"
          :request-config="photoRequestConfig">
          <template #content-body>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-plus"
              @click.native="handlerAddPhoto">
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
      class="upload-dialog center"
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
        ref="dialogForm"
        submit-text="保存"
        cancel-text="取消"
        :item-info="photoConfig.itemInfo"
        :form="photoConfig.form"
        @submit="handlerSubmitPhoto"
        @reset="photoConfig.visible = false">
        <template #files="{ form }">
          <div
            class="image-box"
            v-if="form.imageUrl">
            <el-image
              :src="form.imageUrl"
              :preview-src-list="[form.imageUrl]" />
            <i
              class="el-icon-error"
              @click="handlerRemoveImage" />
          </div>
          <el-button
            type="primary"
            icon="el-icon-plus"
            v-else
            @click.native="handlerOpenUpload(form)">
            上传
          </el-button>
        </template>
      </sib-form>
    </el-dialog>
    <el-dialog
      class="center"
      width="720px"
      title="图片上传"
      append-to-body
      lock-scroll
      v-dialogDrag
      v-if="uploadVisible"
      :visible.sync="uploadVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <upload-cover
        :src="currentImage"
        @submit="handlerUpload"
        @cancel="uploadVisible = false" />
    </el-dialog>
  </div>
</template>

<script>
import uploadCover from '@/components/upload-cover';

export default {
    name: 'GoodsManage',
    components: { uploadCover },
    data() {
        return {
            isLoading: false,
            pageType: 'goodsType',
            pageParamKeys: {
                pageIndex: 'page',
                pageSize: 'limit',
            },
            searchInfos: {
                goodsType: [
                    {
                        label: '业务类型',
                        code: 'categoryName',
                        type: 'text',
                    },
                ],
                goodsList: [
                    {
                        label: '商品名称',
                        code: 'productName',
                        type: 'text',
                    },
                    {
                        label: '商品类型',
                        code: 'categoryCode',
                        type: 'select',
                        options: [],
                        optionProps: {
                            key: 'categoryCode',
                            value: 'categoryName',
                        },
                        requestConfig: {
                            url: '/product/category/queryPage',
                            method: 'post',
                            params: { page: 1, limit: 999 },
                            callback: res => ((res.data || {}).page || {}).list || [],
                            stringify: true,
                        },
                    },
                    {
                        label: '是否推荐',
                        code: 'recommendFlag',
                        type: 'select',
                        options: [],
                        optionProps: {
                            key: 'dicKey',
                            value: 'dicValue',
                        },
                        requestConfig: {
                            url: '/dict/select/list/RECOMMEND_FLAG',
                            method: 'get',
                            params: {},
                            callback: res => (res.data || {}).list || [],
                        },
                    },
                    {
                        label: '状态',
                        code: 'productStatus',
                        type: 'select',
                        options: [],
                        optionProps: {
                            key: 'dicKey',
                            value: 'dicValue',
                        },
                        requestConfig: {
                            url: '/dict/select/list/PRODUCT_STATUS',
                            method: 'get',
                            params: {},
                            callback: res => (res.data || {}).list || [],
                        },
                    },
                ],
            },
            tableColumns: {
                goodsType: [
                    {
                        label: '商品类型名称',
                        code: 'categoryName',
                    },
                    {
                        label: '商品类型编码',
                        code: 'categoryCode',
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
                        code: 'productName',
                    },
                    {
                        label: '商品详情',
                        code: 'goodsDetail',
                        type: 'slot',
                    },
                    {
                        label: '数量',
                        code: 'productNum',
                    },
                    {
                        label: '是否推荐',
                        code: 'recommendFlagName',
                    },
                    {
                        label: '状态',
                        code: 'productStatusName',
                    },
                    {
                        label: '上架',
                        code: 'publishStatus',
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
            requestConfigs: {
                goodsType: {
                    url: '/product/category/queryPage',
                    method: 'post',
                    params: {},
                    callback: res => ((res.data || {}).page || {}).list || [],
                    stringify: true,
                },
                goodsList: {
                    url: '/product/info/queryPage',
                    method: 'post',
                    params: {},
                    callback: res => ((res.data || {}).page || {}).list || [],
                    stringify: true,
                },
            },
            dialogConfig: {
                title: '',
                type: 'save',
                visible: false,
                itemInfo: [],
                addItemInfos: {
                    goodsType: [
                        {
                            label: '商品类型名称',
                            code: 'categoryName',
                            type: 'text',
                            required: true,
                        },
                        {
                            label: '商品类型编码',
                            code: 'categoryCode',
                            type: 'text',
                            required: true,
                        },
                    ],
                    goodsList: [
                        {
                            label: '商品名称',
                            code: 'productName',
                            type: 'text',
                            required: true,
                        },
                        {
                            label: '数量',
                            code: 'productNum',
                            type: 'number',
                            required: true,
                        },
                        {
                            label: '商品类型',
                            code: 'categoryCode',
                            type: 'select',
                            options: [],
                            optionProps: {
                                key: 'categoryCode',
                                value: 'categoryName',
                            },
                            requestConfig: {
                                url: '/product/category/queryPage',
                                method: 'post',
                                params: { page: 1, limit: 999 },
                                callback: res => ((res.data || {}).page || {}).list || [],
                                stringify: true,
                            },
                        },
                        {
                            label: '是否推荐',
                            code: 'recommendFlag',
                            type: 'select',
                            options: [],
                            optionProps: {
                                key: 'dicKey',
                                value: 'dicValue',
                            },
                            requestConfig: {
                                url: '/dict/select/list/RECOMMEND_FLAG',
                                method: 'get',
                                params: {},
                                callback: res => (res.data || {}).list || [],
                            },
                        },
                        {
                            label: '推荐理由',
                            code: 'recommendReason',
                            type: 'textarea',
                            maxlength: 500,
                        },
                        {
                            label: '状态',
                            code: 'productStatus',
                            type: 'select',
                            options: [],
                            optionProps: {
                                key: 'dicKey',
                                value: 'dicValue',
                            },
                            requestConfig: {
                                url: '/dict/select/list/PRODUCT_STATUS',
                                method: 'get',
                                params: {},
                                callback: res => (res.data || {}).list || [],
                            },
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
                    label: '商品描述',
                    code: 'productDesc',
                    type: 'textarea',
                    maxlength: 500,
                },
                {
                    label: '商品价格',
                    code: 'price',
                    type: 'number',
                },
                {
                    label: '兑换次数',
                    code: 'exchangeNum',
                    type: 'number',
                },
                {
                    label: '兑换时间',
                    code: 'exchangeDate',
                    type: 'daterange',
                    startCode: 'exchangeBeginDate',
                    endCode: 'exchangeEndDate',
                },
                {
                    label: '自提地址',
                    code: 'address',
                    type: 'textarea',
                },
            ],
            photoTableColumn: [
                {
                    label: '附件',
                    code: 'fileOriginalName',
                    width: 350,
                },
                {
                    label: '是否首页',
                    code: 'isFirst',
                    formatter: ({ isFirst }) => ({ Y: '是', N: '否' })[isFirst],
                },
                {
                    label: '排序',
                    code: 'sort',
                },
                {
                    label: '备注',
                    code: 'remark',
                },
                {
                    label: '操作',
                    code: 'operate',
                    type: 'slot',
                    width: 120,
                },
            ],
            photoRequestConfig: {
                url: '/product/file/list',
                method: 'post',
                params: {},
                callback: res => (res.data || {}).data || [],
                stringify: true,
            },
            photoConfig: {
                title: '',
                type: 'save',
                visible: false,
                itemInfo: [],
                addItemInfo: [
                    {
                        label: '附件',
                        code: 'files',
                        type: 'slot',
                    },
                    {
                        label: '是否首页',
                        code: 'isFirst',
                        type: 'select',
                        options: [
                            {
                                key: 'Y',
                                value: '是',
                            },
                            {
                                key: 'N',
                                value: '否',
                            },
                        ],
                    },
                    {
                        label: '排序',
                        code: 'sort',
                        type: 'number',
                        value: 1,
                    },
                    {
                        label: '备注',
                        code: 'remark',
                        type: 'textarea',
                    },
                ],
                editItemInfo: [],
                form: {},
            },
            uploadVisible: false,
        };
    },
    methods: {
        handlerViewDetail(row) {
            row.exchangeDate = [row.exchangeBeginDate || '', row.exchangeEndDate || ''];
            this.currrentRow = row;
            this.detailVisible = true;
            this.photoRequestConfig.params.productInfoId = row.id;
        },
        handlerSubmitPutShelf(publishStatus, row) {
            this.isLoading = true;
            console.log('publishStatus', publishStatus);
            this.$http.post('/product/info/update', { ...row, publishStatus }).then(() => {
                this.$message.success('保存成功');
            }).finally(() => {
                this.isLoading = false;
                if (this.$refs.sibTable) this.$refs.sibTable.getTableData();
            });
        },
        // 删除
        handlerDelete({ id }) {
            this.$confirm('确定删除吗？', '温馨提示', {
                type: 'warning',
                confirmButtonText: '确定删除',
            }).then(() => {
                const url = this.pageType === 'goodsType' ? '/product/category/delete' : '/product/info/delete';
                const params = this.pageType === 'goodsType' ? { productCategoryId: id } : { productInfoId: id };
                this.$http.post(url, this.$qs.stringify(params)).then(() => {
                    this.$message.success('删除成功');
                    if (this.$refs.sibTable) this.$refs.sibTable.getTableData();
                });
            });
        },
        // 打开新增弹窗
        handlerAdd() {
            this.dialogConfig.title = '新增';
            this.dialogConfig.type = 'save';
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
                save: {
                    goodsType: '/product/category/save',
                    goodsList: '/product/info/save',
                },
                update: {
                    goodsType: '/product/category/update',
                    goodsList: '/product/info/update',
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
            this.$http.post('/product/info/update', form).then(() => {
                this.$message.success('保存成功');
                this.detailVisible = false;
                if (this.$refs.sibTable) this.$refs.sibTable.getTableData();
            }).finally(cb);
        },
        handlerAddPhoto() {
            this.photoConfig.title = '新增';
            this.photoConfig.type = 'save';
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
            this.$http.post('/product/file/save', this.$qs.stringify(form)).then(() => {
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
                this.$http.post('/product/file/delete', this.$qs.stringify({ productFileId: id })).then(() => {
                    this.$message.success('删除成功');
                    if (this.$refs.dialogTable) this.$refs.dialogTable.getTableData();
                });
            });
        },
        handlerOpenUpload(form) {
            this.uploadVisible = true;
            this.currentImage = form.imageUrl;
        },
        handlerRemoveImage() {
            this.$set(this.$refs.dialogForm.currentForm, 'imageUrl', '');
        },
        handlerUpload(path) {
            this.$set(this.$refs.dialogForm.currentForm, 'imageUrl', path);
            this.uploadVisible = false;
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
.upload-dialog {
    .files-temp  {
        .el-form-item__content {
            .image-box {
                width: 60px;
                height: 60px;
                position: relative;
                .el-image {
                    width: 60px;
                    height: 60px;
                }
                .el-icon-error {
                    position: absolute;
                    position: absolute;
                    top: -7px;
                    right: -7px;
                    color: black;
                    font-size: 18px;
                    cursor: pointer;
                    z-index: 2;
                }
            }
        }
    }
}
</style>
