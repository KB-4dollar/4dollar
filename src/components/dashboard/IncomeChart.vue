<script setup>
// import
import { computed } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import VChart from 'vue-echarts';

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent]);

// reactive state
// TODO: 서버 연동 시 수입 태그 통계 데이터로 교체
const dummyIncomeTags = [
  { value: 2000000, name: '#월급' },
  { value: 300000, name: '#용돈' },
  { value: 200000, name: '#중고거래' }
];

// computed
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
        name: '수입 태그',
        type: 'pie',
        radius: ['45%', '70%'],
        // 수입 차트는 오렌지(--accent-ui) 계열로 통일감을 줌
        color: ['#ee8567', '#f4a28c', '#f9c0b1'], 
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
        data: dummyIncomeTags
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