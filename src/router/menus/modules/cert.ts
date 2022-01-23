import type { MenuModule } from '/@/router/types';
import { t } from '/@/hooks/web/useI18n';
const menu: MenuModule = {
  orderNo: 2,
  menu: {
    name: t('routes.cert.cert'),
    path: '/cert',
  },
};
export default menu;
