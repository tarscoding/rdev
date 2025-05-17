<template>
  <el-card class="form-card-container">
    <div class="form-card-header">
      <slot name="title"></slot>
      <el-button v-if="showReset" class="reset-btn" @click="onReset" type="warning" size="small">重置</el-button>
    </div>
    <div class="form-card-body">
      <slot></slot>
    </div>
    <div class="form-card-footer">
      <el-button v-if="showPrev" @click="onPrev" class="footer-btn left-btn">上一步</el-button>
      <el-button v-if="showNext" @click="onNext" class="footer-btn right-btn" type="primary">下一步</el-button>
      <el-button v-if="showGenerate" @click="onGenerate" class="footer-btn right-btn" type="success">生成</el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
const { showPrev, showNext, showReset, showGenerate } = defineProps({
  showPrev: Boolean,
  showNext: Boolean,
  showReset: Boolean,
  showGenerate: Boolean
});
const emit = defineEmits(['prev', 'next', 'reset', 'generate']);
const onPrev = () => emit('prev');
const onNext = () => emit('next');
const onReset = () => emit('reset');
const onGenerate = () => emit('generate');
</script>

<style scoped>
.form-card-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 24px;
  position: relative;
}
.form-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.reset-btn {
  position: absolute;
  right: 24px;
  top: 24px;
}
.form-card-body {
  margin-bottom: 32px;
}
.form-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.footer-btn.left-btn {
  margin-right: auto;
}
.footer-btn.right-btn {
  margin-left: auto;
}
</style> 