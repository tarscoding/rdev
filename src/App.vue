<script setup lang="ts">
import { ref } from 'vue';
import ProjectConfigForm from './components/ProjectConfigForm.vue';
import type { ProjectConfig } from './types/project';

const currentStep = ref(1);
const projectConfig = ref<ProjectConfig | null>(null);

const handleConfigSubmit = (config: ProjectConfig) => {
  projectConfig.value = config;
  currentStep.value = 2;
};
</script>

<template>
  <el-container class="app-container">
    <el-header>
      <h1>Rust 开发容器生成工具</h1>
      <p>选择您需要的开发场景或提交您的配置,我们将为您生成容器化项目配置,您也可以查看社区最流行的堆栈.</p>
    </el-header>

    <el-main>
      <el-steps :active="currentStep" finish-status="success" class="steps">
        <el-step title="项目设置" />
        <el-step title="开发场景" />
        <el-step title="容器设置" />
        <el-step title="开发设置" />
        <el-step title="工作流设置" />
        <el-step title="预览设置" />
      </el-steps>

      <div class="content">
        <ProjectConfigForm v-if="currentStep === 1" @submit="handleConfigSubmit" />

        <div v-else-if="currentStep === 2">
          <!-- 环境配置组件将在这里添加 -->
          <h2>环境配置</h2>
        </div>

        <div v-else>
          <!-- 项目生成预览将在这里添加 -->
          <h2>项目生成预览</h2>
        </div>
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
