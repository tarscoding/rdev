import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { nation, ProjectConfig } from '../types/project';


const nationList: nation[] = [
  {
    name: '中国',
    code: 'CN',
    timezone: [
      'Asia/Shanghai',
      'Asia/Urumqi',
    ],
    utcOffset: '+08:00'
  },
  {
    name: '美国',
    code: 'US',
    timezone: [
      'America/New_York',
      'America/Chicago',
      'America/Denver',
      'America/Los_Angeles',
    ],
    utcOffset: '-05:00'
  },
  {
    name: '俄罗斯',
    code: 'RU',
    timezone: [
      'Europe/Moscow',
      'Asia/Yekaterinburg',
      'Asia/Omsk',
      'Asia/Krasnoyarsk',
      'Asia/Irkutsk',
      'Asia/Vladivostok',
    ],
    utcOffset: '+03:00'
  },
  {
    name: '英国',
    code: 'GB',
    timezone: ['Europe/London'],
    utcOffset: '+00:00'
  },
  {
    name: '德国',
    code: 'DE',
    timezone: ['Europe/Berlin'],
    utcOffset: '+01:00'
  },
  {
    name: '法国',
    code: 'FR',
    timezone: ['Europe/Paris'],
    utcOffset: '+01:00'
  },
  {
    name: '日本',
    code: 'JP',
    timezone: ['Asia/Tokyo'],
    utcOffset: '+09:00'
  },
  {
    name: '印度',
    code: 'IN',
    timezone: ['Asia/Kolkata'],
    utcOffset: '+05:30'
  },
  {
    name: '巴西',
    code: 'BR',
    timezone: ['America/Sao_Paulo'],
    utcOffset: '-03:00'
  },
  {
    name: '南非',
    code: 'ZA',
    timezone: ['Africa/Johannesburg'],
    utcOffset: '+02:00'
  },
  {
    name: '阿根廷',
    code: 'AR',
    timezone: ['America/Argentina/Buenos_Aires'],
    utcOffset: '-03:00'
  }
];

const defaultConfig: ProjectConfig = {
  repoType: 'local',
  localPath: '',
  remoteRepo: '',
  name: '',
  description: '',
  version: '0.1.0',
  author: '',
  rustVersion: 'latest',
  nation: nationList[0],
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
    nationList,
    setProjectConfig,
    resetConfig
  };
});

export const defaultConfigForForm = {
  repoType: 'local' as 'local',
  localPath: '',
  remoteRepo: '',
  name: '',
  description: '',
  version: '0.1.0',
  author: '',
  rustVersion: 'latest',
  nationCode: nationList[0].code,
  timezone: nationList[0].timezone[0]
}; 
