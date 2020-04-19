#!/bin/bash
mysqlpath=$1
oldpass=$2
if [[ $mysqlpath == *5.5.62* ]]
then
  expired=""
else
  expired="--connect-expired-password"
fi
mysql_conn="$mysqlpath/bin/mysql -P3306  -uroot $expired --password=$oldpass"
NEWPASS="root"
$mysql_conn  -e  "set global validate_password_policy=0;"
$mysql_conn  -e  "set global validate_password_length=4;"
$mysql_conn  -e  "set global validate_password.policy=0;"
$mysql_conn  -e  "set global validate_password.length=4;"
$mysql_conn  -e  "SET PASSWORD FOR 'root'@'localhost' = PASSWORD('$NEWPASS');"
$mysql_conn  -e  "alter user 'root'@'localhost'IDENTIFIED WITH mysql_native_password BY '$NEWPASS' PASSWORD EXPIRE NEVER;"
$mysql_conn  -e  "flush privileges;"
echo "初始化密码成功,root用户密码已设置为root"
exit 0
