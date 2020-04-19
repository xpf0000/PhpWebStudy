class RedisAT3213 < Formula
  desc "Persistent key-value database, with built-in net interface"
  homepage "https://redis.io/"
  url "http://download.redis.io/releases/redis-3.2.13.tar.gz"
  sha256 "862979c9853fdb1d275d9eb9077f34621596fec1843e3e7f2e2f09ce09a387ba"

  bottle do
    cellar :any_skip_relocation
    sha256 "3c733f90aa40d633ae75fa3e8deff1610de771c5ac145217fa083c4eaf5ab73f" => :catalina
    sha256 "fd4bab827397fe1f84add898e38a2d12e3fd0b51027a4c84b89957cebce4ed37" => :mojave
    sha256 "480fac35b3024d2ab0a77ace18b56f70ff1e7f34e11570dbdd4fcf8bc00927cd" => :high_sierra
    sha256 "7d820929a7f4c0e2c7d7a7a5dadfc549ed4df306ef89f6e80c65148b8bb21504" => :sierra
  end

  keg_only :versioned_formula

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
