#!/bin/zsh
#HomeBrew自动安装脚本
#cunkai.wang@foxmail.com
#路径表.
HOMEBREW_PREFIX="/usr/local"
HOMEBREW_REPOSITORY="${HOMEBREW_PREFIX}/Homebrew"
HOMEBREW_CACHE="${HOME}/Library/Caches/Homebrew"

STAT="stat -f"
CHOWN="/usr/sbin/chown"
CHGRP="/usr/bin/chgrp"
GROUP="admin"

#获取前面两个.的数据
major_minor() {
  echo "${1%%.*}.$(x="${1#*.}"; echo "${x%%.*}")"
}

#获取系统版本
macos_version="$(major_minor "$(/usr/bin/sw_vers -productVersion)")"
#获取系统时间
TIME=$(date "+%Y-%m-%d %H:%M:%S")

JudgeSuccess()
{
    if [ $? -ne 0 ];then
        echo '此步骤失败 '$1''
    else
        echo "此步骤成功"

    fi
}
# 判断是否有系统权限
have_sudo_access() {
  if [[ -z "${HAVE_SUDO_ACCESS-}" ]]; then
    /usr/bin/sudo -l mkdir &>/dev/null
    HAVE_SUDO_ACCESS="$?"
  fi

  if [[ "$HAVE_SUDO_ACCESS" -ne 0 ]]; then
    echo "获取权限失败!"
  fi

  return "$HAVE_SUDO_ACCESS"
}

shell_join() {
  local arg
  printf "%s" "$1"
  shift
  for arg in "$@"; do
    printf " "
    printf "%s" "${arg// /\ }"
  done
}

execute() {
  if ! "$@"; then
    abort "$(printf "Failed during: %s" "$(shell_join "$@")")"
  fi
}

# 管理员运行
execute_sudo() {
  local -a args=("$@")
  if [[ -n "${SUDO_ASKPASS-}" ]]; then
    args=("-A" "${args[@]}")
  fi
  if have_sudo_access; then
    execute "/usr/bin/sudo" "${args[@]}"
  else
    execute "${args[@]}"
  fi
}

CreateFolder()
{
    echo '-> 创建文件夹' $1
    execute_sudo "/bin/mkdir" "-p" "$1"
    JudgeSuccess
    execute_sudo "/bin/chmod" "g+rwx" "$1"
    execute_sudo "$CHOWN" "$USER" "$1"
    execute_sudo "$CHGRP" "$GROUP" "$1"
}

RmCreate()
{
    sudo rm -rf $1
    CreateFolder $1
}

#git提交
git_commit(){
    git add .
    git commit -m "your del"
}

#version_gt 判断$1是否大于$2
version_gt() {
  [[ "${1%.*}" -gt "${2%.*}" ]] || [[ "${1%.*}" -eq "${2%.*}" && "${1#*.}" -gt "${2#*.}" ]]
}
#version_ge 判断$1是否大于等于$2
version_ge() {
  [[ "${1%.*}" -gt "${2%.*}" ]] || [[ "${1%.*}" -eq "${2%.*}" && "${1#*.}" -ge "${2#*.}" ]]
}
#version_lt 判断$1是否小于$2
version_lt() {
  [[ "${1%.*}" -lt "${2%.*}" ]] || [[ "${1%.*}" -eq "${2%.*}" && "${1#*.}" -lt "${2#*.}" ]]
}

#一些警告判断
warning_if(){
  git_https_proxy=$(git config --global https.proxy)
  git_http_proxy=$(git config --global http.proxy)
  if [[ -z "$git_https_proxy"  &&  -z "$git_http_proxy" ]]; then
  echo "未发现Git代理（属于正常状态）"
  else
  echo "提示：发现你电脑设置了Git代理，如果Git报错，请运行下面两句话：
  git config --global --unset https.proxy
  git config --global --unset http.proxy"
  fi
}
echo '开始执行Brew自动安装程序'
 #HomeBrew 下载源 install
  USER_HOMEBREW_BOTTLE_DOMAIN=https://mirrors.ustc.edu.cn/homebrew-bottles
  #HomeBrew基础框架
  USER_BREW_GIT=https://mirrors.ustc.edu.cn/brew.git
  #HomeBrew Core
  USER_CORE_GIT=https://mirrors.ustc.edu.cn/homebrew-core.git
  #HomeBrew Cask
  USER_CASK_GIT=https://mirrors.ustc.edu.cn/homebrew-cask.git
echo '==> 通过命令删除之前的brew、创建一个新的Homebrew文件夹
(设置开机密码：在左上角苹果图标->系统偏好设置->用户与群组->更改密码)
(如果就是不想设置密码，自行百度mac sudo免密码)
请输入开机密码，输入过程不显示，输入完后回车'
# 让环境暂时纯粹，重启终端后恢复
export PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
RmCreate ${HOMEBREW_REPOSITORY}
echo '==> 删除之前brew环境，重新创建'
sudo rm -rf /Users/$(whoami)/Library/Caches/Homebrew/
sudo rm -rf /Users/$(whoami)/Library/Logs/Homebrew/
RmCreate ${HOMEBREW_PREFIX}/Caskroom
RmCreate ${HOMEBREW_PREFIX}/Cellar
RmCreate ${HOMEBREW_PREFIX}/var/homebrew
directories=(bin etc include lib sbin share var opt
             share/zsh share/zsh/site-functions
             var/homebrew var/homebrew/linked
             Cellar Caskroom Homebrew Frameworks)
for dir in "${directories[@]}"; do
  if ! [[ -d "${HOMEBREW_PREFIX}/${dir}" ]]; then
    CreateFolder "${HOMEBREW_PREFIX}/${dir}"
  fi
  sudo chown -R $(whoami) ${HOMEBREW_PREFIX}/${dir}
done
echo '==> 克隆Homebrew基本文件(32M+)'
sudo git --version
if [ $? -ne 0 ];then
  sudo rm -rf "/Library/Developer/CommandLineTools/"
  echo '安装Git后再运行此脚本，在系统弹窗中点击“安装”按钮
如果没有弹窗的老系统，需要自己下载安装：https://git-scm.com/downloads '
  xcode-select --install
  exit 0
fi
sudo git clone $USER_BREW_GIT ${HOMEBREW_REPOSITORY}
JudgeSuccess 尝试切换下载源或者网络
echo '==> 创建brew的替身'
find ${HOMEBREW_PREFIX}/bin -name brew -exec sudo rm -f {} \;
sudo ln -s ${HOMEBREW_PREFIX}/Homebrew/bin/brew ${HOMEBREW_PREFIX}/bin/brew
JudgeSuccess
warning_if
echo '==> 克隆Homebrew Core(224M+)
此处如果显示Password表示需要再次输入开机密码，输入完后回车'
sudo mkdir -p ${HOMEBREW_PREFIX}/Homebrew/Library/Taps/homebrew/homebrew-core
sudo git clone $USER_CORE_GIT ${HOMEBREW_PREFIX}/Homebrew/Library/Taps/homebrew/homebrew-core/
JudgeSuccess 尝试切换下载源或者网络
echo '==> 克隆Homebrew Cask(248M+) 类似AppStore
此处如果显示Password表示需要再次输入开机密码，输入完后回车'
sudo mkdir -p ${HOMEBREW_PREFIX}/Homebrew/Library/Taps/homebrew/homebrew-cask
sudo git clone $USER_CASK_GIT ${HOMEBREW_PREFIX}/Homebrew/Library/Taps/homebrew/homebrew-cask/
JudgeSuccess 尝试切换下载源或者网络
echo '==> 配置国内下载地址'
echo 'export HOMEBREW_BOTTLE_DOMAIN='${USER_HOMEBREW_BOTTLE_DOMAIN} >> ~/.zshrc
echo 'export HOMEBREW_BOTTLE_DOMAIN='${USER_HOMEBREW_BOTTLE_DOMAIN} >> ~/.bash_profile
JudgeSuccess
source ~/.zshrc
source ~/.bash_profile
echo '
==> 安装完成，brew版本
'
#判断系统版本
if version_gt "$macos_version" "10.13"; then
    echo "$macos_version"
else
    echo '检测到你的系统比较老，会有一些报错，请稍等Ruby下载安装;
    '
fi

sudo chown -R $(whoami) ${HOMEBREW_REPOSITORY}
#先暂时设置到清华大学源，中科大没有Ruby下载镜像
HOMEBREW_BOTTLE_DOMAIN=https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles
echo 'brew -v
'
brew -v
if [ $? -ne 0 ];then
    echo 'brew安装失败'
    ls -al /usr/local
    echo '--end'
    exit 0
else
    echo "Brew前期配置成功"
fi
echo '==> brew update'
HOMEBREW_BOTTLE_DOMAIN=${USER_HOMEBREW_BOTTLE_DOMAIN}
brew update
if [ $? -ne 0 ];then
    echo 'brew更新失败'
else
    echo "brew安装完成"
fi
