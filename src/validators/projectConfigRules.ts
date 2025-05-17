export const projectConfigRules = {
  name: [
    { required: true, message: "请输入项目名称", trigger: 'blur' },
    { min: 2, max: 50, message: "项目名称长度应在2-50个字符之间", trigger: 'blur' }
  ],
  description: [
    { required: true, message: "请输入项目描述", trigger: 'blur' },
    { max: 200, message: "项目描述不建议超过200个字符", trigger: 'blur' }
  ],
  version: [
    { required: true, message: "请输入项目版本号", trigger: 'blur' },
    { pattern: /^\d+\.\d+\.\d+$/, message: "版本号格式应为 x.x.x", trigger: 'blur' }
  ],
};

const localPathRules = {
  localPath: [
    { required: true, message: "请选择本地路径", trigger: 'change' },
  ]
};

const remotRepoRules = {
  remoteRepo: [
    { required: true, message: "请输入远程仓库地址", trigger: 'blur' },
    { pattern: /^(https?:\/\/|git@).*\.git$/, message: '请输入有效的Git仓库地址', trigger: 'blur' }
  ]
};

export const getProjectConfigRules = (repoType: 'local' | 'remote') => {
  const baseRules = { ...projectConfigRules };
  if (repoType === 'local') {
    return {
      ...baseRules,
      ...localPathRules,
      remoteRepo: [] // 清空远程仓库的验证规则
    };
  } else {
    return {
      ...baseRules,
      ...remotRepoRules,
      localPath: [] // 清空本地路径的验证规则
    };
  }
};

