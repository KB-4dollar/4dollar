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
        // 2. 라벨(텍스트) 꾸미기 (✨ rich 속성 활용)
        label: {
          show: true,
          // {dot|●} : 텍스트 앞에 동그라미 특수기호를 넣고 dot 스타일 지정
          // {name|{b}} : 카테고리 이름
          // \n : 줄바꿈
          // {percent|{d}%} : 퍼센트 수치
          formatter: '{dot|●} {name|{b}}\n{percent|{d}%}', 
          rich: {
            // 1. 앞에 붙는 점(Dot) 스타일
            dot: {
              color: 'inherit', // 자기가 속한 파이 조각의 색상을 자동으로 따라감
              fontSize: 14,
              padding: [0, 4, 0, 0] // 점과 글자(이름) 사이의 간격
            },
            // 2. 카테고리 이름 스타일
            name: {
              fontSize: 13,
              fontWeight: 'bold',
              color: '#111827' // --text-primary
            },
            // 3. 퍼센트 수치 스타일 (수직 정렬의 비밀)
            percent: {
              fontSize: 12,
              color: '#6b7280', // --text-secondary
              backgroundColor: '#f3f4f6',
              borderRadius: 4, // 배경 박스 모서리 둥글게
              align: 'left',    // 왼쪽 정렬을 강제하고
              
              padding: [4, 0, 0, 18] // ✨ 핵심: dot(14px) + 간격(4px) = 18px 만큼 왼쪽 여백을 밀어서 텍스트와 시작점을 완벽하게 맞춤!
            }
          }
        },
        // 1. 콜아웃 라인(지시선) 꾸미기
        labelLine: {
          show: true,
          smooth: 0.2,       // 0에 가까울수록 직선, 1에 가까울수록 부드러운 곡선이 돼 (요즘 트렌드는 살짝 곡선!)
          length: 15,        // 차트에서 뻗어나오는 첫 번째 선의 길이
          length2: 30,       // 꺾인 후 수평으로 뻗어가는 두 번째 선의 길이
          lineStyle: {
            width: 3,      // 선 굵기
            type: 'dashed',  // 'solid'(실선), 'dashed'(점선), 'dotted'(점) 중 선택 가능
            color: '#d1d5db' // 선 색상을 튀지 않는 연한 회색(--line 톤)으로 고정하면 훨씬 깔끔해!
          }
        },
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