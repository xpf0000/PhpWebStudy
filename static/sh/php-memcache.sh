#!/bin/bash
cachedir=$1
phpv=$2
memcachev=$3
cd $cachedir
curl -C - -O -s http://pecl.php.net/get/memcache-$memcachev.tgz
if [ -d "memcache-$memcachev" ]; then
 rm -rf "memcache-$memcachev"
fi
if [ -f "memcache-$memcachev.tgz" ]; then
  tar -zxf memcache-$memcachev.tgz
else
  exit 1
fi
zlib=$(brew --prefix)/opt/zlib
cd "memcache-$memcachev"
cellar=$(brew --Cellar)
$cellar/php@$phpv/$phpv/bin/phpize
./configure --with-php-config=$cellar/php@$phpv/$phpv/bin/php-config --with-zlib-dir=$zlib
make
make install
