<template>
  <!-- 应用根路由出口，用于渲染当前路由对应的组件 -->
  <router-view />
</template>

<style>
/* 设置应用根容器样式，确保全屏显示 */
#app {
  width: 100%;
  height: 100vh;
}
</style>

<script>
/**
 * @description 应用根组件
 * 作为整个应用的入口组件，负责：
 * 1. 提供路由出口
 * 2. 设置全局样式
 * 3. 作为所有子组件的挂载点
 */
export default {
  name: 'App'
}
</script>
