

<template>
  <div class="order-manage">
    <sib-table
      ref="sibTable"
      border
      stripe
      v-loading="isLoading"
      :row-size="4"
      :page-param-keys="pageParamKeys"
      :search-info="searchInfo"
      :table-column="tableColumn"
      :request-config="requestConfig">
      <template #goodsDetail="{ row }">
        <el-button
          type="text"
          @click.native="handlerViewDetail(row)">
          详情
        </el-button>
      </template>
      <template #remark="{ row }">
        <sib-item
          v-model="row.remark"
          :props="{ type: 'text' }"
          @item-change="handlerSubmitRemarks($event, row)" />
      </template>
      <template #operate="{ row }">
        <el-button
          type="text"
          :disabled="row.orderStatus !== 'ORDER_STATUS_NEW'"
          @click.native="handlerChangeStatus(row, 'finish')">
          已完成
        </el-button>
        <el-button
          type="text"
          :disabled="row.orderStatus !== 'ORDER_STATUS_APPLY_CANCEL'"
          @click.native="handlerChangeStatus(row, 'cancel')">
          确认取消
        </el-button>
      </template>
    </sib-table>
    <el-dialog
      class="order-detail-dialog center"
      width="800px"
      title="订单详情"
      append-to-body
      lock-scroll
      v-dialogDrag
      v-if="detailVisible"
      :visible.sync="detailVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <div
        class="image-box"
        v-if="currrentRow.filePath">
        <el-image
          :src="currrentRow.filePath"
          :preview-src-list="[currrentRow.filePath]" />
      </div>
      <sib-form
        cancel-text="取消"
        border
        disabled
        :row-size="2"
        :item-info="detailItemInfo"
        :form="currrentRow"
        :is-submit="false"
        @reset="detailVisible = false"
      />
    </el-dialog>
  </div>
</template>

<script>

export default {
    name: 'OrderManage',
    data() {
        return {
            isLoading: false,
            pageParamKeys: {
                pageIndex: 'page',
                pageSize: 'limit',
            },
            searchInfo: [
                {
                    label: '订单编号',
                    code: 'orderNo',
                    type: 'text',
                },
                {
                    label: '会员姓名',
                    code: 'userName',
                    type: 'text',
                },
                {
                    label: '状态',
                    code: 'orderStatus',
                    type: 'select',
                    options: [],
                    optionProps: {
                        key: 'dicKey',
                        value: 'dicValue',
                    },
                    requestConfig: {
                        url: '/dict/select/list/ORDER_STATUS',
                        method: 'get',
                        params: {},
                        callback: res => (res.data || {}).list || [],
                    },
                },
            ],
            tableColumn: [
                {
                    label: '订单编号',
                    code: 'orderNo',
                },
                {
                    label: '商品名称',
                    code: 'productName',
                },
                {
                    label: '订单详情',
                    code: 'goodsDetail',
                    type: 'slot',
                },
                {
                    label: '会员姓名',
                    code: 'userName',
                },
                {
                    label: '会员手机号码',
                    code: 'userMobile',
                },
                {
                    label: '下单时间',
                    code: 'orderDt',
                },
                {
                    label: '状态',
                    code: 'orderStatusName',
                },
                {
                    label: '备注',
                    code: 'remark',
                    type: 'slot',
                },
                {
                    label: '操作',
                    code: 'operate',
                    type: 'slot',
                    width: 150,
                },
            ],
            requestConfig: {
                url: '/order/queryPage',
                method: 'post',
                params: {},
                callback: res => ((res.data || {}).page || {}).list || [],
                totalCallback: res => ((res.data || {}).page || {}).totalCount || 0,
                stringify: true,
            },
            currrentRow: {},
            detailVisible: false,
            detailItemInfo: [
                {
                    label: '订单编号',
                    code: 'orderNo',
                    type: 'label',
                },
                {
                    label: '商品名称',
                    code: 'productName',
                    type: 'label',
                },
                {
                    label: '兑换所需积分',
                    code: 'productPrice',
                    type: 'label',
                },
                {
                    label: '商品数量',
                    code: 'productNum',
                    type: 'label',
                },
                {
                    label: '会员姓名',
                    code: 'userName',
                    type: 'label',
                },
                {
                    label: '会员手机号码',
                    code: 'userMobile',
                    type: 'label',
                },
                {
                    label: '下单时间',
                    code: 'orderDt',
                    type: 'label',
                },
                {
                    label: '状态',
                    code: 'orderStatusName',
                    type: 'label',
                },
            ],
        };
    },
    methods: {
        handlerViewDetail(row) {
            this.currrentRow = row;
            this.detailVisible = true;
        },
        handlerSubmitRemarks(remark, row) {
            // if (!remark) return;
            this.isLoading = true;
            this.$http.post('/order/updateRemark', this.$qs.stringify({ remark, orderId: row.id })).then(() => {
                this.$message.success('保存成功');
            }).finally(() => {
                this.isLoading = false;
                if (this.$refs.sibTable) this.$refs.sibTable.getTableData();
            });
        },
        handlerChangeStatus({ id }, type) {
            const obj = {
                finish: {
                    url: '/order/finish',
                    message: '是否已完成？',
                },
                cancel: {
                    url: '/order/cancelConfirm',
                    message: '是否确认取消？',
                },
            };
            const { message, url } = obj[type];
            this.$confirm(message, '温馨提示', {
                type: 'warning',
            }).then(() => {
                this.isLoading = true;
                this.$http.post(url, this.$qs.stringify({ orderId: id })).then(() => {
                    this.$message.success('操作成功');
                    if (this.$refs.sibTable) this.$refs.sibTable.getTableData();
                }).finally(() => {
                    this.isLoading = false;
                });
            });
        },
    },
};
</script>

<style lang="scss">
// @import "@/assets/scss/theme.scss";

.order-manage {

}
.order-detail-dialog {
    .image-box {
        display: flex;
        margin-bottom: 15px;
        .el-image {
            width: 100px;
            height: 100px;
            margin: auto;
        }
        .text-label {

        }
    }
}
</style>
