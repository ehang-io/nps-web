import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const dashboard: AppRouteModule = {
  path: '/cert',
  name: 'Cert',
  component: LAYOUT,
  redirect: '/cert/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'ant-design:safety-certificate-twotone',
    title: t('routes.cert.cert'),
    orderNo: 12,
  },
  children: [
    {
      path: 'index',
      name: 'CertPage',
      component: () => import('/@/views/cert/index.vue'),
      meta: {
        title: t('routes.cert.cert'),
        icon: 'ant-design:safety-certificate-twotone',
        hideMenu: true,
      },
    },
  ],
};

export default dashboard;
