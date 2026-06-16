<script setup lang="ts">
const chips = ['NUMBERS', 'STROOP', 'MATH', 'WORDS']
</script>

<template>
  <div style="width:100%;height:100%;display:flex;flex-direction:column;justify-content:space-between;background:#0A0A0A;color:#FAFAFA;padding:62px 66px;font-family:sans-serif">
    <div style="display:flex;flex-direction:column">
      <div style="font-size:28px;letter-spacing:10px;color:#6C5CE7;text-transform:uppercase;font-weight:800;margin-bottom:14px">
        Active-Recall Arcade
      </div>
      <div style="font-size:152px;font-weight:900;line-height:1;letter-spacing:-3px">
        RECALL
      </div>
      <div style="font-size:33px;opacity:0.7;margin-top:18px;max-width:1010px">
        Quick brain games for memory, focus &amp; reaction — beat the clock, share the board.
      </div>
    </div>

    <div style="display:flex;gap:16px">
      <div v-for="chip in chips" :key="chip" style="background:#6C5CE7;color:#0A0A0A;padding:14px 26px;font-size:25px;letter-spacing:3px;text-transform:uppercase;font-weight:800">
        {{ chip }}
      </div>
    </div>
  </div>
</template>
