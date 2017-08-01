<template>
<div class="pop pop-dialog" v-show="visible">
    <div class="dialog-wrap">
    </div>
</div>
</template>

<script>
import hello from 'hello'

export default {
  name: 'Confirm',

  props: {
    message: String, // 标题信息
    // 提示信息
    hint: String,
    /**
     * 确认的文字
     * @type {Object}
     */
    okText: {
      type: String,
      default: '确定'
    },
    /**
     * 取消的文字
     * @type {Object}
     */
    cancelText: {
      type: String,
      default: '取消'
    },
    okCb: {
      type: Function,
      default: () => {}
    },
    cancelCb: {
      type: Function,
      default: () => {}
    },
    type: {
      type: Number,
      default: 1
    }
  },

  data () {
    return {
      visible: false
    }
  },

  methods: {
    handler() {
      // 触发test事件
      this.$emit('on-test')
    }
  }
}
</script>

<style scoped>
.highlight-btn {
  background: #f0514b !important;
  border-color: #f0514b !important;
  color: #fff !important;
}

.normal-btn {
  background: #fff !important;
  color: #212121 !important;
  border-color: #a4a4a4 !important;
}

.hints {
  color: #cdcdcd;
  text-align: center;
  font-size: .14rem;
  margin-bottom: -.3rem;
}

</style>
