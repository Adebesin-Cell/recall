<script setup lang="ts">
defineProps<{ score: number, level: number }>()
</script>

<template>
  <div style="width:100%;height:100%;display:flex;flex-direction:column;justify-content:space-between;background:#0A0A0A;color:#FAFAFA;padding:62px 66px;font-family:sans-serif">
    <div style="display:flex;flex-direction:column">
      <div style="font-size:28px;letter-spacing:10px;color:#6C5CE7;text-transform:uppercase;font-weight:800;margin-bottom:14px">
        Recall · Beat My Run
      </div>
      <div style="font-size:172px;font-weight:900;line-height:1;letter-spacing:-3px">
        {{ score }}
      </div>
      <div style="font-size:33px;opacity:0.7;margin-top:18px">
        Reached level {{ level }} — same sequence, your turn.
      </div>
    </div>

    <div style="display:flex">
      <div style="background:#6C5CE7;color:#0A0A0A;padding:16px 30px;font-size:25px;letter-spacing:3px;text-transform:uppercase;font-weight:800">
        Play the same run →
      </div>
    </div>
  </div>
</template>
