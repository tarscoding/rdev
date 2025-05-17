import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { SceneConfig } from '../types/scene';


const sceneList: SceneConfig[] = [
  {
    name: '系统编程',
    description: '操作系统开发,设备驱动程序等',
    id: 'system',
    icon: 'system',
    color: 'blue'
  },
  {
    name: 'Web开发',
    description: 'Web服务或Wasme应用开发',
    id: 'web',
    icon: 'web',
    color: 'yellow'
  },
  {
    name: '命令行工具',
    description: '系统工具,开发工具,文件处理工具等',
    id: 'cli',
    icon: 'cli',
    color: 'graey'
  },
  {
    name: '网络编程',
    description: '高性能Web服务器, API服务,网络协议实现',
    id: 'network',
    icon: 'network',
    color: 'green'
  },
  {
    name: '区块链和加密货币',
    description: '智能合约平台,加密货币实现,DeFi应用',
    id: 'blockchain',
    icon: 'blockchain',
    color: 'gold'
  },
  {
    name: '游戏开发',
    description: '游戏引擎,游戏服务器,物理引擎',
    id: 'game',
    icon: 'game',
    color: 'purple'
  },
  {
    name: '数据处理和分析',
    description: '大数据处理,数据分析工具,ETL工具',
    id: 'data',
    icon: 'data',
    color: 'pink'
  },
  {
    name: '并发和分布式系统',
    description: '分布式计算框架,消息队列系统,集群管理',
    id: 'concurrent',
    icon: 'concurrent',
    color: 'cyan'
  },
  {
    name: '安全工具',
    description: '密码学工具,安全审计工具,漏洞扫描器',
    id: 'security',
    icon: 'security',
    color: 'red'
  },
  {
    name: '机器学习和人工智能',
    description: '机器学习框架,深度学习库,数据科学工具',
    id: 'ai',
    icon: 'ai',
    color: 'orange'
  },
  {
    name: '嵌入式系统',
    description: '物联网设备,嵌入式操作系统,硬件接口库',
    id: 'embedded',
    icon: 'embedded',
    color: 'brown'
  },
  {
    name: '图形和图像处理',
    description: '图形渲染引擎,图像处理库,计算机视觉工具',
    id: 'graphics',
    icon: 'graphics',
    color: 'teal'
  },
  {
    name: '音频和视频处理',
    description: '音频处理库,视频编解码器,流媒体应用',
    id: 'audio-video',
    icon: 'audio-video',
    color: 'lime'
  },
  {
    name: '跨平台应用',
    description: '跨平台桌面应用,移动应用开发',
    id: 'cross-platform',
    icon: 'cross-platform',
    color: 'indigo'
  }
];


export const useSceneStore = defineStore('scene', () => {
  const sceneListRef = ref<SceneConfig[]>(sceneList);
  const currentScene = ref<SceneConfig | null>(null);
  function setCurrentScene(scene: SceneConfig) {
    currentScene.value = scene;
  }
  function resetCurrentScene() {
    currentScene.value = null;
  }
  return {
    sceneListRef,
    currentScene,
    setCurrentScene,
    resetCurrentScene
  };
});



