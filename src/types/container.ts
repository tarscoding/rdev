export interface ContainerConfig {
  Base: BaseContainerConfig;
  Dev: DevContainerConfig;
  Test: TestContainerConfig;
  Prod: ProdContainerConfig;
}

export interface BaseContainerConfig {
  os: string;
  version: string;
  rust_version: string;
  rust_dependencies: Record<string, string>;
  toolchains: Record<string, string>;
}


export interface DevContainerConfig {
  devDependencies: Record<string, string>;
  ports: Record<string, string>;
  environment: Record<string, string>;
  entrypoint: string;
  command: string;
  imageName: string;
  containerName: string;
  networkMode: string;
  restartPolicy: string;
}


export interface TestContainerConfig {
  testDependencies: Record<string, string>;
  testCommand: string;
  testEntrypoint: string;
  testImageName: string;
  testContainerName: string;
  testNetworkMode: string;
  testRestartPolicy: string;
}


export interface ProdContainerConfig {
  prodDependencies: Record<string, string>;
  prodCommand: string;
  prodEntrypoint: string;
  prodImageName: string;
  prodContainerName: string;
  prodNetworkMode: string;
  prodRestartPolicy: string;
}

