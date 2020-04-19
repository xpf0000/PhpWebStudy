class ApacheAT2441 < Formula
  desc "Apache HTTP server"
  homepage "https://httpd.apache.org/"
  url "https://www.apache.org/dyn/closer.cgi?path=/httpd/httpd-2.4.41.tar.bz2"
  mirror "http://mirrors.sohu.com/apache/httpd-2.4.41.tar.bz2"
  sha256 "133d48298fe5315ae9366a0ec66282fa4040efa5d566174481077ade7d18ea40"

  bottle do
    sha256 "c532f46853817d18cfaeadecf1ec4e7b47a57b80eee3d01272aaa99a16c93bf6" => :catalina
    sha256 "9f9969abde4a61949b0279f68d6fcc616d1546dd2c1b4fd61012bde1f5d27ee8" => :mojave
    sha256 "143af690fd1f26f07e79009da6e674a0cb56c190f6fb486f9e61f82a5ab36a0a" => :high_sierra
    sha256 "9a085a0b728b5bc75bda265d7d4c5360187038eb339c43a681d789599b814dcf" => :sierra
  end

  depends_on "apr"
  depends_on "apr-util"
  depends_on "brotli"
  depends_on "nghttp2"
  depends_on "openssl@1.1"
  depends_on "pcre"
  uses_from_macos "zlib"

  def install

    # fix default user/group when running as root
    inreplace "docs/conf/httpd.conf.in", /(User|Group) daemon/, "\\1 _www"

    system "./configure", "--prefix=#{prefix}",
                          "--enable-mpms-shared=all",
                          "--enable-mods-shared=all",
                          "--enable-authnz-fcgi",
                          "--enable-cgi",
                          "--enable-pie",
                          "--enable-suexec",
                          "--with-suexec-caller=_www",
                          "--with-port=8080",
                          "--with-sslport=8443",
                          "--with-apr=#{Formula["apr"].opt_prefix}",
                          "--with-apr-util=#{Formula["apr-util"].opt_prefix}",
                          "--with-brotli=#{Formula["brotli"].opt_prefix}",
                          "--with-libxml2=#{MacOS.sdk_path_if_needed}/usr",
                          "--with-mpm=prefork",
                          "--with-nghttp2=#{Formula["nghttp2"].opt_prefix}",
                          "--with-ssl=#{Formula["openssl@1.1"].opt_prefix}",
                          "--with-pcre=#{Formula["pcre"].opt_prefix}",
                          "--with-z=#{MacOS.sdk_path_if_needed}/usr",
                          "--disable-lua",
                          "--disable-luajit"
    system "make"
    system "make", "install"

    inreplace "#{prefix}/conf/httpd.conf" do |s|
      s.gsub! "#LoadModule proxy_module", "LoadModule proxy_module"
      s.gsub! "#LoadModule proxy_fcgi_module", "LoadModule proxy_fcgi_module"
      s.gsub! "#ServerName www.example.com:8080", "ServerName localhost:8080"
      s.gsub! "ErrorLog \"logs/error_log\"", "ErrorLog \"#LOGPATH#/error_log\""
      s.gsub! "CustomLog \"logs/access_log\"", "CustomLog \"#LOGPATH#/access_log\""
    end

  end

  def caveats
    <<~EOS
         install success !!!!!!
       EOS
   Homebrew.failed = false
  end

end
