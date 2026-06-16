<script setup lang="ts">
defineProps<{ score: number, level: number }>()
</script>

<template>
  <div style="width:100%;height:100%;display:flex;flex-direction:column;justify-content:space-between;background:#0A0A0A;color:#FAFAFA;padding:80px;font-family:sans-serif">
    <div style="font-size:32px;letter-spacing:8px;color:#6C5CE7;text-transform:uppercase">
      Recall · Beat my run
    </div>
    <div style="font-size:200px;font-weight:900;line-height:0.9">
      {{ score }}
    </div>
    <div style="font-size:40px;letter-spacing:4px;text-transform:uppercase">
      Reached level {{ level }}
    </div>
  </div>
</template>
