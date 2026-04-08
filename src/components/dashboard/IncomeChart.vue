<script setup>
// import
import { computed } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';

import { TitleComponent, TooltipComponent, LegendComponent, LegendScrollComponent } from 'echarts/components'; 
import VChart from 'vue-echarts';

// ✨ use 배열에 LegendScrollComponent 추가
use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent, LegendScrollComponent]);

// DashboardPage로부터 실제 통계 데이터 받기
const props = defineProps({
  stats : {
    type: Object,
    default: () => ({})
  }
})

const INCOME_COLORS = ['#ee8567', '#f4a28c', '#f9c0b1', '#fbc5b9', '#fdd8d0'];

// reactive state
// 로그인한 유저의 데이터를 차트 포맷에 맞게 변환 (더미 데이터 대체)
const chartData = computed(() => {
  // 1. 서비스에서 넘어온 객체 형태의 태그 데이터 가져오기 { "#월급": 1010000, "#기타": 50000 }
  // (옵셔널 체이닝으로 breakdown.incomeByTag 안전하게 접근)
  const tagsObj = props.stats?.breakdown?.incomeByTag || {};

  // 2. 객체를 차트용 배열로 변환 [ { name: '#월급', value: 1010000 } ]
  const categories = Object.keys(tagsObj).map(key => ({
    name: key,
    value: tagsObj[key]
  }));

  // 3. 수입액이 큰 순서대로 내림차순 정렬 후, 색상을 순차적으로 매핑
  return categories
    .sort((a, b) => b.value - a.value)
    .map((item, index) => ({
      ...item,
      color: INCOME_COLORS[index % INCOME_COLORS.length]
    }))
    .filter(item => item.value > 0); // 금액이 0원인 항목은 그리지 않음
});

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
        data: chartData.value
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