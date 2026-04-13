<script setup>
import { computed, ref, watch, nextTick } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent } from 'echarts/components';
import VChart from 'vue-echarts';

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent]);

const props = defineProps({
  stats: {
    type: Object,
    default: () => ({})
  }
});

const EXPENSE_COLORS = ['#243047', '#3b4a6b', '#576a8f', '#778db3', '#9baec8', '#bdcce0'];

const chartData = computed(() => {
  const categoryObj = props.stats?.breakdown?.expenseByCategory || {};
  const categories = Object.keys(categoryObj).map(key => ({ name: key, value: categoryObj[key] }));

  return categories
    .sort((a, b) => b.value - a.value)
    .map((item, index) => ({
      ...item,
      color: EXPENSE_COLORS[index % EXPENSE_COLORS.length]
    }))
    .filter(item => item.value > 0);
});

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
        // 중앙 텍스트가 잘 보이도록 차트 위치를 가운데로 조금 조정
        center: ['40%', '55%'], 
        // ✨ 도넛 모양을 만들기 위해 안쪽 반지름(50%)을 넓게 설정
        radius: ['40%', '75%'], 
        // ✨ 중앙에 텍스트를 띄울 것이므로 오버랩 방지 기능 끄기
        avoidLabelOverlap: false, 
        color: chartData.value.map(item => item.color), 
        itemStyle: {
          borderRadius: 2,
          borderWidth: 0,
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.1)',
          shadowOffsetX: 2,
          shadowOffsetY: 4
        },
        // ✨ 기본 상태에서는 텍스트 숨기기
        label: {
          show: false,
          position: 'center'
        },
        // ✨ 마우스 호버(또는 강제 하이라이트) 시 설정
        emphasis: {
          scale: true,
          scaleSize: 20, // 튀어나오는 크기
          label: {
            show: true, // 강조될 때만 중앙 텍스트 표시
            formatter: (params) => {
              const formattedMoney = formatCurrency(params.value);
              return `{name|${params.name}}\n{value|${formattedMoney}원}`;
            },
            rich: {
              name: { fontSize: 13, color: '#6b7280', padding: [0, 0, 6, 0] },
              value: { fontSize: 18, fontWeight: 'bold', color: '#111827' }
            }
          }
        },
        labelLine: {
          show: false
        },
        data: chartData.value 
      }
    ]
  };
});

// ==========================================
// 💡 [인터랙션 로직] 1위 항목 자동 강조
// ==========================================
const chartRef = ref(null);

const highlightLargest = () => {
  if (!chartRef.value || chartData.value.length === 0) return;
  chartRef.value.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: 0 });
};

const downplayLargest = () => {
  if (!chartRef.value || chartData.value.length === 0) return;
  chartRef.value.dispatchAction({ type: 'downplay', seriesIndex: 0, dataIndex: 0 });
};

watch(
  () => chartData.value,
  async (newData) => {
    if (newData.length > 0) {
      await nextTick();
      setTimeout(() => { highlightLargest(); }, 300);
    }
  },
  { immediate: true, deep: true }
);

function onChartMouseOver(params) {
  if (params.dataIndex !== 0) { downplayLargest(); }
}

function onChartMouseOut() {
  highlightLargest();
}

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
      <v-chart
        ref="chartRef"
        class="h-full w-full"
        :option="chartOption"
        autoresize
        @mouseover="onChartMouseOver"
        @mouseout="onChartMouseOut"
      />

      <div class="custom-scrollbar absolute right-0 top-0 flex max-h-[110px] w-[90px] flex-col gap-2.5 overflow-y-auto rounded-md border border-line bg-surface p-2.5 shadow-sm">
        <div v-for="item in chartData" :key="item.name" class="flex items-center gap-2">
          <span class="h-2.5 w-2.5 shrink-0 rounded-full" :style="{ backgroundColor: item.color }"></span>
          <span class="truncate text-xs font-medium text-text-secondary">{{ item.name }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
</style>