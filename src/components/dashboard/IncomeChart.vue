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

// 수입 차트 전용 컬러 팔레트 (포인트 컬러: --accent-ui 계열)
const INCOME_COLORS = ['#ee8567', '#f4a28c', '#f9c0b1', '#fbc5b9', '#fdd8d0'];

const chartData = computed(() => {
  // 지출(expenseByCategory) 대신 수입(incomeByTag) 객체 사용
  const tagsObj = props.stats?.breakdown?.incomeByTag || {};
  const categories = Object.keys(tagsObj).map(key => ({ name: key, value: tagsObj[key] }));

  return categories
    .sort((a, b) => b.value - a.value)
    .map((item, index) => ({
      ...item,
      color: INCOME_COLORS[index % INCOME_COLORS.length]
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
        name: '수입 카테고리',
        type: 'pie',
        // 중앙 텍스트가 잘 보이도록 차트 위치를 가운데로 조금 조정
        center: ['40%', '55%'], 
        // ✨ 지출 차트와 동일하게 도넛 안쪽/바깥쪽 반지름 설정
        radius: ['40%', '75%'], 
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
        // ✨ 마우스 호버(또는 강제 하이라이트) 시 설정 (스케일 20 적용)
        emphasis: {
          scale: true,
          scaleSize: 20, 
          label: {
            show: true, 
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
      <span class="mb-2 text-2xl">💸</span>
      이번 달 수입 내역이 없습니다.
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