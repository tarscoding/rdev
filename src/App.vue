<script setup lang="ts">
import { ref } from 'vue';
import ProjectConfigForm from './components/ProjectConfigForm.vue';
import SceneConfigForm from './components/SceneConfigForm.vue';
import type { ProjectConfig } from './types/project';

const currentStep = ref(1);
const totalSteps = 6;
const projectConfig = ref<ProjectConfig | null>(null);

const handlePrev = () => {
  if (currentStep.value > 1) currentStep.value--;
};
const handleNext = () => {
  if (currentStep.value < totalSteps) currentStep.value++;
};

</script>

<template>
  <el-container class="app-container">
    <el-header>
      <h1>Rust 开发容器生成工具</h1>
      <p>选择您需要的开发场景或提交您的配置,我们将为您生成容器化项目配置,您也可以查看社区最流行的堆栈.</p>
    </el-header>

    <el-main>
      <el-steps :active="currentStep - 1" finish-status="success" class="steps">
        <el-step title="项目设置" />
        <el-step title="开发场景" />
        <el-step title="容器设置" />
        <el-step title="开发设置" />
        <el-step title="工作流设置" />
        <el-step title="预览设置" />
      </el-steps>

      <div class="content">
        <ProjectConfigForm
          v-if="currentStep === 1"
          :currentStep="currentStep"
          :totalSteps="totalSteps"
          @next="handleNext"
        />
        <SceneConfigForm
          v-if="currentStep === 2"
          :projectConfig="projectConfig"
          :currentStep="currentStep"
          :totalSteps="totalSteps"
          @prev="handlePrev"
          @next="handleNext"
        />
        <!-- 其他步骤... -->
      </div>
    </el-main>
  </el-container>
</template>

<style>
.app-container {
  min-height: 100vh;
}

.el-header {
  text-align: center;
  margin-bottom: 20px;
}

.el-main {
  padding: 20px;
}

.steps {
  margin-bottom: 40px;
}

.content {
  max-width: 800px;
  margin: 0 auto;
}
</style>
