<template>
  <div class="p-4">
    <GrowCard :loading="loading" class="enter-y" />
    <div class="md:flex enter-y">
      <cpu class="md:w-1/3 w-full" :loading="loading" />
      <mem class="md:w-1/3 !md:mx-4 !md:my-0 !my-4 w-full" :loading="loading" />
      <disk class="md:w-1/3 !md:mx-4 !md:my-0 !my-4 w-full" :loading="loading" />
    </div>
    <div class="md:flex enter-y">
      <load class="md:w-1/3 w-full" :loading="loading" />
      <conn class="md:w-1/3 !md:mx-4 !md:my-0 !my-4 w-full" :loading="loading" />
      <bandwidth class="md:w-1/3 !md:mx-4 !md:my-0 !my-4 w-full" :loading="loading" />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import GrowCard from './components/GrowCard.vue';
  import cpu from './components/cpu.vue';
  import mem from './components/mem.vue';
  import disk from './components/disk.vue';
  import load from './components/load.vue';
  import conn from './components/conn.vue';
  import bandwidth from './components/bandwidth.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const loading = ref(false);

  import { defHttp } from '/@/utils/http/axios';

  // const data = await defHttp.get<any>({ url: '/status' });
  // console.log(data);

  // setTimeout(() => {
  //   loading.value = false;
  // }, 1500);
</script>
