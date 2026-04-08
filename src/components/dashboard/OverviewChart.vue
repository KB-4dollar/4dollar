<script setup>
// import
import { computed } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
// ✨ ScrollComponent를 LegendScrollComponent로 변경!
import { TitleComponent, TooltipComponent, LegendComponent, LegendScrollComponent } from 'echarts/components'; 
import VChart from 'vue-echarts';

// ✨ use 배열에서도 LegendScrollComponent로 변경!
use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent, LegendScrollComponent]);


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
      type: 'scroll',      // ✨ 항목이 많아지면 상하 화살표가 생기며 스크롤 가능해짐
      orient: 'vertical',
      right: '0%',         // ✨ 우측 상단 모서리로 바짝 붙임
      top: '0%',
      itemGap: 12,         // 라벨 간격 살짝 축소
      textStyle: { color: '#6b7280', fontSize: 12 }, // 폰트 사이즈 13 -> 12 축소
      pageIconColor: '#ee8567', // 스크롤 화살표 색상 (포인트 컬러)
      pageTextStyle: { color: '#6b7280' }
    },
    series: [
      {
        name: '재정 현황',
        type: 'pie',
        center: ['45%', '50%'], // ✨ 차트 중심을 화면의 왼쪽 35% 지점으로 이동 (우측 범례 공간 확보)
        radius: ['40%', '65%'], // ✨ 차트 크기도 살짝 줄여서 지시선 뻗어나갈 공간 확보
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
        // 라벨(텍스트) 꾸미기
        label: {
          show: true,
          formatter: '{dot|●} {name|{b}}\n{percent|{d}%}', 
          rich: {
            dot: {
              color: 'inherit',
              fontSize: 12, // 14 -> 12 축소
              padding: [0, 4, 0, 0]
            },
            name: {
              fontSize: 12, // 13 -> 12 축소
              fontWeight: 'bold',
              color: '#111827'
            },
            percent: {
              fontSize: 11, // 12 -> 11 축소
              color: '#6b7280',
              backgroundColor: '#f3f4f6',
              borderRadius: 4,
              align: 'left',
              padding: [3, 0, 0, 16] // ✨ dot(12) + 간격(4) = 16px로 여백 수정
            }
          }
        },
        // 콜아웃 라인(지시선) 꾸미기
        labelLine: {
          show: true,
          smooth: 0.2,
          length: 10,        // ✨ 15 -> 10으로 축소 (차트에서 뻗어나오는 길이)
          length2: 15,       // ✨ 30 -> 15로 대폭 축소 (꺾인 후 수평 길이)
          lineStyle: {
            width: 2,        // 선 굵기도 3 -> 2로 얇게 조정
            type: 'dashed',
            color: '#d1d5db'
          }
        },
        data: [
          { value: dummyData.income, name: '총 수입', itemStyle: { color: '#ee8567' } },
          { value: dummyData.expense, name: '총 지출', itemStyle: { color: '#243047' } }
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