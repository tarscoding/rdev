<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useProjectStore, defaultConfigForForm } from '../stores/project';
import type { ProjectConfig } from '../types/project';
import { open } from '@tauri-apps/plugin-dialog';
import { getProjectConfigRules } from '../validators/projectConfigRules';
import { httpGetText, parseRustVersions } from '../utils/http';
import type { FormInstance } from 'element-plus';
import FormCardContainer from './FormCardContainer.vue';

// 1. 表单数据与状态
const projectStore = useProjectStore();
const formData = ref<{
  repoType: 'local' | 'remote',
  localPath: string,
  remoteRepo: string,
  name: string,
  description: string,
  version: string,
  author: string,
  rustVersion: string,
  nationCode: string,
  timezone: string
}>({
  ...defaultConfigForForm
});
const loading = ref(false);
const rustVersions = ref<{ label: string; value: string }[]>([{ label: 'latest', value: 'latest' }]);

// 计算当前选中的国家对象
const currentNation = computed(() =>
  projectStore.nationList.find(n => n.code === formData.value.nationCode)
);
// 计算当前国家的时区选项
const timezoneOptions = computed(() =>
  currentNation.value ? currentNation.value.timezone : []
);

// 2. Rust 版本获取与处理
async function fetchRustVersions(query = '') {
  loading.value = true;
  try {
    const content = await httpGetText('https://releases.rs');
    rustVersions.value = parseRustVersions(content, query);
  } catch (error) {
    console.error('获取 Rust 版本失败:', error);
    rustVersions.value = [{ label: 'last-stable', value: 'latest' }];
  } finally {
    loading.value = false;
  }
}

// 3. 远程搜索处理
async function handleRemoteRustVersion(query: string) {
  await fetchRustVersions(query);
}

// 4. 其他表单相关逻辑
const emit = defineEmits<{
  (e: 'submit', config: ProjectConfig): void
  (e: 'next'): void
  (e: 'prev'): void
  (e: 'generate'): void
}>();

const resetConfig = () => {
  formData.value = { ...defaultConfigForForm };
  formRef.value?.resetFields();
  formRef.value?.clearValidate();
};

async function chooseDirectory() {
  const selected = await open({
    directory: true,
    multiple: false
  });
  if (selected) {
    formData.value.localPath = selected;
  }
}

// 表单过滤
const rules = computed(() => getProjectConfigRules(formData.value.repoType));
const formRef = ref<FormInstance>();

const props = defineProps<{
  currentStep: number;
  totalSteps: number;
}>();

const handleNext = async () => {
  if (!formData.value || !formRef.value) return;
  try {
    await formRef.value.validate();
    // 组装 ProjectConfig
    const nation = projectStore.nationList.find(n => n.code === formData.value.nationCode);
    const config: ProjectConfig = {
      repoType: formData.value.repoType,
      localPath: formData.value.localPath,
      remoteRepo: formData.value.remoteRepo,
      name: formData.value.name,
      description: formData.value.description,
      version: formData.value.version,
      author: formData.value.author,
      rustVersion: formData.value.rustVersion,
      nation: {
        ...(nation as any),
        timezone: [formData.value.timezone]
      }
    };
    projectStore.setProjectConfig(config);
    emit('next');
  } catch (error) {
    // 校验失败，阻止跳转
    console.error('表单验证失败:', error);
  }
};

// 5. 初始化
fetchRustVersions();

watch(
  () => ({
    nationCode: formData.value.nationCode,
    remoteRepo: formData.value.remoteRepo
  }),
  (newVal, oldVal) => {
    // 处理 nationCode 变化
    if (!oldVal || newVal.nationCode !== oldVal.nationCode) {
      const nation = projectStore.nationList.find(n => n.code === newVal.nationCode);
      if (nation && nation.timezone.length > 0) {
        formData.value.timezone = nation.timezone[0];
      }
    }
    // 处理 remoteRepo 变化
    if (!oldVal || newVal.remoteRepo !== oldVal.remoteRepo) {
      formRef.value?.clearValidate();
      if (newVal.remoteRepo) {
        const match = newVal.remoteRepo.match(/([^\/]+?)(?:\.git)?$/);
        if (match && match[1]) {
          formData.value.name = match[1];
        }
      }
    }
  },
  { immediate: true }
);

</script>

<template>
  <FormCardContainer :showPrev="props.currentStep > 1" :showNext="props.currentStep < props.totalSteps"
    :showReset="true" :showGenerate="props.currentStep === props.totalSteps" @prev="$emit('prev')" @next="handleNext"
    @reset="resetConfig" @generate="$emit('generate')">
    <template #title>项目基础设置</template>
    <el-form ref="formRef" :model="formData" label-width="120px" class="project-form" status-icon>
      <el-form-item label="存储方式">
        <el-radio-group v-model="formData.repoType">
          <el-radio-button :value="'local'">本地存储</el-radio-button>
          <el-radio-button :value="'remote'">远程存储</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <div v-if="formData.repoType === 'local'">
        <el-form-item label="本地目录" prop="localPath" :rules="rules.localPath">
          <el-input v-model="formData.localPath" placeholder="请选择存储目录" style="width: 300px;" readonly>
            <template #append>
              <el-button @click="chooseDirectory">选择目录</el-button>
            </template>
          </el-input>
        </el-form-item>
      </div>
      <div v-if="formData.repoType === 'remote'">
        <el-form-item label="远程仓库" prop="remoteRepo" :rules="rules.remoteRepo">
          <el-input v-model="formData.remoteRepo" placeholder="请输入远程仓库(请确保您的计算机有访问仓库的权限)" />
        </el-form-item>
      </div>
      <el-form-item label="项目名称" prop="name" :rules="rules.name">
        <el-input v-model="formData.name" placeholder="请输入项目名称" />
      </el-form-item>
      <el-form-item label="项目描述" prop="description" :rules="rules.description">
        <el-input v-model="formData.description" type="textarea" placeholder="请输入项目描述" />
      </el-form-item>
      <el-form-item label="版本号" prop="version" :rules="rules.version">
        <el-input v-model="formData.version" placeholder="请输入版本号" />
      </el-form-item>
      <el-form-item label="作者">
        <el-input v-model="formData.author" placeholder="请输入作者" />
      </el-form-item>
      <el-form-item label="国家">
        <el-select
          v-model="formData.nationCode"
          placeholder="请选择国家"
        >
          <el-option
            v-for="nation in projectStore.nationList"
            :key="nation.code"
            :label="nation.name"
            :value="nation.code"
          />
        </el-select>
        <div class="form-help-text">选择项目所在的国家/地区，会为中国地区替换为国内加速镜像</div>
      </el-form-item>
      <el-form-item label="时区">
        <el-select
          v-model="formData.timezone"
          placeholder="请选择时区"
        >
          <el-option
            v-for="option in timezoneOptions"
            :key="option"
            :label="option"
            :value="option"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Rust 版本">
        <el-select v-model="formData.rustVersion" filterable remote :remote-method="handleRemoteRustVersion"
          :loading="loading" placeholder="请选择 Rust 版本">
          <el-option v-for="item in rustVersions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>
  </FormCardContainer>
</template>

<style scoped>
.project-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.form-help-text {
  font-size: 12px;
  color: #909399;
  line-height: 1.4;
  padding-top: 4px;
}
</style>
