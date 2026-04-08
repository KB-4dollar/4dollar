<script setup>
// 1. import
import { computed } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
// 🚫 페이지네이션(Legend) 관련 ECharts 모듈은 이제 필요 없으므로 제거했습니다.
import { TitleComponent, TooltipComponent } from 'echarts/components';
import VChart from 'vue-echarts';

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent]);

// 4. reactive state
// 💡 범례 박스에 색상을 칠하기 위해 color 속성을 데이터에 추가했습니다.
const dummyExpenseCategories = [
  { value: 500000, name: '식비', color: '#243047' },
  { value: 300000, name: '교통', color: '#3b4a6b' },
  { value: 250000, name: '문화생활', color: '#576a8f' },
  { value: 150000, name: '생활용품', color: '#778db3' },
  { value: 100000, name: '병원/건강', color: '#9baec8' } // 스크롤 테스트용 더미
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
    // 🚫 legend 속성 완전 삭제 (HTML 범례로 대체)
    series: [
      {
        name: '지출 카테고리',
        type: 'pie',
        // ✅ 차트 위치와 크기는 작성해주신 상태 그대로 100% 유지!
        center: ['45%', '50%'], 
        radius: ['40%', '65%'],
        avoidLabelOverlap: true,
        // 데이터에 선언한 색상을 차트에 자동 맵핑
        color: dummyExpenseCategories.map(item => item.color),
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
          // 범례 쪽에 색상표가 있으므로 dot(●) 제거
          formatter: '{name|{b}}\n{percent|{d}%}', 
          rich: {
            name: {
              fontSize: 12,
              fontWeight: 'bold',
              color: '#111827',
              padding: [0, 0, 4, 0]
            },
            percent: {
              fontSize: 11,
              color: '#6b7280',
              backgroundColor: '#f3f4f6',
              borderRadius: 4,
              padding: [3, 4, 3, 4]
            }
          }
        },
        labelLine: {
          show: true,
          smooth: 0.2,
          length: 10,
          length2: 15,
          lineStyle: {
            width: 2,
            type: 'dashed',
            color: '#d1d5db'
          }
        },
        
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
  <div class="relative h-full w-full">
    <v-chart class="h-full w-full" :option="chartOption" autoresize />

    <div class="custom-scrollbar absolute right-0 top-0 flex max-h-[85px] w-[90px] flex-col gap-2.5 overflow-y-auto rounded-md border border-line bg-surface p-2.5 shadow-sm">
      
      <div 
        v-for="item in dummyExpenseCategories" 
        :key="item.name"
        class="flex items-center gap-2"
      >
        <span class="h-2.5 w-2.5 shrink-0 rounded-full" :style="{ backgroundColor: item.color }"></span>
        <span class="truncate text-xs font-medium text-text-secondary">{{ item.name }}</span>
      </div>

    </div>
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