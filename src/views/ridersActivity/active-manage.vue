

<template>
  <div class="active-manage">
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
      <template #search-operate>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click.native="handlerAdd">
          新增
        </el-button>
        <el-button
          type="primary"
          icon="el-icon-s-tools"
          @click.native="settingVisible = true">
          设置
        </el-button>
      </template>
      <template #config="{ row }">
        <el-button
          type="text"
          @click.native="handlerConfig(row)">
          配置
        </el-button>
      </template>
      <template #explain="{ row }">
        <el-button
          type="text"
          @click.native="handlerViewExplain(row)">
          {{ row.explain }}
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
          @click.native="handlerEnable([row], String(row.status) === '1' ? 'N' : 'Y')">
          {{ String(row.status) === '1' ? '失效' : '生效' }}
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
    <!-- 设置 弹窗 -->
    <el-dialog
      class="setting-dialog center"
      width="500px"
      title="设置"
      append-to-body
      lock-scroll
      v-dialogDrag
      :visible.sync="settingVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <sib-form
        cancel-text="取消"
        :item-info="settingItemInfo"
        :form="settingForm"
        @submit="handlerSubmitSetting"
        @reset="settingVisible = false"
      />
    </el-dialog>
    <!-- 发放机制 弹窗 -->
    <el-dialog
      class="config-dialog center"
      width="1100px"
      title="发放机制"
      append-to-body
      lock-scroll
      v-dialogDrag
      v-if="configVisible"
      :visible.sync="configVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <sib-form
        cancel-text="取消"
        :item-info="configItemInfo"
        :form="configForm"
        @submit="handlerSubmitConfig"
        @reset="configVisible = false">
        <template
          v-for="code in ['_code1', '_code2']"
          #[code]>
          <sib-table
            size="mini"
            border
            stripe
            :ref="code"
            :key="code"
            :page-sizes="[5, 10]"
            :page-size="5"
            :table-column="configTableColumn"
            :table-data="configTableDatas[code]">
            <template #content-body>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-plus"
                @click.native="handlerAddRule(code)">
                新增规则
              </el-button>
            </template>
            <template #days="{ row }">
              <sib-item
                v-model="row.days"
                :props="configDaysProps" />
            </template>
            <template #points="{ row }">
              <sib-item
                v-model="row.points"
                :props="configPointsProps" />
            </template>
            <template #operate="{ realIndex }">
              <el-button
                type="text"
                :disabled="configTableDatas[code].length < 2"
                @click.native="handlerDelete(realIndex, code)">
                删除
              </el-button>
            </template>
          </sib-table>
        </template>
      </sib-form>
    </el-dialog>
    <el-dialog
      class="center"
      width="500px"
      title="活动说明"
      append-to-body
      lock-scroll
      v-dialogDrag
      v-if="explainVisible"
      :visible.sync="explainVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      活动说明
    </el-dialog>
  </div>
</template>

<script>

export default {
    name: 'ActiveManage',
    data() {
        return {
            isLoading: false,
            searchInfo: [
                {
                    label: '活动名称',
                    code: '3',
                    type: 'text',
                },
            ],
            tableColumn: [
                {
                    label: '活动类型',
                    code: '1',
                },
                {
                    label: '发放机制',
                    code: 'config',
                    type: 'slot',
                },
                {
                    label: '活动说明',
                    code: 'explain',
                    type: 'slot',
                },
                {
                    label: '备注',
                    code: '2',
                },
                {
                    label: '状态',
                    code: '3',
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
                config: `test${i}`,
                explain: `test${i}`,
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
                        label: '活动类型',
                        code: '1',
                        type: 'select',
                        options: [],
                    },
                    {
                        label: '活动说明',
                        code: 'explain',
                        type: 'textarea',
                    },
                    {
                        label: '备注',
                        code: '2',
                        type: 'textarea',
                    },
                    {
                        label: '状态',
                        code: '3',
                        type: 'select',
                        options: [],
                    },
                ],
                editItemInfo: [],
                form: {},
            },
            settingVisible: false,
            settingItemInfo: [
                {
                    label: '每日积分封顶（个人）',
                    code: '1',
                    type: 'text',
                    valueType: 'number',
                    maxlength: 10,
                    unit: '积分',
                    required: true,
                },
                {
                    label: '每日积分封顶（平台）',
                    code: '2',
                    type: 'text',
                    valueType: 'number',
                    maxlength: 10,
                    unit: '积分',
                    required: true,
                },
            ],
            settingForm: {},
            configVisible: false,
            configItemInfo: [
                {
                    label: '默认奖励',
                    code: 'a',
                    type: 'text',
                    valueType: 'number',
                    unit: '积分',
                    width: '40%',
                    required: true,
                },
                {
                    label: '连续签到',
                    code: '_code1',
                    type: 'slot',
                },
                {
                    label: '额外奖励',
                    code: '_code2',
                    type: 'slot',
                },
                {
                    label: '连续签到',
                    placeholder: '请输入',
                    code: 'm',
                    type: 'text',
                    valueType: 'number',
                    unit: '天',
                    width: '30%',
                },
                {
                    label: '后， 每连续签到',
                    placeholder: '请输入',
                    code: 'n',
                    type: 'text',
                    valueType: 'number',
                    unit: '天',
                    width: '30%',
                },
                {
                    label: '将额外奖励 ',
                    placeholder: '请输入',
                    code: 'o',
                    type: 'text',
                    valueType: 'number',
                    unit: '积分',
                    width: '30%',
                },
            ],
            configForm: {},
            configTableColumn: [
                {
                    label: '连续签到天数',
                    code: 'days',
                    type: 'slot',
                },
                {
                    label: '奖励积分数量',
                    code: 'points',
                    type: 'slot',
                },
                {
                    label: '操作',
                    code: 'operate',
                    type: 'slot',
                    width: 80,
                },
            ],
            configTableDatas: {
                _code1: [{}],
                _code2: [{}],
            },
            configDaysProps: {
                type: 'text',
                valueType: 'number',
                unit: '天',
            },
            configPointsProps: {
                type: 'text',
                valueType: 'number',
                unit: '积分',
            },
            explainVisible: false,
        };
    },
    methods: {
        getSetting() {
            this.$http.post('url').then((res) => {
                this.settingForm = res && res.data && res.data.data || {};
            });
        },
        // 启用/禁用
        handlerEnable(rows, enable) {
            if (!rows.length) {
                this.$message.warning('请至少勾选一条数据');
                return;
            }
            this.isLoading = true;
            const type = enable === 'Y' ? 'batchEnable' : 'batchDisable';
            this.$http.post(`/edc-user-service/user/${type}`, { ids: rows.map(({ id }) => id) }).then(() => {
                this.$message.success('操作成功');
                if (this.$refs.sibTable) this.$refs.sibTable.getTableData();
            }).finally(() => {
                this.isLoading = false;
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
        handlerConfig(row) {
            this.configVisible = true;
            this.$http.post('url', { id: row.id }).then((res) => {
                this.configForm = res && res.data && res.data.data || {};
                this.configVisible = true;
            });
        },
        handlerSubmitSetting(form, cb) {
            this.$http.post('url', form).then(() => {
                this.$message.success('保存成功');
                this.settingVisible = false;
            }).finally(cb);
        },
        handlerAddRule(code) {
            this.configTableDatas[code].push({});
        },
        handlerDelete(index, code) {
            this.configTableDatas[code].splice(index, 1);
        },
        handlerSubmitConfig(form, cb) {
            this.$http.post('url', form).then(() => {
                this.$message.success('保存成功');
                this.settingVisible = false;
            }).finally(cb);
        },
        handlerViewExplain(row) {
            console.log('row', row);
            this.explainVisible = true;
        },
    },
    created() {
        this.getSetting();
    },
};
</script>

<style lang="scss">
// @import "@/assets/scss/theme.scss";

.active-manage {

}
.config-dialog {
    .el-dialog__body {
        .sib-form {
            .sib-table {
                .content-body {
                    margin-top: 0;
                }
            }
        }
    }
}
</style>
