/**
 * 容器配置接口
 * 定义了容器的完整配置结构,包括基础层、环境层和运行时层
 * 采用分层设计,便于管理和维护
 */
export interface ContainerConfig {
  /** 基础层配置 (不可变核心) */
  Base: {
    /** 操作系统基础配置 */
    os: BaseImageConfig;
    /** 语言工具链配置 */
    toolchain: ToolchainConfig;
    /** 镜像仓库配置 */
    registry: {
      /** 镜像源配置 */
      mirrors: Record<string, string>;
      /** 认证信息 (可选) */
      auth?: {
        /** 用户名 */
        username: string;
        /** 密码 */
        password: string;
      };
    };
  };

  /** 环境层配置 (按需扩展) */
  Environment: {
    /** 环境模式 */
    mode: 'dev' | 'test' | 'prod';
    /** 环境工具配置 */
    tools: EnvironmentTools;
    /** 环境依赖配置 */
    dependencies: EnvironmentDependencies;
    /** 环境变量配置 */
    variables: Record<string, string>;
  };

  /** 运行时层配置 (动态注入) */
  Runtime: {
    /** 端口映射配置 */
    ports: Array<{
      /** 主机端口 */
      host: number;
      /** 容器端口 */
      container: number;
      /** 协议类型 */
      protocol: 'tcp' | 'udp';
      /** 端口名称 (可选) */
      name?: string;
      /** 端口描述 (可选) */
      description?: string;
      /** 是否暴露端口 (可选) */
      expose?: boolean;
    }>;
    /** 容器编排配置 */
    orchestration: OrchestrationConfig;
    /** 安全配置 */
    security: SecurityConfig;
    /** 可观测性配置 */
    observability: ObservabilityConfig;
    /** 健康检查配置 */
    health: {
      /** 检查配置 */
      check: {
        /** 检查类型 */
        type: 'http' | 'tcp' | 'command';
        /** 检查间隔 */
        interval: string;
        /** 超时时间 */
        timeout: string;
        /** 重试次数 */
        retries: number;
        /** 启动等待时间 (可选) */
        startPeriod?: string;
      };
      /** 重启策略 */
      restart: {
        /** 重启策略类型 */
        policy: 'no' | 'always' | 'unless-stopped' | 'on-failure';
        /** 最大重试次数 (可选) */
        maxRetries?: number;
      };
    };
  };

  /** 构建配置 */
  Build: {
    /** 构建阶段配置 */
    stages: Array<{
      /** 阶段名称 */
      name: string;
      /** 基础镜像 */
      baseImage: string;
      /** 构建参数 */
      args: Record<string, string>;
      /** 构建命令 */
      commands: string[];
      /** 构建产物配置 */
      artifacts: {
        /** 包含的文件 */
        include: string[];
        /** 排除的文件 (可选) */
        exclude?: string[];
      };
    }>;
    /** 缓存配置 */
    cache: {
      /** 是否启用缓存 */
      enabled: boolean;
      /** 缓存路径 */
      paths: string[];
    };
    /** 优化配置 */
    optimization: {
      /** 是否使用多阶段构建 */
      multiStage: boolean;
      /** 是否优化镜像层 */
      layerOptimization: boolean;
    };
  };
}

/**
 * 基础镜像配置
 * 定义了容器基础镜像的配置信息
 */
export interface BaseImageConfig {
  /** 镜像来源 */
  provider: 'official' | 'custom';
  /** 镜像名称 */
  name: string;
  /** 镜像标签 */
  tag: string;
  /** 架构类型 */
  architecture: 'x86_64' | 'arm64';
  /** 镜像源配置 */
  sourceMirrors: {
    /** Docker 仓库镜像源 (可选) */
    dockerRegistry?: string;
    /** 包管理器镜像源 (可选) */
    paketManager?: {
      /** Alpine 镜像源 (可选) */
      alpine?: string;
      /** Debian 镜像源 (可选) */
      debian?: string;
      /** Ubuntu 镜像源 (可选) */
      ubuntu?: string;
    };
    /** 语言生态镜像源 (可选) */
    language?: {
      /** Cargo 镜像源 (可选) */
      cargo?: string;
      /** NPM 镜像源 (可选) */
      npm?: string;
    };
  };
}

/**
 * 基础工具链配置
 * 定义容器的基础开发环境,包括语言工具链和核心系统工具
 * 这些是构建和运行环境必需的,相对稳定,不常变更
 */
export interface ToolchainConfig {
  /** 语言工具链配置 */
  languages: {
    /** 支持的语言类型 */
    name: 'rust' | 'golang' | 'python' | 'nodejs' | 'java';
    /** 语言版本 */
    version: string;
    /** 语言组件列表 (e.g. ["rust-src", "clippy"]) */
    components: string[];
    /** 语言特性开关 (e.g. ["async", "serde"]) */
    features: string[];
  };
  /** 系统工具链配置 */
  system: {
    /** 包管理器类型 */
    packageManager: 'apk' | 'apt' | 'yum';
    /** 核心工具列表 (e.g. ["curl", "git"]) */
    coreTools: string[];
    /** 开发工具配置 (e.g. { "gdb": ["13.2"] }) */
    devTools: Record<string, string[]>;
  };
}

export interface EnvironmentTools {
  dev?: {
    debuggers: string[];
    hotReload: {
      enabled: boolean;
      watchDirs: string[];
      excludeDirs: string[];
    };
  };
  test?: {
    coverage: {
      tools: 'tarpaulin' | 'gocov' | 'lcov';
      outputDir: string;
    };
    reportFormats: string[];
  };
  prod?: {
    optimization: {
      stripSymbols: boolean;
      minifyBinary: boolean;
      muslStatic?: boolean;
    };
    hardening: {
      nonRootUser: boolean;
      readOnlyFS: boolean;
      capabilities: string[];
    };
  };
}

/**
 * 项目依赖配置
 * 定义具体项目需要的依赖,包括系统包、服务和工具
 * 这些是项目运行所需的,会随项目需求变化而更新
 */
export interface EnvironmentDependencies {
  /** 系统级依赖配置 */
  system: {
    /** 系统包依赖 */
    packages: Array<{
      /** 包名称 */
      name: string;
      /** 包版本 (可选) */
      version?: string;
      /** 包来源 (可选) */
      source?: string;
    }>;
    /** 系统服务依赖 */
    services: Array<{
      /** 服务名称 */
      name: string;
      /** 是否启用 */
      enabled: boolean;
      /** 依赖的其他服务 (可选) */
      depends?: string[];
    }>;
    /** 系统库依赖 */
    libraries: Array<{
      /** 库名称 */
      name: string;
      /** 库版本 (可选) */
      version?: string;
      /** 库路径 (可选) */
      path?: string;
    }>;
  };

  /** 语言生态依赖配置 */
  language: {
    /** Rust 语言依赖 */
    rust?: {
      /** Crate 依赖列表 */
      crates: Array<{
        /** Crate 名称 */
        name: string;
        /** Crate 版本 */
        version: string;
        /** Crate 特性 (可选) */
        features?: string[];
      }>;
      /** 全局特性开关 */
      features: string[];
      /** 工具链组件 */
      toolchain: string[];
    };
    /** Go 语言依赖 */
    golang?: {
      /** Go 模块依赖 */
      modules: Array<{
        /** 模块路径 */
        path: string;
        /** 模块版本 */
        version: string;
      }>;
      /** Go 工具列表 */
      tools: string[];
    };
    /** Node.js 依赖 */
    nodejs?: {
      /** npm 包依赖 */
      packages: Array<{
        /** 包名称 */
        name: string;
        /** 包版本 */
        version: string;
        /** 是否为开发依赖 (可选) */
        dev?: boolean;
      }>;
    };
  };

  /** 工具依赖配置 */
  tools: {
    /** 二进制工具依赖 */
    binaries: Array<{
      /** 工具名称 */
      name: string;
      /** 工具版本 (可选) */
      version?: string;
      /** 工具来源 (可选) */
      source?: string;
    }>;
    /** 插件依赖 */
    plugins: Array<{
      /** 插件名称 */
      name: string;
      /** 插件版本 */
      version: string;
      /** 插件配置 (可选) */
      config?: Record<string, any>;
    }>;
  };
}

/**
 * 容器编排配置
 * 定义了容器的网络、资源和存储配置
 */
export interface OrchestrationConfig {
  /** 网络配置 */
  network: {
    /** 网络模式 */
    mode: 'bridge' | 'host' | 'overlay';
    /** 端口映射 */
    ports: Array<{
      /** 主机端口 */
      host: number;
      /** 容器端口 */
      container: number;
      /** 协议类型 */
      protocol: 'tcp' | 'udp';
    }>;
    /** DNS 配置 */
    dns: {
      /** DNS 服务器列表 */
      servers: string[];
      /** 搜索域名列表 (可选) */
      searchDomains?: string[];
    };
  };
  /** 资源限制配置 */
  resources: {
    /** CPU 配置 */
    cpu: {
      /** CPU 共享权重 */
      shares: number;
      /** CPU 配额 (可选) */
      quota?: string;
      /** CPU 核心绑定 (可选) */
      cores?: number[];
    };
    /** 内存配置 */
    memory: {
      /** 内存限制 */
      limit: string;
      /** 交换分区限制 (可选) */
      swap?: string;
      /** 内存保留 (可选) */
      reservation?: string;
    };
  };
  /** 存储配置 */
  volumes: Array<{
    /** 源路径 */
    source: string;
    /** 目标路径 */
    target: string;
    /** 存储类型 */
    type: 'bind' | 'volume' | 'tmpfs';
    /** 挂载选项 (可选) */
    options?: Record<string, string>;
  }>;
}

/**
 * 安全配置
 * 定义了容器的安全策略和隔离配置
 */
export interface SecurityConfig {
  /** 隔离配置 */
  isolation: {
    /** 用户命名空间 (可选) */
    userNamespace?: string;
    /** seccomp 配置文件 */
    seccompProfile: 'default' | 'strict' | 'custom';
    /** AppArmor 配置文件 (可选) */
    apparmorProfile?: string;
  };
  /** 运行时安全配置 */
  runtime: {
    /** 是否只读根文件系统 */
    readonlyRootfs: boolean;
    /** 是否禁止获取新权限 */
    noNewPrivileges: boolean;
    /** 需要屏蔽的路径 (可选) */
    maskedPaths?: string[];
  };
  /** 能力配置 */
  capabilities: {
    /** 添加的能力 */
    add: string[];
    /** 删除的能力 */
    drop: string[];
  };
  /** 密钥配置 */
  secrets: Array<{
    /** 密钥名称 */
    name: string;
    /** 挂载路径 */
    mountPath: string;
    /** 文件权限 */
    mode: number;
  }>;
}

/**
 * 可观测性配置
 * 定义了容器的日志、指标和追踪配置
 */
export interface ObservabilityConfig {
  /** 日志配置 */
  logging: {
    /** 日志驱动 */
    driver: 'json' | 'syslog' | 'fluentd';
    /** 驱动选项 */
    options: Record<string, string>;
    /** 日志轮转配置 */
    rotate: {
      /** 单个文件大小限制 */
      maxSize: string;
      /** 保留文件数量 */
      maxFiles: number;
    };
  };
  /** 指标配置 */
  metrics: {
    /** 是否启用指标收集 */
    enabled: boolean;
    /** 指标端口 (可选) */
    port?: number;
    /** 指标路径 (可选) */
    path?: string;
    /** 指标标签 (可选) */
    labels?: Record<string, string>;
  };
  /** 追踪配置 */
  tracing: {
    /** 是否启用追踪 */
    enabled: boolean;
    /** 追踪导出器 */
    exporter: 'jaeger' | 'zipkin' | 'otel';
    /** 采样率 */
    samplingRate: number;
    /** 是否启用上下文传播 */
    contextPropagation: boolean;
  };
}

/**
 * 依赖管理策略配置
 * 定义依赖的安装、验证和更新策略
 */
export interface DependencyManagement {
  /** 依赖安装策略 */
  install: {
    /** 安装顺序 */
    order: 'sequential' | 'parallel';
    /** 重试次数 */
    retry: number;
    /** 超时时间 */
    timeout: string;
  };
  
  /** 依赖验证策略 */
  validation: {
    /** 是否校验文件完整性 */
    checksum: boolean;
    /** 是否验证签名 */
    signature: boolean;
    /** 是否检查许可证 */
    license: boolean;
  };
  
  /** 依赖更新策略 */
  update: {
    /** 是否自动更新 */
    auto: boolean;
    /** 更新计划 (cron 表达式) */
    schedule: string;
    /** 是否通知更新 */
    notify: boolean;
  };
}
