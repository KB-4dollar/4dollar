<script setup>
// import
import { computed } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
// ✨ ScrollComponent를 LegendScrollComponent로 변경!
import { TitleComponent, TooltipComponent, LegendComponent, LegendScrollComponent } from 'echarts/components'; 
import VChart from 'vue-echarts';

// ✨ use 배열에 LegendScrollComponent 추가
use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent, LegendScrollComponent]);

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
      type: 'scroll',      // 스크롤 가능하게 설정
      orient: 'vertical',
      right: '0%',         // 우측 상단 배치
      top: '0%',
      itemGap: 12,
      textStyle: { color: '#6b7280', fontSize: 12 },
      pageIconColor: '#ee8567', 
      pageTextStyle: { color: '#6b7280' }
    },
    series: [
      {
        name: '수입 태그',
        type: 'pie',
        center: ['45%', '50%'], // ✨ 요청하신 45% 중심 이동 적용
        radius: ['40%', '65%'],
        avoidLabelOverlap: true,
        // ✨ 수입 차트 전용 오렌지 계열 컬러 적용
        color: ['#ee8567', '#f4a28c', '#f9c0b1'], 
        itemStyle: {
          borderRadius: 10,
          borderColor: '#ffffff',
          borderWidth: 4,
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.1)',
          shadowOffsetX: 2,
          shadowOffsetY: 4
        },
        // 라벨(텍스트) 꾸미기
        label: {
          show: true,
          formatter: '{dot|●} {name|{b}}\n{percent|{d}%}', 
          rich: {
            dot: {
              color: 'inherit',
              fontSize: 12,
              padding: [0, 4, 0, 0]
            },
            name: {
              fontSize: 12,
              fontWeight: 'bold',
              color: '#111827'
            },
            percent: {
              fontSize: 11,
              color: '#6b7280',
              backgroundColor: '#f3f4f6',
              borderRadius: 4,
              align: 'left',
              padding: [3, 0, 0, 16]
            }
          }
        },
        // 콜아웃 라인(지시선) 꾸미기
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
        data: dummyIncomeTags
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