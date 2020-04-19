class PhpAT7228 < Formula
  desc "General-purpose scripting language"
  homepage "https://www.php.net/"
  # Should only be updated if the new version is announced on the homepage, https://www.php.net/
  url "http://mirrors.sohu.com/php/php-7.2.28.tar.xz"
  sha256 "afe1863301da572dee2e0bad8014813bcced162f980ddc8ec8e41fd72263eb2d"

  bottle do
    sha256 "ddd14746138f0212dfd8d2c0944d573ce05c3ba900c2579440f7e8defa63b0c7" => :catalina
    sha256 "fcc85c9f550df021a7f505d57c43e19672940c37ef7a1f909eec2d1d13202cef" => :mojave
    sha256 "edfcefb109b356338ed324305f7317659df02bb5a8252b67a696180e75e81b1c" => :high_sierra
  end

  keg_only :versioned_formula

    depends_on "pkg-config" => :build
    depends_on "apr"
    depends_on "apr-util"
    depends_on "argon2"
    depends_on "aspell"
    depends_on "autoconf"
    depends_on "curl-openssl"
    depends_on "freetds"
    depends_on "freetype"
    depends_on "gettext"
    depends_on "glib"
    depends_on "gmp"
    depends_on "icu4c"
    depends_on "jpeg"
    depends_on "libpng"
    depends_on "libpq"
    depends_on "libsodium"
    depends_on "libzip"
    depends_on "openldap"
    depends_on "openssl@1.1"
    depends_on "sqlite"
    depends_on "tidy-html5"
    depends_on "unixodbc"
    depends_on "webp"
    depends_on "libiconv"

  patch :DATA

  def install
    if MacOS.version == :el_capitan || MacOS.version == :sierra
          ENV["SDKROOT"] = MacOS.sdk_path
        end

        system "./buildconf", "--force"

        ENV.cxx11
        # Prevent homebrew from harcoding path to sed shim in phpize script
        ENV["lt_cv_path_SED"] = "sed"

        # Each extension that is built on Mojave needs a direct reference to the
        # sdk path or it won't find the headers
        headers_path = "=#{MacOS.sdk_path_if_needed}/usr"
        args = %W[
              --prefix=#{prefix}
              --exec-prefix=#{prefix}
              --localstatedir=#{prefix}/var
              --sysconfdir=#{prefix}/conf
              --with-config-file-path=#{prefix}/conf
              --enable-bcmath
              --enable-calendar
              --enable-dba
              --enable-dtrace
              --enable-exif
              --enable-ftp
              --enable-fpm
              --enable-intl
              --enable-mbregex
              --enable-mbstring
              --enable-mysqlnd
              --enable-opcache-file
              --enable-pcntl
              --enable-phpdbg
              --enable-phpdbg-webhelper
              --enable-shmop
              --enable-soap
              --enable-sockets
              --enable-sysvmsg
              --enable-sysvsem
              --enable-sysvshm
              --enable-wddx
              --enable-zip
              --with-bz2#{headers_path}
              --with-curl=#{Formula["curl-openssl"].opt_prefix}
              --with-fpm-user=_www
              --with-fpm-group=_www
              --with-freetype-dir=#{Formula["freetype"].opt_prefix}
              --with-gd
              --with-gettext=#{Formula["gettext"].opt_prefix}
              --with-gmp=#{Formula["gmp"].opt_prefix}
              --with-iconv=#{Formula["libiconv"].opt_prefix}
              --with-icu-dir=#{Formula["icu4c"].opt_prefix}
              --with-jpeg-dir=#{Formula["jpeg"].opt_prefix}
              --with-kerberos#{headers_path}
              --with-layout=GNU
              --with-ldap=#{Formula["openldap"].opt_prefix}
              --with-ldap-sasl#{headers_path}
              --with-libxml-dir#{headers_path}
              --with-libedit#{headers_path}
              --with-libzip
              --with-mhash#{headers_path}
              --with-mysql-sock=/tmp/mysql.sock
              --with-mysqli=mysqlnd
              --with-ndbm#{headers_path}
              --with-openssl=#{Formula["openssl@1.1"].opt_prefix}
              --with-password-argon2=#{Formula["argon2"].opt_prefix}
              --with-pdo-dblib=#{Formula["freetds"].opt_prefix}
              --with-pdo-mysql=mysqlnd
              --with-pdo-odbc=unixODBC,#{Formula["unixodbc"].opt_prefix}
              --with-pdo-pgsql=#{Formula["libpq"].opt_prefix}
              --with-pdo-sqlite=#{Formula["sqlite"].opt_prefix}
              --with-pgsql=#{Formula["libpq"].opt_prefix}
              --with-pic
              --with-png-dir=#{Formula["libpng"].opt_prefix}
              --with-pspell=#{Formula["aspell"].opt_prefix}
              --with-sodium=#{Formula["libsodium"].opt_prefix}
              --with-sqlite3=#{Formula["sqlite"].opt_prefix}
              --with-tidy#{headers_path}
              --with-unixODBC=#{Formula["unixodbc"].opt_prefix}
              --with-webp-dir=#{Formula["webp"].opt_prefix}
              --with-xmlrpc
              --with-xsl#{headers_path}
              --with-zlib#{headers_path}
            ]

        libiconv_path = "#{Formula['libiconv'].opt_prefix}"
        system "./configure", *args
        system "make", "ZEND_EXTRA_LIBS='#{libiconv_path}/lib/libiconv.2.dylib'"
        ENV["MAKEFLAGS"] = "-j1"
        system "make", "install"
        phpsbin = Pathname.new("#{prefix}/sbin")
        if (phpsbin/"php-fpm.dSYM").exist? && !(phpsbin/"php-fpm").exist?
           FileUtils.ln_s phpsbin/"php-fpm.dSYM", phpsbin/"php-fpm"
        end
      end

      def caveats
         <<~EOS
              install success !!!!!!
            EOS
            Homebrew.failed = false
      end

    end
