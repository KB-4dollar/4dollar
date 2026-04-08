<script setup>
// 1. import
import { computed } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import VChart from 'vue-echarts';

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent]);

// 4. reactive state
// TODO: 서버 연동 시 지출 카테고리 통계 데이터로 교체
const dummyExpenseCategories = [
  { value: 500000, name: '식비' },
  { value: 300000, name: '교통' },
  { value: 250000, name: '문화생활' },
  { value: 150000, name: '생활용품' }
];

// 5. computed
const chartOption = computed(() => {
  return {
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const formattedMoney = formatCurrency(params.value);
        return `${params.name}: <strong>${formattedMoney}원</strong> (${params.percent}%)`;
      }
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: { color: '#6b7280' } // --text-secondary
    },
    series: [
      {
        name: '지출 카테고리',
        type: 'pie',
        radius: ['45%', '70%'],
        // 지출 차트는 네이비(--button-dark) 계열로 통일감을 줌
        color: ['#243047', '#3b4a6b', '#576a8f', '#778db3'],
        itemStyle: {
          borderRadius: 10, // 모서리를 더 둥글게
          borderColor: '#ffffff', // 배경색과 똑같은 흰색으로 조각 사이를 띄움
          borderWidth: 4,     // 조각 사이 간격
          
          // ✨ 여기가 핵심! CSS의 box-shadow 효과를 ECharts 방식으로 주는 곳이야
          shadowBlur: 10,                 // 그림자가 퍼지는 정도 (CSS: blur)
          shadowColor: 'rgba(0, 0, 0, 0.1)', // 그림자 색상과 투명도
          shadowOffsetX: 2,               // X축으로 밀기
          shadowOffsetY: 4                // Y축으로 밀기 (약간 아래로 그림자가 깔림)
        },
        label: { show: true, formatter: '{b}\n{d}%', color: '#111827' },
        data: dummyExpenseCategories
      }
    ]
  };
});

// 7. functions
function formatCurrency(value) {
  return new Intl.NumberFormat('ko-KR').format(Math.abs(value || 0));
}
</script>

<template>
  <v-chart class="h-full w-full" :option="chartOption" autoresize />
</template>