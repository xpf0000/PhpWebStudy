class NginxAT1161 < Formula
  desc "HTTP(S) server and reverse proxy, and IMAP/POP3 proxy server"
  homepage "https://nginx.org/"
  # Use "mainline" releases only (odd minor version number), not "stable"
  # See https://www.nginx.com/blog/nginx-1-12-1-13-released/ for why
  url "https://nginx.org/download/nginx-1.16.1.tar.gz"
  sha256 "f11c2a6dd1d3515736f0324857957db2de98be862461b5a542a3ac6188dbe32b"
  head "https://hg.nginx.org/nginx/", :using => :hg

  bottle do
    sha256 "7c2d457ddf56d25783b9c24b4b7235a87530cfe7dde924780c032438343b6174" => :catalina
    sha256 "67483a96fe74c3752c6a137575fa57634348b4850fb55b7b5e05b1cb5b49086a" => :mojave
    sha256 "a827db017de049e9bd303a4799070f8cfabc66d8f067d24a09e8edabe9b8b04c" => :high_sierra
  end

  depends_on "openssl@1.1"
  depends_on "pcre"

  def install
    # keep clean copy of source for compiling dynamic modules e.g. passenger
    (pkgshare/"src").mkpath
    system "tar", "-cJf", (pkgshare/"src/src.tar.xz"), "--options", "compression-level=9", "."

    openssl = Formula["openssl@1.1"]
    pcre = Formula["pcre"]

    cc_opt = "-I#{pcre.opt_include} -I#{openssl.opt_include}"
    ld_opt = "-L#{pcre.opt_lib} -L#{openssl.opt_lib}"

    args = %W[
      --prefix=#{prefix}
      --with-cc-opt=#{cc_opt}
      --with-ld-opt=#{ld_opt}
      --error-log-path=#ErrorLogPath#
      --pid-path=#PIDPath#
      --with-compat
      --with-debug
      --with-http_addition_module
      --with-http_auth_request_module
      --with-http_dav_module
      --with-http_degradation_module
      --with-http_flv_module
      --with-http_gunzip_module
      --with-http_gzip_static_module
      --with-http_mp4_module
      --with-http_random_index_module
      --with-http_realip_module
      --with-http_secure_link_module
      --with-http_slice_module
      --with-http_ssl_module
      --with-http_stub_status_module
      --with-http_sub_module
      --with-http_v2_module
      --with-ipv6
      --with-mail
      --with-mail_ssl_module
      --with-pcre
      --with-pcre-jit
      --with-stream
      --with-stream_realip_module
      --with-stream_ssl_module
      --with-stream_ssl_preread_module
    ]

    (pkgshare/"src/configure_args.txt").write args.join("\n")

    system "./configure", *args

    system "make", "install"

  end

  def caveats
    <<~EOS
      install success !!!!!!
    EOS
    Homebrew.failed = false
  end

end
