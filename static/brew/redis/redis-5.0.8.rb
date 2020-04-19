class RedisAT508 < Formula
  desc "Persistent key-value database, with built-in net interface"
  homepage "https://redis.io/"
  url "http://download.redis.io/releases/redis-5.0.8.tar.gz"
  sha256 "f3c7eac42f433326a8d981b50dba0169fdfaf46abb23fcda2f933a7552ee4ed7"
  head "https://github.com/antirez/redis.git", :branch => "unstable"

  bottle do
    cellar :any_skip_relocation
    sha256 "6dd79cce0a271a736f17a9c0e72fd8e5288b135426f5746d25496ab5048e0059" => :catalina
    sha256 "c72def1c78f6c24c02d47de80a0b5ae5ef67640a42a38d040c503429eb02d3b1" => :mojave
    sha256 "819c9292b32c8bdc90f51a7301cb44ffba8fa97fa8cf0db0e64e6ab5b0e41b9f" => :high_sierra
  end

  def install
    # Architecture isn't detected correctly on 32bit Snow Leopard without help
    ENV["OBJARCH"] = "-arch #{MacOS.preferred_arch}"
    system "make", "install", "PREFIX=#{prefix}", "CC=#{ENV.cc}"
  end

    def caveats
      (prefix/"run").mkpath
      (prefix/"conf").mkpath
      (prefix/"db").mkpath
      (prefix/"log").mkpath
      Homebrew.failed = false
    end

end
