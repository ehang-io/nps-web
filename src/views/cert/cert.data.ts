import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export const columns: BasicColumn[] = [
  {
    title: 'id',
    dataIndex: 'sn',
  },
  {
    title: t('routes.cert.name'),
    dataIndex: 'name',
    align: 'left',
  },
  {
    title: t('routes.cert.cert_type'),
    dataIndex: 'cert_type',
  },
  {
    title: t('routes.cert.status'),
    dataIndex: 'status',
    width: 80,
    customRender: ({ record }) => {
      const status = record.status;
      const enable = ~~status === 1;
      const color = enable ? 'green' : 'red';
      const text = enable ? t('routes.cert.open') : t('routes.cert.stop');
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: t('routes.cert.remark'),
    dataIndex: 'remark',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'key',
    label: t('routes.cert.key_search'),
    component: 'Input',
    colProps: { span: 8 },
  },
];

export const formSchema: FormSchema[] = [
  {
    label: 'uuid',
    field: 'uuid',
    component: 'Input',
    show: () => {
      return false;
    },
  },
  {
    label: 'sn',
    field: 'sn',
    component: 'Input',
    show: () => {
      return false;
    },
  },
  {
    label: 'key',
    field: 'key',
    component: 'Input',
    show: () => {
      return false;
    },
  },
  {
    label: 'cert',
    field: 'cert',
    component: 'Input',
    show: () => {
      return false;
    },
  },
  {
    field: 'name',
    label: t('routes.cert.name'),
    component: 'Input',
    required: true,
  },
  {
    required: true,
    field: 'cert_type',
    component: 'Select',
    label: t('routes.cert.cert_type'),
    componentProps: {
      options: [
        {
          label: 'npc',
          value: 'npc',
          key: 'npc',
        },
        {
          label: 'bridge',
          value: 'bridge',
          key: 'bridge',
        },
        {
          label: 'server',
          value: 'server',
          key: 'server',
        },
      ],
    },
  },
  {
    field: 'status',
    label: t('routes.cert.status'),
    component: 'RadioButtonGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: t('routes.cert.open'), value: 1 },
        { label: t('routes.cert.stop'), value: 0 },
      ],
    },
    required: true,
  },
  {
    label: t('routes.cert.remark'),
    field: 'remark',
    component: 'InputTextArea',
  },
];
