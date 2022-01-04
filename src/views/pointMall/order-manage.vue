

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
          :disabled="row.orderStatus === 'ORDER_STATUS_FINISH'"
          @click.native="handlerChangeStatus(row, 'ORDER_STATUS_FINISH')">
          已完成
        </el-button>
        <el-button
          type="text"
          :disabled="row.orderStatus === 'ORDER_STATUS_CANCELED'"
          @click.native="handlerChangeStatus(row, 'ORDER_STATUS_CANCELED')">
          确认取消
        </el-button>
      </template>
    </sib-table>
    <el-dialog
      class="center"
      width="500px"
      title="商品详情"
      append-to-body
      lock-scroll
      v-dialogDrag
      v-if="detailVisible"
      :visible.sync="detailVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <sib-form
        cancel-text="取消"
        border
        disabled
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
                    label: '商品详情',
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
                stringify: true,
            },
            currrentRow: {},
            detailVisible: false,
            detailItemInfo: [
                {
                    label: '商品详情',
                    code: 'productDesc',
                    type: 'label',
                },
                {
                    label: '是否推荐',
                    code: 'recommendFlagName',
                    type: 'label',
                },
                {
                    label: '推荐理由',
                    code: 'recommendReason',
                    type: 'label',
                },
                {
                    label: '价格',
                    code: 'price',
                    type: 'label',
                },
                {
                    label: '兑换次数',
                    code: 'exchangeNum',
                    type: 'label',
                },
                {
                    label: '兑换开始时间',
                    code: 'exchangeBeginDate',
                    type: 'label',
                },
                {
                    label: '兑换截止时间',
                    code: 'exchangeEndDate',
                    type: 'label',
                },
                {
                    label: '自提地址',
                    code: 'address',
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
        handlerChangeStatus(row, orderStatus) {
            this.isLoading = true;
            this.$http.post('/order/updateStatus', this.$qs.stringify({ orderId: row.id, orderStatus })).then(() => {
                this.$message.success('操作成功');
                if (this.$refs.sibTable) this.$refs.sibTable.getTableData();
            }).finally(() => {
                this.isLoading = false;
            });
        },
    },
};
</script>

<style lang="scss">
// @import "@/assets/scss/theme.scss";

.order-manage {

}
</style>
