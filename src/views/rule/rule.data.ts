import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { defHttp } from '/@/utils/http/axios';
import { i18n } from '/@/locales/setupI18n';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
const nowLang = i18n.global.availableLocales[0];
export function generateOption(name: string, zhName: string): any {
  let labelName: string = name;
  if (nowLang == 'zh_CN') {
    labelName = zhName;
  }
  return {
    id: name,
    label: labelName,
    value: name,
    key: name,
  };
}

export function generateField(field: {}): any {
  let fieldName = field['field_name'];
  const fieldType = field['field_type'];
  let component: string;
  let colProps: {} = {};
  switch (fieldType) {
    case 'map':
      component = 'InputTextArea';
      colProps = { lg: 24, md: 24 };
      break;
    case 'slice':
      component = 'InputTextArea';
      colProps = { lg: 24, md: 24 };
      break;
    case 'int64':
      component = 'InputNumber';
      break;
    case 'uint32':
      component = 'InputNumber';
      break;
    case 'int32':
      component = 'InputNumber';
      break;
    case 'bool':
      component = 'Switch';
      break;
    default:
      component = 'Input';
  }
  if (nowLang == 'zh_CN') {
    fieldName = field['field_zh_name'];
  }
  if (field['field_name'] == 'npc_id') {
    return {
      field: field['field_name'],
      component: 'Input',
      label: fieldName,
      required: true,
      slot: 'remoteSearch',
      colProps: {
        span: 8,
      },
      defaultValue: '0',
    };
  }
  return {
    field: field['field_name'],
    label: fieldName,
    required: field['field_required'],
    component: component,
    colProps: colProps,
    componentProps: {
      placeholder: field['field_example'],
    },
    show: ({ values }) => {
      return field['field_required'] || values.extend;
    },
  };
}

const serversOptions: {}[] = [];
const serverFields: string[] = [];
const protocolFields: string[] = [];
const processFields: string[] = [];
const actionsFields: string[] = [];

export const fieldData = await defHttp.get<any>({ url: '/rule/field' });

Object.keys(fieldData).forEach(function (key) {
  serversOptions.push(generateOption(key, fieldData[key].zh_name));
});

export const searchFormSchema: FormSchema[] = [
  {
    field: 'key',
    label: t('routes.cert.key_search'),
    component: 'Input',
    colProps: { span: 8 },
  },
];

export const columns: BasicColumn[] = [
  {
    title: 'uuid',
    dataIndex: 'uuid',
    align: 'left',
    width: 300,
  },
  {
    title: t('routes.rule.name'),
    dataIndex: 'name',
    align: 'left',
  },
  {
    title: t('routes.rule.server'),
    dataIndex: 'server_tpye',
    align: 'left',
    width: 80,
    customRender: ({ record }) => {
      return record.server.obj_type;
    },
  },
  {
    title: t('routes.rule.server_addr'),
    dataIndex: 'server_addr',
    align: 'left',
    customRender: ({ record }) => {
      return JSON.parse(record.server.obj_data).server_addr;
    },
  },
  {
    title: t('routes.rule.handler'),
    dataIndex: 'handler',
    align: 'left',
    customRender: ({ record }) => {
      return record.handler.obj_type;
    },
  },
  {
    title: t('routes.rule.process'),
    dataIndex: 'process',
    align: 'left',
    customRender: ({ record }) => {
      return record.process.obj_type;
    },
  },
  {
    title: t('routes.rule.action'),
    dataIndex: 'action_',
    align: 'left',
    customRender: ({ record }) => {
      return record.action.obj_type;
    },
  },
  {
    title: t('routes.rule.status'),
    dataIndex: 'status',
    customRender: ({ record }) => {
      const status = record.status;
      const enable = ~~status === 1;
      const color = enable ? 'green' : 'red';
      const text = enable ? t('routes.rule.open') : t('routes.rule.stop');
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: t('routes.rule.remark'),
    dataIndex: 'remark',
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
    field: 'name',
    label: t('routes.rule.name'),
    component: 'Input',
    colProps: { lg: 12, md: 12 },
    required: true,
  },
  {
    label: t('routes.rule.remark'),
    field: 'remark',
    component: 'Input',
    colProps: { lg: 12, md: 12 },
  },
  {
    field: 'status',
    label: t('routes.rule.status'),
    component: 'RadioButtonGroup',
    defaultValue: 1,
    colProps: { lg: 12, md: 12 },
    componentProps: {
      options: [
        { label: t('routes.rule.open'), value: 1 },
        { label: t('routes.rule.stop'), value: 0 },
      ],
    },
    required: true,
  },
  {
    field: 'extend',
    label: t('routes.rule.extend'),
    component: 'RadioButtonGroup',
    defaultValue: 0,
    colProps: { lg: 12, md: 12 },
    componentProps: {
      options: [
        { label: t('routes.rule.open'), value: 1 },
        { label: t('routes.rule.stop'), value: 0 },
      ],
    },
    required: true,
  },
  {
    field: 'server',
    component: 'Select',
    label: t('routes.rule.server'),
    colProps: { lg: 24, md: 24 },
    required: true,
    componentProps: ({ formModel, formActionType }) => {
      return {
        options: serversOptions,
        onChange: (e: any) => {
          const { removeSchemaByFiled, appendSchemaByField } = formActionType;
          changeServer(removeSchemaByFiled, appendSchemaByField, e);
        },
      };
    },
  },
  {
    field: '0',
    component: 'Input',
    label: t('routes.rule.limiter'),
    colProps: { lg: 24, md: 24 },
    slot: 'add',
  },
];

export function clearAllField(removeSchemaByFiled: any) {
  serverFields.forEach(function (value) {
    removeSchemaByFiled(value);
  });
  protocolFields.forEach(function (value) {
    removeSchemaByFiled(value);
  });
  processFields.forEach(function (value) {
    removeSchemaByFiled(value);
  });
  actionsFields.forEach(function (value) {
    removeSchemaByFiled(value);
  });
}

export function changeServer(removeSchemaByFiled: any, appendSchemaByField: any, e: any) {
  Object.keys(fieldData).forEach(function (key) {
    if (key == e) {
      const server = fieldData[key];
      const protocolsOptions: {}[] = [];
      Object.keys(server.children).forEach(function (key) {
        protocolsOptions.push(generateOption(key, server.children[key].zh_name));
      });
      clearAllField(removeSchemaByFiled);
      let lastField = 'server';
      Object.keys(server.field).forEach(function (key) {
        appendSchemaByField(generateField(server.field[key]), lastField);
        lastField = server.field[key]['field_name'];
        serverFields.push(lastField);
      });
      serverFields.push('handler');
      appendSchemaByField(
        {
          required: true,
          colProps: { lg: 24, md: 24 },
          label: t('routes.rule.handler'),
          component: 'Select',
          field: 'handler',
          componentProps: () => {
            return {
              options: protocolsOptions,
              onChange: (e: any) => {
                changeHandler(removeSchemaByFiled, appendSchemaByField, e, server);
              },
            };
          },
        },
        lastField,
      );
    }
  });
}

export function changeHandler(
  removeSchemaByFiled: any,
  appendSchemaByField: any,
  e: any,
  server: any,
) {
  Object.keys(server.children).forEach(function (key) {
    if (key == e) {
      const protocol = server.children[key];
      const processOptions: {}[] = [];
      Object.keys(protocol.children).forEach(function (key) {
        processOptions.push(generateOption(key, protocol.children[key].zh_name));
      });
      protocolFields.forEach(function (value) {
        removeSchemaByFiled(value);
      });
      processFields.forEach(function (value) {
        removeSchemaByFiled(value);
      });
      actionsFields.forEach(function (value) {
        removeSchemaByFiled(value);
      });
      protocolFields.push('process');
      appendSchemaByField(
        {
          required: true,
          colProps: { lg: 24, md: 24 },
          label: t('routes.rule.process'),
          component: 'Select',
          field: 'process',
          componentProps: {
            options: processOptions,
            onChange: (e: any) => {
              changeProcess(removeSchemaByFiled, appendSchemaByField, e, protocol);
            },
          },
        },
        'handler',
      );
    }
  });
}

export function changeProcess(
  removeSchemaByFiled: any,
  appendSchemaByField: any,
  e: any,
  protocol: any,
) {
  Object.keys(protocol.children).forEach(function (key) {
    if (key == e) {
      const process = protocol.children[key];
      const actionOptions: {}[] = [];
      Object.keys(process.children).forEach(function (key) {
        actionOptions.push(generateOption(key, process.children[key].zh_name));
      });
      processFields.forEach(function (value) {
        removeSchemaByFiled(value);
      });
      actionsFields.forEach(function (value) {
        removeSchemaByFiled(value);
      });
      let lastField = 'process';
      Object.keys(process.field).forEach(function (key) {
        appendSchemaByField(generateField(process.field[key]), lastField);
        lastField = process.field[key]['field_name'];
        processFields.push(lastField);
      });
      processFields.push('action');
      appendSchemaByField(
        {
          required: true,
          colProps: { lg: 24, md: 24 },
          label: t('routes.rule.action'),
          component: 'Select',
          field: 'action',
          componentProps: {
            options: actionOptions,
            onChange: (e: any) => {
              changeAction(removeSchemaByFiled, appendSchemaByField, e, process);
            },
          },
        },
        lastField,
      );
    }
  });
}

export function changeAction(
  removeSchemaByFiled: any,
  appendSchemaByField: any,
  e: any,
  process: any,
) {
  Object.keys(process.children).forEach(function (key) {
    if (key == e) {
      const action = process.children[key];
      actionsFields.forEach(function (value) {
        removeSchemaByFiled(value);
      });
      let lastField = 'action';
      Object.keys(action.field).forEach(function (key) {
        appendSchemaByField(generateField(action.field[key]), lastField);
        lastField = action.field[key]['field_name'];
        actionsFields.push(lastField);
      });
    }
  });
}
