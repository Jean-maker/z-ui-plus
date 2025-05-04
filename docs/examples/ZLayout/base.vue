<template>
  <div class="demo-layout">
    <div style="position: relative; height: 400px; width: 100%">
      <z-layout>
        <template #left> 左 </template>
        <template #right> 右 </template>
        <template #top> 上 </template>
        <template #bottom> 下 </template>
        <z-layout :left="60" :right="60">
          <template #left> 左 </template>
          <template #right> 右 </template>
          <template #top> 上 </template>
          <template #bottom> 下 </template>
          中间
        </z-layout>
      </z-layout>
    </div>
  </div>
</template>
