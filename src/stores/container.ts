import { ContainerConfig } from "../types/container";

/**
 * 默认容器配置
 */
export const defaultContainerConfig: ContainerConfig = {
  Base: {
    os: {
      provider: 'official',
      name: 'rust',
      tag: '1.87.0-slim',
      architecture: 'x86_64',
      sourceMirrors: {
        dockerRegistry: 'https://registry.docker-cn.com',
        paketManager: {
          debian: 'https://mirrors.aliyun.com/debian/',
          ubuntu: 'https://mirrors.aliyun.com/ubuntu/'
        },
        language: {
          cargo: 'https://rsproxy.cn/crates.io-index',
          npm: 'https://registry.npmmirror.com'
        }
      }
    },
    toolchain: {
      languages: {
        name: 'rust',
        version: '1.87.0',
        components: ['rust-src', 'clippy', 'rustfmt', 'rust-analyzer'],
        features: ['async-std', 'tokio', 'serde']
      },
      system: {
        packageManager: 'apt',
        coreTools: ['curl', 'git', 'build-essential', 'pkg-config'],
        devTools: {
          'gdb': ['13.2'],
          'lldb': ['14.0']
        }
      }
    },
    registry: {
      mirrors: {
        'docker.io': 'https://registry.docker-cn.com',
        'ghcr.io': 'https://ghcr.mirrors.ustc.edu.cn'
      }
    }
  },
  Environment: {
    mode: 'dev',
    tools: {
      dev: {
        debuggers: ['lldb', 'gdb'],
        hotReload: {
          enabled: true,
          watchDirs: ['src'],
          excludeDirs: ['target', '.git']
        }
      },
      test: {
        coverage: {
          tools: 'tarpaulin',
          outputDir: 'coverage'
        },
        reportFormats: ['html', 'lcov']
      },
      prod: {
        optimization: {
          stripSymbols: true,
          minifyBinary: true
        },
        hardening: {
          nonRootUser: true,
          readOnlyFS: true,
          capabilities: ['CAP_NET_BIND_SERVICE']
        }
      }
    },
    dependencies: {
      system: {
        packages: [
          { name: 'libssl-dev', version: '1.1.1f' },
          { name: 'libclang-dev', version: '12.0' },
          { name: 'build-essential', version: '12.8' }
        ],
        services: [
          { name: 'docker', enabled: true },
          { name: 'ssh', enabled: false }
        ],
        libraries: [
          { name: 'libc6', version: '2.31' },
          { name: 'libstdc++6', version: '10.3.0' }
        ]
      },
      language: {
        rust: {
          crates: [
            { name: 'tokio', version: '1.28', features: ['full'] },
            { name: 'serde', version: '1.0', features: ['derive'] }
          ],
          features: ['async-std', 'tokio'],
          toolchain: ['rust-src', 'clippy']
        }
      },
      tools: {
        binaries: [
          { name: 'cargo-watch', version: '8.4.0' },
          { name: 'cargo-edit', version: '0.11.0' }
        ],
        plugins: [
          { name: 'rust-analyzer', version: '0.3.0' }
        ]
      }
    },
    variables: {
      'RUST_BACKTRACE': '1',
      'RUST_LOG': 'debug',
      'CARGO_TERM_COLOR': 'always'
    }
  },
  Runtime: {
    ports: [
      {
        host: 8080,
        container: 8080,
        protocol: 'tcp',
        name: 'http',
        description: 'HTTP API'
      },
      {
        host: 3000,
        container: 3000,
        protocol: 'tcp',
        name: 'dev',
        description: 'Development Server'
      }
    ],
    orchestration: {
      network: {
        mode: 'bridge',
        ports: [
          { host: 8080, container: 8080, protocol: 'tcp' }
        ],
        dns: {
          servers: ['8.8.8.8', '114.114.114.114']
        }
      },
      resources: {
        cpu: {
          shares: 1024,
          quota: '200ms'
        },
        memory: {
          limit: '2Gi',
          swap: '1Gi'
        }
      },
      volumes: [
        {
          source: './src',
          target: '/workspace/src',
          type: 'bind'
        }
      ]
    },
    security: {
      isolation: {
        seccompProfile: 'default',
        apparmorProfile: 'docker-default'
      },
      runtime: {
        readonlyRootfs: true,
        noNewPrivileges: true
      },
      capabilities: {
        add: ['CAP_NET_BIND_SERVICE'],
        drop: ['ALL']
      },
      secrets: [
        {
          name: 'ssh-key',
          mountPath: '/root/.ssh',
          mode: 0o600
        }
      ]
    },
    observability: {
      logging: {
        driver: 'json',
        options: {
          'max-size': '100m',
          'max-file': '3'
        },
        rotate: {
          maxSize: '100m',
          maxFiles: 3
        }
      },
      metrics: {
        enabled: true,
        port: 9090,
        path: '/metrics'
      },
      tracing: {
        enabled: true,
        exporter: 'jaeger',
        samplingRate: 0.1,
        contextPropagation: true
      }
    },
    health: {
      check: {
        type: 'http',
        interval: '30s',
        timeout: '10s',
        retries: 3
      },
      restart: {
        policy: 'unless-stopped',
        maxRetries: 3
      }
    }
  },
  Build: {
    stages: [
      {
        name: 'builder',
        baseImage: 'rust:1.87.0-slim',
        args: {
          'DEBIAN_FRONTEND': 'noninteractive',
          'RUST_VERSION': '1.87.0'
        },
        commands: [
          'cargo build --release',
          'cargo test'
        ],
        artifacts: {
          include: ['target/release/*'],
          exclude: ['target/debug/*']
        }
      }
    ],
    cache: {
      enabled: true,
      paths: [
        '/usr/local/cargo/registry',
        '/usr/local/cargo/git',
        'target'
      ]
    },
    optimization: {
      multiStage: true,
      layerOptimization: true
    }
  }
};

/**
 * 环境模式列表
 */
export const environmentModes = ['dev', 'test', 'prod'] as const;

/**
 * 架构类型列表
 */
export const architectures = ['x86_64', 'arm64'] as const;

/**
 * 镜像提供商列表
 */
export const imageProviders = ['official', 'custom'] as const;

/**
 * 包管理器列表
 */
export const packageManagers = ['apk', 'apt', 'yum'] as const;

/**
 * 网络模式列表
 */
export const networkModes = ['bridge', 'host', 'overlay'] as const;

/**
 * 协议类型列表
 */
export const protocols = ['tcp', 'udp'] as const;

/**
 * 存储类型列表
 */
export const volumeTypes = ['bind', 'volume', 'tmpfs'] as const;

/**
 * 日志驱动列表
 */
export const logDrivers = ['json', 'syslog', 'fluentd'] as const;

/**
 * 追踪导出器列表
 */
export const tracingExporters = ['jaeger', 'zipkin', 'otel'] as const;

/**
 * 健康检查类型列表
 */
export const healthCheckTypes = ['http', 'tcp', 'command'] as const;

/**
 * 重启策略列表
 */
export const restartPolicies = ['no', 'always', 'unless-stopped', 'on-failure'] as const;

/**
 * 工具函数: 验证端口配置
 */
export function validatePorts(ports: ContainerConfig['Runtime']['ports']): boolean {
  return ports.every(port => 
    port.host > 0 && 
    port.host < 65536 && 
    port.container > 0 && 
    port.container < 65536
  );
}

/**
 * 工具函数: 验证资源限制
 */
export function validateResources(resources: ContainerConfig['Runtime']['orchestration']['resources']): boolean {
  const memoryLimit = parseInt(resources.memory.limit);
  const memorySwap = resources.memory.swap ? parseInt(resources.memory.swap) : 0;
  
  return (
    resources.cpu.shares > 0 &&
    memoryLimit > 0 &&
    memorySwap >= memoryLimit
  );
}

/**
 * 工具函数: 获取环境特定配置
 */
export function getEnvironmentConfig(config: ContainerConfig, mode: typeof environmentModes[number]) {
  return {
    tools: config.Environment.tools[mode],
    dependencies: config.Environment.dependencies,
    variables: config.Environment.variables
  };
}

/**
 * 工具函数: 合并配置
 */
export function mergeConfig(base: ContainerConfig, override: Partial<ContainerConfig>): ContainerConfig {
  return {
    ...base,
    ...override,
    Base: {
      ...base.Base,
      ...override.Base
    },
    Environment: {
      ...base.Environment,
      ...override.Environment
    },
    Runtime: {
      ...base.Runtime,
      ...override.Runtime
    },
    Build: {
      ...base.Build,
      ...override.Build
    }
  };
}

/**
 * 工具函数: 验证配置
 */
export function validateConfig(config: ContainerConfig): string[] {
  const errors: string[] = [];

  // 验证基础配置
  if (!config.Base.os.name) {
    errors.push('基础镜像名称不能为空');
  }

  // 验证环境配置
  if (!environmentModes.includes(config.Environment.mode)) {
    errors.push('无效的环境模式');
  }

  // 验证运行时配置
  if (!validatePorts(config.Runtime.ports)) {
    errors.push('端口配置无效');
  }

  if (!validateResources(config.Runtime.orchestration.resources)) {
    errors.push('资源限制配置无效');
  }

  return errors;
}

/**
 * 工具函数: 生成 Dockerfile
 */
export function generateDockerfile(config: ContainerConfig): string {
  const lines: string[] = [];

  // 基础镜像
  lines.push(`FROM ${config.Base.os.name}:${config.Base.os.tag}`);

  // 设置工作目录
  lines.push('WORKDIR /workspace');

  // 安装系统依赖
  if (config.Environment.dependencies.system.packages.length > 0) {
    const packages = config.Environment.dependencies.system.packages
      .map(pkg => pkg.name)
      .join(' ');
    lines.push(`RUN apt-get update && apt-get install -y ${packages}`);
  }

  // 安装 Rust 工具链
  if (config.Base.toolchain.languages.name === 'rust') {
    lines.push(`RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y`);
    lines.push('ENV PATH="/root/.cargo/bin:$PATH"');
  }

  // 复制源代码
  lines.push('COPY . .');

  // 构建命令
  if (config.Build.stages.length > 0) {
    const commands = config.Build.stages[0].commands;
    commands.forEach(cmd => lines.push(`RUN ${cmd}`));
  }

  return lines.join('\n');
}
