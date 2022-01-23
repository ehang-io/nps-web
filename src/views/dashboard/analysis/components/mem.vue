<template>
  <Card :title="t('routes.dashboard.mem_usage')" :loading="loading">
    <div ref="chartRef" :style="{ width, height }"></div>
  </Card>
</template>
<script lang="ts" setup>
  import { Ref, ref, watch } from 'vue';
  import { Card } from 'ant-design-vue';
  import { useECharts } from '/@/hooks/web/useECharts';
  import { data } from '../data';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();

  const props = defineProps({
    loading: Boolean,
    width: {
      type: String as PropType<string>,
      default: '100%',
    },
    height: {
      type: String as PropType<string>,
      default: '300px',
    },
  });
  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);
  watch(
    () => props.loading,
    () => {
      if (props.loading) {
        return;
      }
      setOptions({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              width: 1,
              color: '#019680',
            },
          },
          formatter: function (data) {
            return (
              data[0].name +
              '<br/>' +
              data[0].seriesName +
              '：' +
              data[0].value +
              '%' +
              '<br/>' +
              data[1].seriesName +
              '：' +
              data[1].value +
              '%'
            );
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: data['time'],
          splitLine: {
            show: true,
            lineStyle: {
              width: 1,
              type: 'solid',
              color: 'rgba(226,226,226,0.5)',
            },
          },
          axisTick: {
            show: false,
          },
        },
        yAxis: [
          {
            type: 'value',
            splitNumber: 4,
            axisTick: {
              show: false,
            },
            splitArea: {
              show: true,
              areaStyle: {
                color: ['rgba(255,255,255,0.2)', 'rgba(226,226,226,0.2)'],
              },
            },
          },
        ],
        grid: { left: '1%', right: '1%', top: '2  %', bottom: 0, containLabel: true },
        series: [
          {
            name: t('routes.dashboard.swap_usage'),
            smooth: true,
            data: data['data']['swap'],
            type: 'line',
            areaStyle: {},
            itemStyle: {
              color: '#5ab1ef',
            },
          },
          {
            name: t('routes.dashboard.virtual_usage'),
            smooth: true,
            data: data['data']['virtual'],
            type: 'line',
            areaStyle: {},
            itemStyle: {
              color: '#019680',
            },
          },
        ],
      });
    },
    { immediate: true },
  );
</script>
