export default {
  add: '添加',
  open: '打开',
  openHosts: '打开hosts',
  edit: '编辑',
  link: '链接',
  configFile: '配置文件',
  log: '日志',
  del: '删除',
  version: '版本',
  commonTemplates: '常用模板',
  host: '站点',
  save: '保存',
  select: '选择',
  lang: '语言',
  changeLang: '更改语言',
  setupBase: '通用',
  apachePortTips1: 'Apache各个站点和配置文件中监听的端口全部不能重复, 否则会导致apache无法启动',
  apachePortTips2: '此处设置的端口,会在站点vhost配置文件中添加端口监听,如果重复,请自行手动删除',
  attention: '注意',
  nginxRewriteTips: '此处设置Nginx的Url Rewrite, Apache请在项目文件中自行设置',
  refresh: '刷新',
  clean: '清空',
  prompt: '提示',
  delAlertTitle: '温馨提示',
  delAlertContent: '确认删除?',
  confirm: '确定',
  cancel: '取消',
  service: '服务',
  versionSwitch: '版本切换',
  versionManager: '版本管理',
  error: '错误',
  running: '运行',
  errorLog: '错误日志',
  runLog: '运行日志',
  loadDefault: '加载默认',
  switch: '切换',
  isInstalled: '是否安装',
  install: '安装',
  uninstall: '卸载',
  currentVersionLib: '当前版本库',
  slowLog: '慢日志',
  extend: '扩展',
  httpServerTips: '将文件夹拖到此处,或点击选择文件夹',
  path: '路径',
  generate: '生成',
  fileInfoTips: '将文件拖到此处,或点击选择文件',
  cleanSelect: '清除选择',
  cleanAll: '清除全部',
  showItem: '显示项目',
  brewSrcSwitch: 'Brew源切换',
  githubFixTitle: '修复Github访问问题',
  tryToFix: '尝试修复',
  useProxy: '使用代理',
  proxySetting: '代理设置',
  quickSetup: '快速设置',
  currentProxy: '当前代理',
  resetPassword: '重设电脑密码',
  customVersionDir: '自定义版本路径',
  customVersionDirTips: '自定义版本路径, 会自动在此路径的bin&sbin目录下, 查找可执行文件',
  inputPassword: '请输入电脑用户密码',
  inputPasswordDesc:
    'PhpWebStudy需要电脑密码来完成以下事情\n\n' +
    '1. Nginx/Apache/Caddy以80和443端口启动\n\n' +
    'MacOS中, 使用小于1024的端口, 必须用sudo命令, 否则无法使用. http和https的默认端口是80和443. 如果不想使用域名访问站点还要携带端口号, 那么nginx/apache/caddy就必须以sudo的形式启动\n\n' +
    '2. MacPorts中软件的安装和卸载\n\n' +
    'MacPorts安装和卸载软件, 必须使用sudo\n\n' +
    '3. MacPorts安装的软件的配置文件的读写\n\n' +
    'MacPorts安装的软件, 里面的文件的读取和写入是需要使用sudu的. 例如php的php.ini配置文件\n\n' +
    '4. DNS服务器\n\n' +
    'DNS服务器默认使用53端口, 因为小于1024, 所以也必须使用sudo命令启动\n\n' +
    '这些都是系统的硬性限制, 所有同类型的应用, 都会询问用户的许可, PhpWebStudy和其他应用并没有什么不同',
  passwordError: '密码错误,请重新输入',
  defaultConFileNoFound: '未找到默认配置文件',
  linkCopySuccess: '链接已复制到剪贴板',
  portNotUsed: '此端口未被占用',
  needSelectVersion: '请先选择版本',
  hostNoRole: 'hosts文件权限不正确',
  hostsSaveFailed: '系统Hosts保存失败, 请查看文件是否存在, 文件权限是否正确',
  hostsReadFailed: '/etc/hosts 文件读取失败, 请查看文件是否存在, 文件权限是否正确',
  needSelectDir: '请选择文件夹!',
  processNoFound: '未查询到相关进程',
  nvmInstallfailed: 'NVM安装失败',
  nodeVersionNoFound: 'Node可用版本获取失败',
  default: '默认',
  copy: '复制',
  hostsTitle: '系统Hosts',
  phpVersion: 'PHP版本',
  selectPhpVersion: '请选择PHP版本',
  siteLinks: '站点链接',
  vhostConTitle: 'Vhost配置文件',
  currentVersion: '当前版本',
  noVersionTips: '请先在版本管理中安装版本, 然后在切换版本中选择使用版本',
  currentStatus: '当前状态',
  runningStatus: '运行中',
  noRunningStatus: '未运行',
  serviceStop: '停止',
  serviceStart: '启动',
  serviceReStart: '重启',
  serviceReLoad: '重载配置',
  gettingVersion: '可用版本获取中...',
  brewLibrary: '库',
  about: '关于我们',
  success: '操作成功',
  fail: '操作失败',
  configNoFound: '未找到配置文件, 请重新选择版本',
  noLogs: '当前无日志',
  none: '无',
  noFoundLogFile: '日志文件不存在',
  selectVersion: '选择版本',
  installed: '已安装',
  nvmNoInstallTips: 'NodeJS 版本本管理工具 nvm 未安装，现在安装？',
  nvmDirNoFound: 'NVM_DIR未找到',
  installingNVM: 'NVM安装中...',
  switching: '切换中...',
  name: '名称',
  type: '类型',
  status: '状态',
  operation: '操作',
  copyLink: '复制链接',
  copySuccess: '已复制到剪贴板',
  killProcessConfim: '确认结束所选进程?',
  killAllProcessConfim: '确认结束全部进程?',
  portNotUse: '此端口未被占用',
  sslMakeAlert:
    'SSL自签名证书生成成功,请在打开的钥匙串中,找到Dev Root CA {caFileName},并修改为"始终信任"该证书',
  second: '秒',
  millisecond: '毫秒',
  loadCustom: '加载自定义',
  saveCustom: '保存自定义',
  versionError: '版本获取失败',
  versionErrorTips:
    '版本已安装, 但是有错误导致无法运行, 此问题基本都是软件依赖项缺失或者依赖项版本不正确, 可尝试运行命令"brew update && brew upgrade"修复',
  fileBigErr: '文件过大, 请选择正确的配置文件',
  CustomVersionDir: '自定义版本路径',
  hostParseErr: '站点加载失败, 原站点数据已备份至host.back.json, 请在打开的文件夹中查看修复文件',
  export: '导出',
  import: '导入',
  autoUpdate: '自动更新',
  loading: '加载中...',
  parkTitle: '子站',
  parkTips: '和Valet park功能类似, 自动检索子文件夹, 并生成域名为: 文件夹名.当前域名 的子站点',
  parkConfim: '此操作会自动搜索子文件夹并生成子网站, 是否继续?',
  hostsWriteTips: '是否写入/etc/hosts, 写入的内容会被自定义标签包裹, 不会对其他内容造成影响',
  brewInstallLang: '',
  ftpDirNotExists: '文件夹不存在，请重新选择',
  editorSetup: '编辑器设置',

  group: '群组',

  leftHosts: '站点',
  leftTools: '工具箱',
  leftSetup: '设置',

  theme: '主题',
  themeDark: '暗色',
  themeLight: '亮色',
  themeAuto: '系统'
}
