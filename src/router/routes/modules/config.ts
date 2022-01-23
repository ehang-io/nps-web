import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const dashboard: AppRouteModule = {
  path: '/config',
  name: 'Config',
  component: LAYOUT,
  redirect: '/config/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'ant-design:security-scan-outlined',
    title: t('routes.config.config'),
    orderNo: 11,
  },
  children: [
    {
      path: 'index',
      name: 'ConfigPage',
      component: () => import('/@/views/config/index.vue'),
      meta: {
        title: t('routes.config.config'),
        icon: 'ant-design:security-scan-outlined',
        hideMenu: true,
      },
    },
  ],
};

export default dashboard;
