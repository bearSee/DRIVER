<template>
  <div class="not-found">
    <div class="empty-box">
      <img src="@/assets/image/404.png">
    </div>
    <div class="operate">
      <el-button
        type="info"
        @click="$router.replace('/login')">
        返回
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
    name: 'Notfound',
};
</script>

<style lang="scss">
  .not-found {
    width: 100%;
    height: 100%;
    background: #f3f3f3;
    .empty-box {
      display: flex;
      img {
        width: 600px;
        margin: auto;
      }
    }
    .operate {
      text-align: center;
    }
  }

</style>
