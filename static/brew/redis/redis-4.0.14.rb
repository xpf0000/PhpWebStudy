class RedisAT4014 < Formula
  desc "Persistent key-value database, with built-in net interface"
  homepage "https://redis.io/"
  url "https://github.com/antirez/redis/archive/4.0.14.tar.gz"
  sha256 "3b8c6ea4c9db944fe6ec427c1b11d912ca6c5c5e17ee4cfaea98bbda90724752"

  bottle do
    cellar :any_skip_relocation
    sha256 "2e9a2c7da7676cca21b9ece9ccdb8576d17060d7aa5e6829127407b4629f22e3" => :catalina
    sha256 "afe26b0f773f004d2bb0a5fa60970d6f9143fe7aab0d604a2e2e453fbdf70d3f" => :mojave
    sha256 "0fa9ceef9985e487714b8ec356c45d77ac1856e99d8a87cef405439ef4939cde" => :high_sierra
    sha256 "537fe6969d900f34df0e072e7f90e43ca85c665f95952b7dea196691e3955592" => :sierra
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
