<script setup lang="ts">
const chips = ['NUMBERS', 'STROOP', 'MATH', 'WORDS']
</script>

<template>
  <div style="width:100%;height:100%;display:flex;flex-direction:column;justify-content:space-between;background:#0A0A0A;color:#FAFAFA;padding:84px;font-family:sans-serif;position:relative">
    <!-- giant faint number motif -->
    <div style="position:absolute;top:-60px;right:-20px;font-size:520px;font-weight:900;color:#6C5CE7;opacity:0.10;line-height:1">
      48192
    </div>

    <div style="display:flex;flex-direction:column;gap:26px;position:relative">
      <div style="font-size:34px;letter-spacing:12px;color:#6C5CE7;text-transform:uppercase;font-weight:800">
        Active-Recall Arcade
      </div>
      <div style="font-size:230px;font-weight:900;line-height:0.86;letter-spacing:-4px">
        RECALL
      </div>
      <div style="font-size:42px;opacity:0.72;max-width:980px;line-height:1.3">
        Fast brain games for memory, focus &amp; reaction. Beat the clock — share a link, share the leaderboard.
      </div>
    </div>

    <div style="display:flex;gap:20px;position:relative">
      <div v-for="chip in chips" :key="chip" style="border:2px solid #6C5CE7;color:#6C5CE7;padding:14px 30px;font-size:30px;letter-spacing:5px;text-transform:uppercase;font-weight:800">
        {{ chip }}
      </div>
    </div>
  </div>
</template>
