export interface ProjectConfig {
  repoType: 'local' | 'remote';
  localPath?: string;
  remoteRepo?: string;
  name: string;
  description: string;
  version: string;
  author: string;
  rustVersion: string;
  nation: nation;
}

export interface nation {
  name: string;
  code: string;
  timezone: string[];
  utcOffset?: string;
}

export interface PortConfig {
  host: number;
  container: number;
  protocol: 'tcp' | 'udp';
}

export interface VolumeConfig {
  host: string;
  container: string;
  type: 'bind' | 'volume';
}

export interface DockerTemplate {
  name: string;
  description: string;
  baseImage: string;
  defaultDependencies: string[];
  defaultPorts: PortConfig[];
  defaultVolumes: VolumeConfig[];
  defaultEnvironment: Record<string, string>;
} 
