import type { MenuModule } from '/@/router/types';
import { t } from '/@/hooks/web/useI18n';
const menu: MenuModule = {
  orderNo: 2,
  menu: {
    name: t('routes.config.config'),
    path: '/config',
  },
};
export default menu;
