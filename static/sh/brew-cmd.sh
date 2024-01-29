#!/bin/zsh
if [ -f "~/.bash_profile" ]; then
  source ~/.bash_profile
fi
if [ -f "~/.zshrc" ]; then
  source ~/.zshrc
fi
arch=$1
action=$2
name=$3
echo "$arch brew $action --verbose $name"
arch $arch brew $action --verbose $name
