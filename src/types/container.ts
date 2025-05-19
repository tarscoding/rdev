/**
 * 容器配置主接口
 * 包含基础配置、构建配置、开发配置、测试配置、生产配置和共享配置
 */
export interface ContainerConfig {
  Base: BaseContainerConfig;
  Build: BuildContainerConfig;
  Dev: DevContainerConfig;
  Test: TestContainerConfig;
  Prod: ProdContainerConfig;
  Shared: SharedConfig;
}

/**
 * 基础容器配置
 * 定义所有容器共享的基础依赖和工具链
 */
export interface BaseContainerConfig {
  os: string;                    // 操作系统类型，如 ubuntu、alpine
  version: string;               // 操作系统版本，如 20.04、3.18
  rust_version: string;          // Rust 版本，如 1.70.0
  rust_dependencies: Record<string, string>;  // Rust 基础依赖包
  toolchains: Record<string, string>;        // 基础工具链，如 gcc、clang
}

/**
 * 构建阶段配置
 * 用于多阶段构建中的构建阶段
 */
export interface BuildContainerConfig {
  baseImage: string;             // 构建阶段基础镜像
  buildDependencies: Record<string, string>;  // 构建依赖包
  buildCommand: string;          // 构建命令
  buildArgs: Record<string, string>;         // 构建参数
  buildOutput: string;           // 构建产物输出路径
  cache: boolean;                // 是否启用构建缓存
}

/**
 * 开发环境配置
 * 包含开发所需的工具、插件和配置
 */
export interface DevContainerConfig {
  devDependencies: Record<string, string>;   // 开发依赖包
  plugins: string[];                         // 开发插件列表
  terminalTools: string[];                   // 终端工具，如 zsh、git
  rustFeatures: string[];                    // Rust 编译特性
  ports: Record<string, string>;             // 端口映射
  environment: Record<string, string>;       // 环境变量
  entrypoint: string;                        // 容器入口点
  command: string;                           // 容器启动命令
  imageName: string;                         // 镜像名称
  containerName: string;                     // 容器名称
}

/**
 * 测试环境配置
 * 包含测试相关的配置和工具
 */
export interface TestContainerConfig {
  testDependencies: Record<string, string>;  // 测试依赖包
  testCommand: string;                       // 测试命令
  testEntrypoint: string;                    // 测试入口点
  testImageName: string;                     // 测试镜像名称
  testContainerName: string;                 // 测试容器名称
}

/**
 * 生产环境配置
 * 包含生产环境所需的配置
 */
export interface ProdContainerConfig {
  prodDependencies: Record<string, string>;  // 生产依赖包
  prodCommand: string;                       // 生产环境命令
  prodEntrypoint: string;                    // 生产环境入口点
  prodImageName: string;                     // 生产镜像名称
  prodContainerName: string;                 // 生产容器名称
}

/**
 * 共享配置
 * 所有容器共享的运行时配置
 */
export interface SharedConfig {
  networkMode: string;          // 网络模式，如 bridge、host
  restartPolicy: string;        // 重启策略，如 always、on-failure
  user: string;                 // 运行用户
  workingDir: string;           // 工作目录
  healthcheck: HealthcheckConfig;  // 健康检查配置
}

/**
 * 健康检查配置
 * 用于容器健康状态监控
 */
export interface HealthcheckConfig {
  command: string;              // 健康检查命令
  interval: string;             // 检查间隔，如 30s
  timeout: string;              // 超时时间，如 10s
  retries: number;              // 重试次数
}

