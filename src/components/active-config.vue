

<template>
  <div class="active-config">
    <el-dialog
      class="config-dialog center"
      title="发放机制"
      append-to-body
      lock-scroll
      v-dialogDrag
      :width="dialogWidth"
      :visible.sync="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handlerClose">
      <sib-form
        cancel-text="取消"
        :item-info="configItemInfos[activityType]"
        :form="configForm"
        @submit="handlerSubmitConfig"
        @reset="handlerClose">
        <template
          v-for="code in Object.keys(configTableDatas[activityType] || {})"
          #[code]>
          <sib-table
            size="mini"
            border
            stripe
            :ref="code"
            :key="code"
            :page-sizes="[5, 10]"
            :page-size="5"
            :is-pagination="!!configTableDatas[activityType][code].length"
            :table-column="configTableColumns[activityType]"
            :table-data="configTableDatas[activityType][code]">
            <template #content-body>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-plus"
                @click.native="handlerAddRule(code)">
                新增规则
              </el-button>
            </template>
            <template #ruleKey="{ row, config }">
              <sib-item
                v-model="row[config.configProps.code]"
                :props="config.configProps" />
            </template>
            <template #ruleValue="{ row, config }">
              <sib-item
                v-model="row[config.configProps.code]"
                :props="config.configProps" />
            </template>
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
  </div>
</template>

<script>

export default {
    name: 'ActiveConfig',
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        data: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        const numberProps = {
            type: 'number',
            min: 0,
            precision: 0,
            controls: false,
        };
        return {
            configItemInfos: {
                // 签到活动
                ACTIVITY_SIGN: [
                    {
                        label: '默认奖励',
                        code: 'score',
                        unit: '积分',
                        width: '45%',
                        required: true,
                        ...numberProps,
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
                        code: 'ruleOver',
                        unit: '天',
                        width: 'calc(33% - 10px)',
                        ...numberProps,
                    },
                    {
                        label: '后， 每连续签到',
                        placeholder: '请输入',
                        code: 'ruleDays',
                        unit: '天',
                        width: 'calc(33% - 10px)',
                        ...numberProps,
                    },
                    {
                        label: '将额外奖励 ',
                        placeholder: '请输入',
                        code: 'ruleScore',
                        unit: '积分',
                        width: 'calc(33% - 10px)',
                        ...numberProps,
                    },
                ],
                // 邀请活动
                ACTIVITY_INVITATION: [
                    {
                        label: '邀请人奖励:',
                        code: '_title1',
                    },
                    {
                        label: '默认奖励',
                        code: 'score',
                        unit: '积分',
                        width: '45%',
                        required: true,
                        ...numberProps,
                    },
                    {
                        label: '额外奖励',
                        code: 'additional',
                        type: 'slot',
                    },
                    {
                        label: '累计邀请超过',
                        placeholder: '请输入',
                        code: 'ruleOver',
                        unit: '人',
                        width: 'calc(33% - 10px)',
                        ...numberProps,
                    },
                    {
                        label: '后， 每邀请',
                        placeholder: '请输入',
                        code: 'ruleNumber',
                        unit: '人',
                        width: 'calc(33% - 10px)',
                        ...numberProps,
                    },
                    {
                        label: '将额外奖励 ',
                        placeholder: '请输入',
                        code: 'ruleScore',
                        unit: '积分',
                        width: 'calc(33% - 10px)',
                        ...numberProps,
                    },
                    {
                        label: '被邀请人奖励:',
                        code: '_title2',
                    },
                    {
                        label: '新司机可得奖励',
                        placeholder: '请输入',
                        code: 'newDriverScore',
                        unit: '积分',
                        width: '45%',
                        ...numberProps,
                    },
                ],
                // 分享活动
                ACTIVITY_SHARE: [
                    {
                        label: '默认奖励',
                        code: 'score',
                        unit: '积分',
                        required: true,
                        ...numberProps,
                    },
                    {
                        label: '当日最多获取次数',
                        placeholder: '请输入',
                        code: 'dayMax',
                        unit: '次',
                        ...numberProps,
                    },
                ],
                // 点赞活动
                ACTIVITY_LIKES: [
                    {
                        label: '默认奖励',
                        code: 'score',
                        unit: '积分',
                        required: true,
                        ...numberProps,
                    },
                    {
                        label: '当日最多获取次数',
                        placeholder: '请输入',
                        code: 'dayMax',
                        unit: '次',
                        ...numberProps,
                    },
                ],
                // 评论活动
                ACTIVITY_COMMENT: [
                    {
                        label: '默认奖励',
                        code: 'score',
                        unit: '积分',
                        required: true,
                        ...numberProps,
                    },
                    {
                        label: '当日最多获取次数',
                        placeholder: '请输入',
                        code: 'dayMax',
                        unit: '次',
                        ...numberProps,
                    },
                ],
                // 首次兑换
                ACTIVITY_FIRST_EXCHANGE: [
                    {
                        label: '默认奖励',
                        code: 'score',
                        unit: '积分',
                        required: true,
                        ...numberProps,
                    },
                ],
                // 首次登录
                ACTIVITY_FIRST_LOGIN: [
                    {
                        label: '默认奖励',
                        code: 'score',
                        unit: '积分',
                        required: true,
                        ...numberProps,
                    },
                ],
            },
            configForm: {},
            configFormCallback: {
                // 签到活动
                ACTIVITY_SIGN: (config) => {
                    const { days, over, score } = config.cumulative || {};
                    this.configForm = {
                        ...config,
                        ruleDays: days,
                        ruleOver: over,
                        ruleScore: score,
                    };
                    this.configTableDatas[this.activityType] = {
                        additional: window.deepCopy(config.additional || []),
                        continuity: window.deepCopy(config.continuity || []),
                    };
                },
                // 邀请活动
                ACTIVITY_INVITATION: (config) => {
                    const { number, over, score } = config.cumulative || {};
                    this.configForm = {
                        ...config,
                        ruleNumber: number,
                        ruleOver: over,
                        ruleScore: score,
                    };
                    this.configTableDatas[this.activityType] = {
                        additional: window.deepCopy(config.additional || []),
                    };
                },
            },
            configTableColumns: {
                // 签到活动
                ACTIVITY_SIGN: [
                    {
                        label: '连续签到天数',
                        code: 'ruleKey',
                        type: 'slot',
                        configProps: {
                            ...numberProps,
                            code: 'days',
                            unit: '天',
                        },
                    },
                    {
                        label: '奖励积分数量',
                        code: 'ruleValue',
                        type: 'slot',
                        configProps: {
                            ...numberProps,
                            code: 'score',
                            unit: '积分',
                        },
                    },
                    {
                        label: '操作',
                        code: 'operate',
                        type: 'slot',
                        width: 80,
                    },
                ],
                // 邀请活动
                ACTIVITY_INVITATION: [
                    {
                        label: '邀请人数',
                        code: 'ruleKey',
                        type: 'slot',
                        configProps: {
                            ...numberProps,
                            code: 'number',
                            unit: '人',
                        },
                    },
                    {
                        label: '奖励积分数量',
                        code: 'ruleValue',
                        type: 'slot',
                        configProps: {
                            ...numberProps,
                            code: 'score',
                            unit: '积分',
                        },
                    },
                    {
                        label: '操作',
                        code: 'operate',
                        type: 'slot',
                        width: 80,
                    },
                ],
                // 分享活动
                ACTIVITY_SHARE: [],
                // 点赞活动
                ACTIVITY_LIKES: [],
                // 评论活动
                ACTIVITY_COMMENT: [],
                // 首次兑换
                ACTIVITY_FIRST_EXCHANGE: [],
                // 首次登录
                ACTIVITY_FIRST_LOGIN: [],
            },
            configTableDatas: {
                // 签到活动
                ACTIVITY_SIGN: {
                    continuity: [],
                    additional: [],
                },
                // 邀请活动
                ACTIVITY_INVITATION: {
                    additional: [],
                },
            },
        };
    },
    computed: {
        // 签到活动 ACTIVITY_SIGN
        // 邀请活动 ACTIVITY_INVITATION
        // 分享活动 ACTIVITY_SHARE
        // 点赞活动 ACTIVITY_LIKES
        // 评论活动 ACTIVITY_COMMENT
        // 首次兑换 ACTIVITY_FIRST_EXCHANGE
        // 首次登录 ACTIVITY_FIRST_LOGIN
        activityType() {
            return this.data.activityType || 'ACTIVITY_SIGN';
        },
        dialogWidth() {
            return ['ACTIVITY_SIGN', 'ACTIVITY_INVITATION'].includes(this.activityType) ? '900px' : '450px';
        },
    },
    methods: {
        getConfigForm() {
            const activityConfig = JSON.parse(this.data.activityCfg || '{}');
            if (this.configFormCallback[this.activityType]) {
                this.configFormCallback[this.activityType](activityConfig);
                return;
            }
            this.configForm = activityConfig;
        },
        handlerAddRule(code) {
            this.configTableDatas[this.activityType][code].push({});
        },
        handlerDelete(index, code) {
            this.configTableDatas[this.activityType][code].splice(index, 1);
        },
        handlerSubmitConfig(form, cb) {
            this.$http.post('/activity/config', {
                activityId: this.data.id,
                activityCfg: JSON.stringify({
                    ...form,
                    ...(this.configTableDatas[this.activityType] || {}),
                    cumulative: {
                        days: form.ruleDays || 0,
                        number: form.ruleNumber || 0,
                        over: form.ruleOver || 0,
                        score: form.ruleScore || 0,
                    },
                }),
            }).then(() => {
                this.$message.success('保存成功');
                this.$emit('submit-success');
                this.handlerClose();
            }).finally(cb);
        },
        handlerClose() {
            this.$emit('update:visible', false);
        },
    },
    created() {
        this.getConfigForm();
    },
};
</script>

<style lang="scss">
// @import "@/assets/scss/theme.scss";

.config-dialog {
    ._title1-temp, ._title2-temp {
        .el-form-item__label {
            color: #f56c6c;
        }
    }
}
</style>
