import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const dashboard: AppRouteModule = {
  path: '/rule',
  name: 'Rule',
  component: LAYOUT,
  redirect: '/rule/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'ant-design:interaction-twotone',
    title: t('routes.rule.rule'),
    orderNo: 11,
  },
  children: [
    {
      path: 'index',
      name: 'RulePage',
      component: () => import('/@/views/rule/index.vue'),
      meta: {
        title: t('routes.rule.rule'),
        icon: 'ant-design:interaction-twotone',
        hideMenu: true,
      },
    },
  ],
};

export default dashboard;
