import type { MenuModule } from '/@/router/types';
import { t } from '/@/hooks/web/useI18n';
const menu: MenuModule = {
  orderNo: 1,
  menu: {
    name: t('routes.rule.rule'),
    path: '/rule',
  },
};
export default menu;
