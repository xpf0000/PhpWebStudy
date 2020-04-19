class OpensslAT102u < Formula
  desc "Cryptography and SSL/TLS Toolkit"
  homepage "https://openssl.org/"
  url "https://www.openssl.org/source/openssl-1.0.2u.tar.gz"
  mirror "https://www.mirrorservice.org/sites/ftp.openssl.org/source/openssl-1.0.2u.tar.gz"
  sha256 "ecd0c6ffb493dd06707d38b14bb4d8c2288bb7033735606569d8f90f89669d16"
  version_scheme 1

  bottle do
    sha256 "d7f992ebfd78f80828051f6dc6a1a99aed405f86b0f39ea651fd0afeadd1b0f4" => :catalina
    sha256 "104ef018b7bb8fcc49f57e5a60359a28a02d480d85a959e6141394b0571cbb28" => :mojave
    sha256 "c7681ee40cb3680cd9fafcdb092bde153b9d4903907d67858baa5f19025f927b" => :high_sierra
    sha256 "a95d756e9aa3a8d118833f9083112048bf635f20c33943de04163bdcf7412328" => :sierra
  end

  keg_only :provided_by_macos,
    "openssl/libressl is provided by macOS so don't link an incompatible version"

  # SSLv2 died with 1.1.0, so no-ssl2 no longer required.
  # SSLv3 & zlib are off by default with 1.1.0 but this may not
  # be obvious to everyone, so explicitly state it for now to
  # help debug inevitable breakage.
  def configure_args; %W[
    --prefix=#{prefix}
    no-zlib
  ]
  end

  def install
    # This could interfere with how we expect OpenSSL to build.
    ENV.delete("OPENSSL_LOCAL_CONFIG_DIR")

    # This ensures where Homebrew's Perl is needed the Cellar path isn't
    # hardcoded into OpenSSL's scripts, causing them to break every Perl update.
    # Whilst our env points to opt_bin, by default OpenSSL resolves the symlink.
    if which("perl") == Formula["perl"].opt_bin/"perl"
      ENV["PERL"] = Formula["perl"].opt_bin/"perl"
    end

    arch_args = %w[darwin64-x86_64-cc enable-ec_nistp_64_gcc_128]

    ENV.deparallelize
    system "perl", "./Configure", *(configure_args + arch_args)
    system "make"
    system "make", "install"
  end

  def caveats; <<~EOS
   install success !!!!!!
  EOS
  end

end
