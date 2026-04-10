<script setup>
import { computed, ref, onMounted, nextTick } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import { TooltipComponent } from 'echarts/components';
import VChart from 'vue-echarts';

use([CanvasRenderer, PieChart, TooltipComponent]);

const chartData = [
  { name: '알바', value: 800000, color: '#e26d8a' }, // 메인 (accent)
  { name: '용돈', value: 300000, color: '#f095a9' }, // 중간
  { name: '기타', value: 120000, color: '#f7c2cf' }, // 연한톤
];
const chartOption = computed(() => ({
  tooltip: {
    trigger: 'item',
  },
  series: [
    {
      type: 'pie',
      radius: ['45%', '75%'],
      center: ['50%', '50%'],
      data: chartData,
      color: chartData.map((d) => d.color),
      label: { show: false },
      emphasis: {
        scale: true,
        scaleSize: 15,
      },
    },
  ],
}));

const chartRef = ref(null);

// ✅ 자동 하이라이트
onMounted(async () => {
  await nextTick();
  setTimeout(() => {
    chartRef.value?.dispatchAction({
      type: 'highlight',
      seriesIndex: 0,
      dataIndex: 0,
    });
  }, 500);
});
</script>

<template>
  <div class="w-full h-full">
    <v-chart
      ref="chartRef"
      class="w-full h-full"
      :option="chartOption"
      autoresize
    />
  </div>
</template>
