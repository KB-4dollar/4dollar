<script setup>
// import
import { computed } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent, LegendScrollComponent } from 'echarts/components'; 
import VChart from 'vue-echarts';

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent, LegendScrollComponent]);

// ✨ 부모(DashboardPage)에서 넘겨준 실제 통계 데이터를 받습니다.
const props = defineProps({
  stats: {
    type: Object,
    default: () => ({})
  }
});

// computed
const chartOption = computed(() => {
  // ✨ 더미 데이터를 지우고, store에서 계산되어 넘어온 실제 데이터를 꺼냅니다.
  // 데이터가 없거나 로딩 중일 때 에러가 나지 않도록 `|| 0` 으로 방어 로직을 짭니다.
  const income = props.stats?.totals?.income || 0;
  const expense = props.stats?.totals?.expense || 0;

  return {
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const formattedMoney = formatCurrency(params.value);
        return `${params.name}: <strong>${formattedMoney}원</strong> (${params.percent}%)`;
      }
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: '0%',
      top: '0%',
      itemGap: 12,
      textStyle: { color: '#6b7280', fontSize: 12 },
      pageIconColor: '#ee8567',
      pageTextStyle: { color: '#6b7280' }
    },
    series: [
      {
        name: '재정 현황',
        type: 'pie',
        center: ['45%', '50%'],
        radius: ['40%', '65%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#ffffff',
          borderWidth: 4,
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.1)',
          shadowOffsetX: 2,
          shadowOffsetY: 4
        },
        label: {
          show: true,
          formatter: '{dot|●} {name|{b}}\n{percent|{d}%}', 
          rich: {
            dot: { color: 'inherit', fontSize: 12, padding: [0, 4, 0, 0] },
            name: { fontSize: 12, fontWeight: 'bold', color: '#111827' },
            percent: { fontSize: 11, color: '#6b7280', backgroundColor: '#f3f4f6', borderRadius: 4, align: 'left', padding: [3, 0, 0, 16] }
          }
        },
        labelLine: {
          show: true,
          smooth: 0.2,
          length: 10,
          length2: 15,
          lineStyle: { width: 2, type: 'dashed', color: '#d1d5db' }
        },
        // ✨ 실제 데이터 변수(income, expense)를 매핑합니다!
        data: [
          { value: income, name: '총 수입', itemStyle: { color: '#ee8567' } },
          { value: expense, name: '총 지출', itemStyle: { color: '#243047' } }
        ]
      }
    ]
  };
});

// functions
function formatCurrency(value) {
  return new Intl.NumberFormat('ko-KR').format(Math.abs(value || 0));
}
</script>

<template>
  <v-chart class="h-full w-full" :option="chartOption" autoresize />
</template>