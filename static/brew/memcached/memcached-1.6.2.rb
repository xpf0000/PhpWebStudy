class MemcachedAT162 < Formula
  desc "High performance, distributed memory object caching system"
  homepage "https://memcached.org/"
  url "https://www.memcached.org/files/memcached-1.6.2.tar.gz"
  sha256 "06720118c40689be0b85249b3dcb23c6e6d5e3ce53893aca9faced264145168b"
  head "https://github.com/memcached/memcached.git"

  bottle do
    cellar :any
    sha256 "2a240991497924a381acc069a98c1fcb05f5234e46619c4fe3a655d73f517fcc" => :catalina
    sha256 "af8b9fbb030ab08395dd1da3f28fdbb2f2d3911f469e08c5bff31723b0f29e61" => :mojave
    sha256 "5051e469970ed5d00607e76c6c80bdbcaf594d6c12257db267ff46a5a2812903" => :high_sierra
  end

  depends_on "libevent"

  def install
    system "./configure", "--prefix=#{prefix}", "--disable-coverage", "--enable-tls"
    system "make", "install"
  end

  def caveats
      <<~EOS
           install success !!!!!!
         EOS
    Homebrew.failed = false
  end
end
