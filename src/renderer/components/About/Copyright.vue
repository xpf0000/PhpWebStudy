<template>
  <el-row class="copyright">
    <el-col class="copyright-left">
      <a target="_blank" href="javascropt:" rel="noopener noreferrer">
        &copy;2020 Php Web Study 250881478@qq.com
      </a>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: 'mo-copyright'
  }
</script>

<style lang="scss">
  .copyright {
    width: 100%;
    padding: 0 20px;
    font-size: $--font-size-small;
    a {
      color: $--app-copyright-color;
      text-decoration: none;
    }
  }
  .copyright-left {
    text-align: left;
  }

  .copyright-right {
    text-align: right;
    a {
      margin-left: 30px;
    }
  }
</style>
