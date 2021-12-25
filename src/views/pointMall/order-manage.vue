

<template>
  <div class="order-manage">
    <sib-table
      ref="sibTable"
      border
      stripe
      v-loading="isLoading"
      :row-size="4"
      :search-info="searchInfo"
      :table-column="tableColumn"
      :table-data="tableData"
      :request-config="requestConfig">
      <template #goodsDetail="{ row }">
        <el-button
          type="text"
          @click.native="handlerViewDetail(row)">
          详情
        </el-button>
      </template>
      <template #remarks="{ row }">
        <sib-item
          v-model="row._remarks"
          :props="{ type: 'text' }"
          @blur="handlerSubmitRemarks($event, row)" />
      </template>
      <template #operate="{ row }">
        <el-button
          type="text"
          @click.native="handlerFinish(row)">
          已完成
        </el-button>
        <el-button
          type="text"
          @click.native="handlerCancel(row)">
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
        :form="detailForm"
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
            searchInfo: [
                {
                    label: '订单编号',
                    code: '2',
                    type: 'text',
                },
                {
                    label: '会员姓名',
                    code: '3',
                    type: 'text',
                },
                {
                    label: '状态',
                    code: '1',
                    type: 'select',
                    options: [],
                },
            ],
            tableColumn: [
                {
                    label: '订单编号',
                    code: '1',
                },
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
                    label: '会员姓名',
                    code: '4',
                },
                {
                    label: '会员手机号码',
                    code: '5',
                },
                {
                    label: '下单时间',
                    code: '6',
                },
                {
                    label: '状态',
                    code: 'status',
                },
                {
                    label: '备注',
                    code: 'remarks',
                    type: 'slot',
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
            })),
            requestConfig: {
                // url: '/edc-profile-service/organization/findPage',
                // method: 'post',
                // params: {},
                // callback: res => res.data,
            },
            currrentRow: {},
            detailVisible: false,
            detailItemInfo: [
                {
                    label: '商品详情',
                    code: '1',
                    type: 'label',
                },
                {
                    label: '是否推荐',
                    code: '3',
                    type: 'label',
                },
                {
                    label: '推荐理由',
                    code: '2',
                    type: 'label',
                },
                {
                    label: '价格',
                    code: '4',
                    type: 'label',
                },
                {
                    label: '兑换次数',
                    code: '5',
                    type: 'label',
                },
                {
                    label: '兑换时间',
                    code: '6',
                    type: 'label',
                },
                {
                    label: '自提地址',
                    code: '7',
                    type: 'label',
                },
            ],
            detailForm: {},
        };
    },
    methods: {
        handlerViewDetail(row) {
            this.currrentRow = row;
            this.detailVisible = true;
            this.detailForm = row;
            this.$http.post('/', { id: row.id }).then((res) => {
                this.detailForm = res && res.data && res.data.data || {};
                this.detailVisible = true;
            });
        },
        handlerSubmitRemarks(value, row) {
            this.isLoading = true;
            this.$http.post('/', { value, id: row.id }).then(() => {
                this.$message.success('保存成功');
            }).catch(() => {
                // eslint-disable-next-line no-underscore-dangle
                row._remarks = row.remarks;
            }).finally(() => {
                this.isLoading = false;
            });
        },
        handlerFinish(row) {
            this.isLoading = true;
            this.$http.post('/', { id: row.id }).then(() => {
                this.$message.success('操作成功');
                if (this.$refs.sibTable) this.$refs.sibTable.getTableData();
            }).finally(() => {
                this.isLoading = false;
            });
        },
        handlerCancel(row) {
            this.isLoading = true;
            this.$http.post('/', { id: row.id }).then(() => {
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
