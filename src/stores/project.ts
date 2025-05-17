import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ProjectConfig } from '../types/project';

// 抽取默认配置为常量
const defaultConfig: ProjectConfig = {
  repoType: 'local',
  localPath: '',
  remoteRepo: '',
  name: '',
  description: '',
  version: '0.1.0',
  author: '',
  rustVersion: 'latest',
};

export const useProjectStore = defineStore('project', () => {
  const projectConfig = ref<ProjectConfig>({ ...defaultConfig });

  function setProjectConfig(config: ProjectConfig) {
    projectConfig.value = config;
  }

  function resetConfig() {
    projectConfig.value = { ...defaultConfig };
  }

  return {
    projectConfig,
    setProjectConfig,
    resetConfig
  };
}); 
