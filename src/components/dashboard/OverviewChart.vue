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
// TODO: 서버 연동 시 props로 교체할 더미 데이터
const dummyData = { income: 2500000, expense: 1200000 };

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
      itemGap: 20,
      textStyle: { color: '#6b7280', fontSize: 13 } // --text-secondary
    },
    series: [
      {
        name: '재정 현황',
        type: 'pie',
        radius: ['45%', '70%'],
        avoidLabelOverlap: true,
        label: { show: true, position: 'outside', formatter: '{d}%', color: '#111827' }, // --text-primary
        labelLine: { show: true },
        data: [
          { value: dummyData.income, name: '총 수입', itemStyle: { color: '#ee8567' } }, // --accent-ui
          { value: dummyData.expense, name: '총 지출', itemStyle: { color: '#243047' } }  // --button-dark
        ]
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