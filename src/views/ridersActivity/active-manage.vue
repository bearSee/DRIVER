

<template>
  <div class="active-manage">
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
      <template #search-operate>
        <!-- <el-button
          type="primary"
          icon="el-icon-plus"
          @click.native="handlerAdd">
          新增
        </el-button> -->
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
      <template #activityDesc="{ row }">
        <el-button
          type="text"
          @click.native="handlerViewExplain(row)">
          {{ row.activityDesc || '-' }}
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
          @click.native="handlerEnable(row, String(row.enabled) === 'Y' ? 'N' : 'Y')">
          {{ String(row.enabled) === 'Y' ? '失效' : '生效' }}
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
      width="850px"
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
          v-for="code in ['continuity', 'additional']"
          #[code]>
          <sib-table
            size="mini"
            border
            stripe
            :ref="code"
            :key="code"
            :page-sizes="[5, 10]"
            :page-size="5"
            :is-pagination="!!configTableDatas[code].length"
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
            <template #score="{ row }">
              <sib-item
                v-model="row.score"
                :props="configPointsProps" />
            </template>
            <!-- :disabled="configTableDatas[code].length < 2" -->
            <template #operate="{ realIndex }">
              <el-button
                type="text"
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
      {{ currentRow.activityDesc }}
    </el-dialog>
  </div>
</template>

<script>

export default {
    name: 'ActiveManage',
    data() {
        return {
            isLoading: false,
            pageParamKeys: {
                pageIndex: 'page',
                pageSize: 'limit',
            },
            searchInfo: [
                {
                    label: '活动名称',
                    code: 'activityName',
                    type: 'text',
                },
            ],
            tableColumn: [
                {
                    label: '活动类型',
                    code: 'activityName',
                },
                {
                    label: '发放机制',
                    code: 'config',
                    type: 'slot',
                },
                {
                    label: '活动说明',
                    code: 'activityDesc',
                    type: 'slot',
                    showOverflowTooltip: true,
                },
                {
                    label: '备注',
                    code: 'remark',
                },
                {
                    label: '状态',
                    code: 'enabled',
                    formatter: ({ enabled }) => ({ Y: '生效', N: '失效' })[enabled],
                },
                {
                    label: '操作',
                    code: 'operate',
                    type: 'slot',
                },
            ],
            requestConfig: {
                url: '/activity/list',
                method: 'post',
                params: {},
                callback: res => (res.data || {}).data || [],
                stringify: true,
            },
            dialogConfig: {
                title: '',
                type: 'save',
                visible: false,
                itemInfo: [],
                addItemInfo: [
                    {
                        label: '活动说明',
                        code: 'activityDesc',
                        type: 'textarea',
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
            settingVisible: false,
            settingItemInfo: [
                {
                    label: '每日积分封顶（个人）',
                    code: 'score',
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
                    code: 'score',
                    type: 'number',
                    unit: '积分',
                    width: '45%',
                    required: true,
                    min: 0,
                    precision: 0,
                    controls: false,
                },
                {
                    label: '连续签到',
                    code: 'continuity',
                    type: 'slot',
                },
                {
                    label: '额外奖励',
                    code: 'additional',
                    type: 'slot',
                },
                {
                    label: '连续签到',
                    placeholder: '请输入',
                    code: 'days',
                    type: 'number',
                    unit: '天',
                    width: 'calc(33% - 10px)',
                    min: 0,
                    precision: 0,
                    controls: false,
                },
                {
                    label: '后， 每连续签到',
                    placeholder: '请输入',
                    code: 'over',
                    type: 'number',
                    unit: '天',
                    width: 'calc(33% - 10px)',
                    min: 0,
                    precision: 0,
                    controls: false,
                },
                {
                    label: '将额外奖励 ',
                    placeholder: '请输入',
                    code: 'continuityScore',
                    type: 'number',
                    unit: '积分',
                    width: 'calc(33% - 10px)',
                    min: 0,
                    precision: 0,
                    controls: false,
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
                    code: 'score',
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
                continuity: [],
                additional: [],
            },
            configDaysProps: {
                type: 'number',
                unit: '天',
                min: 0,
                precision: 0,
                controls: false,
            },
            configPointsProps: {
                type: 'number',
                unit: '积分',
                min: 0,
                precision: 0,
                controls: false,
            },
            explainVisible: false,
            currentRow: {},
        };
    },
    methods: {
        getSetting() {
            this.$http.post('/activitySet/list').then((res) => {
                this.settingForm = res && res.data || {};
            });
        },
        // 启用/禁用
        handlerEnable(row, enabled) {
            this.isLoading = true;
            this.$http.post('/activity/enable', { ...row, enabled }).then(() => {
                this.$message.success('操作成功');
                if (this.$refs.sibTable) this.$refs.sibTable.getTableData();
            }).finally(() => {
                this.isLoading = false;
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
            const url = `/activity/${type}`;

            this.$http.post(url, form).then(() => {
                this.$message.success('保存成功');
                this.dialogConfig.visible = false;
                if (this.$refs.sibTable) this.$refs.sibTable.getTableData();
            }).finally(cb);
        },
        handlerConfig(row) {
            this.currentRow = row;
            const activityConfig = JSON.parse(row.activityCfg || '{}');
            const cumulative = activityConfig.cumulative || {};
            this.configForm = {
                ...activityConfig,
                days: cumulative.days || '',
                over: cumulative.over || '',
                continuityScore: cumulative.score || '',
            };
            this.configTableDatas = {
                additional: activityConfig.additional || [],
                continuity: activityConfig.continuity || [],
            };
            this.configVisible = true;
        },
        handlerSubmitSetting(form, cb) {
            this.$http.post('/activitySet/update', form).then(() => {
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
            this.$http.post('/activity/config', {
                activityId: this.currentRow.id,
                activityCfg: JSON.stringify(form),
            }).then(() => {
                this.$message.success('保存成功');
                this.configVisible = false;
            }).finally(cb);
        },
        handlerViewExplain(row) {
            if (!row.activityDesc) return;
            this.currentRow = row;
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
