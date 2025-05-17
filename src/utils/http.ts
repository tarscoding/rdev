import { fetch } from '@tauri-apps/plugin-http';

export async function httpGetText(url: string): Promise<string> {
  const response = await fetch(url, {
    method: 'GET',
    responseType: 'text'
  } as any);
  return response.text();
}

export async function httpGetJson<T = any>(url: string): Promise<T> {
  const response = await fetch(url, {
    method: 'GET',
    responseType: 'json'
  } as any);
  return response.json();
}

export interface RustVersionOption {
  label: string;
  value: string;
}

/**
 * 解析 Rust 版本页面内容，返回下拉框选项
 */
export function parseRustVersions(content: string, query = ''): RustVersionOption[] {
  // 提取主版本
  const stableMatch = content.match(/Stable:\s*([0-9.]+)/);
  const betaMatch = content.match(/Beta:\s*([0-9.]+)/);
  const nightlyMatch = content.match(/Nightly:\s*([0-9.]+)/);
  const stable = stableMatch ? stableMatch[1] : null;
  const beta = betaMatch ? betaMatch[1] : null;
  const nightly = nightlyMatch ? nightlyMatch[1] : null;
  // 提取所有历史版本
  const versionMatches = content.match(/1\.\d+\.\d+/g) || [];
  const allVersions = Array.from(new Set(versionMatches));
  const filteredVersions = allVersions.filter(
    v => v !== stable && v !== beta && v !== nightly
  );
  // 组装下拉数据
  const versions: RustVersionOption[] = [
    ...(stable ? [{ label: `Stable (${stable})`, value: stable }] : []),
    ...(beta ? [{ label: `Beta (${beta})`, value: beta }] : []),
    ...(nightly ? [{ label: `Nightly (${nightly})`, value: nightly }] : []),
    ...filteredVersions.map(v => ({ label: v, value: v }))
  ];
  return query
    ? versions.filter((v) => v.value.includes(query))
    : versions;
} 