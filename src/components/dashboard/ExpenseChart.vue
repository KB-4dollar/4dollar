<script setup>
import { computed } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent } from 'echarts/components';
import VChart from 'vue-echarts';

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent]);

// ✨ 부모로부터 실제 통계 데이터를 받음
const props = defineProps({
  stats: {
    type: Object,
    default: () => ({})
  }
});

// 지출 차트 전용 컬러 팔레트 (네이비 계열)
const EXPENSE_COLORS = ['#243047', '#3b4a6b', '#576a8f', '#778db3', '#9baec8', '#bdcce0'];

// 객체를 배열로 변환하고 색상 매핑
const chartData = computed(() => {
  const categoryObj = props.stats?.breakdown?.expenseByCategory || {};

  const categories = Object.keys(categoryObj).map(key => ({
    name: key,
    value: categoryObj[key]
  }));

  return categories
    .sort((a, b) => b.value - a.value)
    .map((item, index) => ({
      ...item,
      color: EXPENSE_COLORS[index % EXPENSE_COLORS.length]
    }))
    .filter(item => item.value > 0);
});

// 차트 옵션 세팅
const chartOption = computed(() => {
  return {
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const formattedMoney = formatCurrency(params.value);
        return `${params.name}: <strong>${formattedMoney}원</strong> (${params.percent}%)`;
      }
    },
    series: [
      {
        name: '지출 카테고리',
        type: 'pie',
        center: ['45%', '50%'], // 수입 차트와 동일한 비율 적용
        radius: ['40%', '65%'],
        avoidLabelOverlap: true,
        // ✨ 여기서 계산된 chartData 사용
        color: chartData.value.map(item => item.color), 
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
          formatter: '{name|{b}}\n{percent|{d}%}', 
          rich: {
            name: { fontSize: 12, fontWeight: 'bold', color: '#111827', padding: [0, 0, 4, 0] },
            percent: { fontSize: 11, color: '#6b7280', backgroundColor: '#f3f4f6', borderRadius: 4, padding: [3, 4, 3, 4] }
          }
        },
        labelLine: {
          show: true,
          smooth: 0.2,
          length: 10,
          length2: 5, 
          lineStyle: { width: 2, type: 'dashed', color: '#d1d5db' }
        },
        // ✨ 여기서 계산된 chartData 사용
        data: chartData.value 
      }
    ]
  };
});

function formatCurrency(value) {
  return new Intl.NumberFormat('ko-KR').format(Math.abs(value || 0));
}
</script>

<template>
  <div class="relative h-full w-full">
    <div v-if="chartData.length === 0" class="flex h-full w-full flex-col items-center justify-center text-sm text-text-muted">
      <span class="mb-2 text-2xl">💳</span>
      이번 달 지출 내역이 없습니다.
    </div>

    <template v-else>
      <v-chart class="h-full w-full" :option="chartOption" autoresize />

      <div class="custom-scrollbar absolute right-0 top-0 flex max-h-[140px] w-[110px] flex-col gap-2.5 overflow-y-auto rounded-md border border-line bg-surface p-2.5 shadow-sm">
        
        <div 
          v-for="item in chartData" 
          :key="item.name"
          class="flex items-center gap-2"
        >
          <span class="h-2.5 w-2.5 shrink-0 rounded-full" :style="{ backgroundColor: item.color }"></span>
          <span class="truncate text-xs font-medium text-text-secondary">{{ item.name }}</span>
        </div>

      </div>
    </template>
  </div>
</template>

<style scoped>
/* 얇고 예쁜 웹킷 커스텀 스크롤바 */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d5db; /* 연한 회색 */
  border-radius: 4px;
}
</style>