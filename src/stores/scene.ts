import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { SceneConfig } from '../types/scene';


const sceneList: SceneConfig[] = [
  {
    name: '系统编程',
    description: '操作系统开发,设备驱动程序等',
    id: 'system',
    icon: 'ep:cpu',
    color: '#409EFF'
  },
  {
    name: 'Web开发',
    description: 'Web服务或Wasme应用开发',
    id: 'web',
    icon: 'ep:monitor',
    color: '#F7BA1E'
  },
  {
    name: '命令行工具',
    description: '系统工具,开发工具,文件处理工具等',
    id: 'cli',
    icon: 'ep:data-line',
    color: '#909399'
  },
  {
    name: '网络编程',
    description: '高性能Web服务器, API服务,网络协议实现',
    id: 'network',
    icon: 'ep:promotion',
    color: '#67C23A'
  },
  {
    name: '区块链和加密货币',
    description: '智能合约平台,加密货币实现,DeFi应用',
    id: 'blockchain',
    icon: 'ep:coin',
    color: '#F39C12'
  },
  {
    name: '游戏开发',
    description: '游戏引擎,游戏服务器,物理引擎',
    id: 'game',
    icon: 'ep:tools',
    color: '#8E44AD'
  },
  {
    name: '数据处理和分析',
    description: '大数据处理,数据分析工具,ETL工具',
    id: 'data',
    icon: 'ep:histogram',
    color: '#E67E9A'
  },
  {
    name: '并发和分布式系统',
    description: '分布式计算框架,消息队列系统,集群管理',
    id: 'concurrent',
    icon: 'ep:share',
    color: '#17C0EB'
  },
  {
    name: '安全工具',
    description: '密码学工具,安全审计工具,漏洞扫描器',
    id: 'security',
    icon: 'ep:lock',
    color: '#F56C6C'
  },
  {
    name: '机器学习和人工智能',
    description: '机器学习框架,深度学习库,数据科学工具',
    id: 'ai',
    icon: 'ep:magic-stick',
    color: '#FF8C00'
  },
  {
    name: '嵌入式系统',
    description: '物联网设备,嵌入式操作系统,硬件接口库',
    id: 'embedded',
    icon: 'ep:cpu',
    color: '#B9770E'
  },
  {
    name: '图形和图像处理',
    description: '图形渲染引擎,图像处理库,计算机视觉工具',
    id: 'graphics',
    icon: 'ep:picture',
    color: '#2980B9'
  },
  {
    name: '音频和视频处理',
    description: '音频处理库,视频编解码器,流媒体应用',
    id: 'audio-video',
    icon: 'ep:video-camera',
    color: '#16A085'
  },
  {
    name: '跨平台应用',
    description: '跨平台桌面应用,移动应用开发',
    id: 'cross-platform',
    icon: 'ep:platform',
    color: '#00B894'
  }
];


export const useSceneStore = defineStore('scene', () => {
  const sceneListRef = ref<SceneConfig[]>(sceneList);
  const currentSceneId = ref<string | null>(null);
  function setCurrentScene(id: string) {
    currentSceneId.value = id;
  }
  function resetCurrentScene() {
    currentSceneId.value = null;
  }
  return {
    sceneListRef,
    currentSceneId,
    setCurrentScene,
    resetCurrentScene
  };
});



