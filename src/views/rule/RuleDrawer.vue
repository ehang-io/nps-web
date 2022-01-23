<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #remoteSearch="{ model, field }">
        <ApiSelect
          :api="npcListApi"
          showSearch
          v-model:value="model[field]"
          :filterOption="false"
          resultField="items"
          labelField="name"
          valueField="sn"
          :params="searchParams"
          @search="onSearch"
        />
      </template>
      <template #add="{ field }">
        <Button v-if="Number(field) === 0" @click="add">+</Button>
        <Button v-if="field > 0" @click="del(field)">-</Button>
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicForm, useForm, ApiSelect } from '/@/components/Form/index';
  import {
    formSchema,
    generateField,
    fieldData,
    changeServer,
    changeHandler,
    changeProcess,
    changeAction,
    clearAllField,
    generateOption,
  } from './rule.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { defHttp } from '/@/utils/http/axios';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { createMessage } = useMessage();
  const { info, success, warning, error } = createMessage;
  const { t } = useI18n();
  const limiterOptions: {}[] = [];
  const limiterFields: string[] = [];
  export const limiterData = await defHttp.get<any>({ url: '/rule/limiter' });
  Object.keys(limiterData).forEach(function (key) {
    limiterOptions.push(generateOption(key, limiterData[key]['zh_name']));
  });

  export default defineComponent({
    name: 'MenuDrawer',
    components: { BasicDrawer, BasicForm, ApiSelect },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const [
        registerForm,
        {
          resetFields,
          updateSchema,
          setFieldsValue,
          appendSchemaByField,
          removeSchemaByFiled,
          validate,
        },
      ] = useForm({
        labelWidth: 100,
        schemas: formSchema,
        showActionButtonGroup: false,
        baseColProps: { lg: 12, md: 24 },
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
        clearAllField(removeSchemaByFiled);
        clearAllLimiter();
        setDrawerProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        if (unref(isUpdate)) {
          const dataSet = JSON.parse(JSON.stringify(data));
          delete dataSet.record.server;
          delete dataSet.record.handler;
          delete dataSet.record.process;
          delete dataSet.record.action;
          setFieldsValue({ ...dataSet.record });
          changeServer(removeSchemaByFiled, appendSchemaByField, data.record.server.obj_type);
          var obj = fieldData[data.record.server.obj_type];
          changeHandler(
            removeSchemaByFiled,
            appendSchemaByField,
            data.record.handler.obj_type,
            obj,
          );
          var obj = obj['children'][data.record.handler.obj_type];
          changeProcess(
            removeSchemaByFiled,
            appendSchemaByField,
            data.record.process.obj_type,
            obj,
          );
          var obj = obj['children'][data.record.process.obj_type];
          changeAction(removeSchemaByFiled, appendSchemaByField, data.record.action.obj_type, obj);

          var updateField: {}[] = [];
          updateField['server'] = data.record.server.obj_type;
          var nowFieldData = JSON.parse(data.record.server.obj_data);
          Object.keys(nowFieldData).forEach(function (key) {
            updateField[key] = formatValue(nowFieldData[key]);
          });
          updateField['handler'] = data.record.handler.obj_type;
          nowFieldData = JSON.parse(data.record.handler.obj_data);
          Object.keys(nowFieldData).forEach(function (key) {
            updateField[key] = formatValue(nowFieldData[key]);
          });
          updateField['process'] = data.record.process.obj_type;
          nowFieldData = JSON.parse(data.record.process.obj_data);
          Object.keys(nowFieldData).forEach(function (key) {
            updateField[key] = formatValue(nowFieldData[key]);
          });
          updateField['action'] = data.record.action.obj_type;
          nowFieldData = JSON.parse(data.record.action.obj_data);
          Object.keys(nowFieldData).forEach(function (key) {
            updateField[key] = formatValue(nowFieldData[key]);
          });

          // limiters
          n.value = 1;
          Object.keys(data.record.limiters).forEach(function (num) {
            const index = Number(num) + 1;
            add();
            updateField[`limit_${index}_`] = data.record.limiters[num].obj_type;
            nowFieldData = JSON.parse(data.record.limiters[num].obj_data);
            changeLimiter(data.record.limiters[num].obj_type, `limit_${index}_`, index);
            Object.keys(nowFieldData).forEach(function (key) {
              updateField[`limit_${index}_${key}`] = formatValue(nowFieldData[key]);
            });
          });
          setFieldsValue({ ...updateField });
        }
      });

      const getTitle = computed(() =>
        !unref(isUpdate) ? t('routes.rule.add_rule') : t('routes.rule.edit_rule'),
      );

      function formatValue(fieldValue: any): any {
        if (fieldValue != null && fieldValue != undefined && typeof fieldValue == 'object') {
          if (fieldValue.constructor == Array) {
            return fieldValue.join('\n');
          }
          var s = '';
          Object.keys(fieldValue).forEach(function (key) {
            s += key + ' ' + fieldValue[key] + '\n';
          });
          return s;
        }
        return fieldValue;
      }

      function formatData(fieldType: string, fieldValue: string): any {
        if (fieldType == 'map') {
          var m: {} = {};
          const lines = fieldValue.split('\n');
          lines.forEach(function (val) {
            const line = val.split(' ');
            if (line.length == 2) {
              m[line[0]] = line[1];
            }
          });
          return m;
        }
        if (fieldType == 'slice') {
          return fieldValue.split('\n');
        }
        return fieldValue;
      }
      function generateFieldData(values: any, obj: any, filedName: string): any {
        var f: {} = {};
        var data = {};
        f['obj_type'] = values[filedName];
        var field = obj['field'];
        Object.keys(field).forEach(function (key) {
          if (values[field[key]['field_name']] != undefined) {
            data[field[key]['field_name']] = formatData(
              field[key]['field_type'],
              values[field[key]['field_name']],
            );
          }
        });
        f['obj_data'] = JSON.stringify(data);
        return f;
      }
      async function handleSubmit() {
        try {
          const values = await validate();
          console.log(values);
          setDrawerProps({ confirmLoading: true });
          var reqData: {} = {};
          reqData['uuid'] = values.uuid;
          reqData['name'] = values.name;
          reqData['remark'] = values.remark;
          reqData['status'] = values.status;
          reqData['extend'] = values.extend;

          var obj = fieldData[values['server']];
          reqData['server'] = generateFieldData(values, obj, 'server');
          var obj = obj['children'][values['handler']];
          reqData['handler'] = generateFieldData(values, obj, 'handler');
          var obj = obj['children'][values['process']];
          reqData['process'] = generateFieldData(values, obj, 'process');
          var obj = obj['children'][values['action']];
          reqData['action'] = generateFieldData(values, obj, 'action');

          var limiters: {}[] = [];
          var limiter: {} = {};
          Object.keys(values).forEach(function (key) {
            if (key.indexOf('limit_') > -1) {
              const arr = key.split('_');
              if (arr.length > 3) {
                limiter[arr[1]] = 1;
              }
            }
          });
          Object.keys(limiter).forEach(function (num) {
            var data = {};
            data['obj_type'] = values[`limit_${num}_`];
            const f = limiterData[data['obj_type']];
            var objData = {};
            Object.keys(f.field).forEach(function (key) {
              const fieldName = f.field[key]['field_name'];
              const formValue = values[`limit_${num}_${fieldName}`];
              if (formValue != undefined) {
                objData[fieldName] = formValue;
              }
            });
            data['obj_data'] = JSON.stringify(objData);
            limiters.push(data);
          });
          reqData['limiters'] = limiters;
          if (unref(isUpdate)) {
            await defHttp.put<any>({
              url: '/rule',
              data: reqData,
            });
          } else {
            await defHttp.post<any>({
              url: '/rule',
              data: reqData,
            });
          }

          closeDrawer();
          emit('success');
          success('success');
        } catch (err) {
          error(err.message);
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      const n = ref(1);

      function add() {
        var lastField = `limit_${n.value}_`;
        var nowValue = `${n.value}`;
        limiterFields.push(lastField);
        appendSchemaByField(
          {
            field: `limit_${n.value}_`,
            component: 'Select',
            label: t('routes.rule.limiter'),
            colProps: { lg: 18, md: 18 },
            required: true,
            componentProps: ({ formModel, formActionType }) => {
              return {
                options: limiterOptions,
                onChange: (e: any) => {
                  changeLimiter(e, lastField, nowValue);
                },
              };
            },
          },
          '',
        );
        appendSchemaByField(
          {
            field: `${n.value}`,
            component: 'Input',
            label: ' ',
            colProps: { lg: 6, md: 6 },
            slot: 'add',
          },
          '',
        );
        limiterFields.push(`${n.value}`);
        n.value++;
      }

      function changeLimiter(e: any, lastField: any, nowValue: any) {
        Object.keys(limiterData).forEach(function (key) {
          if (key == e) {
            const f = limiterData[key];
            limiterFields.forEach(function (value) {
              if (value.indexOf(lastField) != -1 && value != lastField) {
                removeSchemaByFiled(value);
              }
            });
            Object.keys(f.field).forEach(function (key) {
              const nowField = generateField(f.field[key]);
              nowField.field = lastField + f.field[key]['field_name'];
              console.log(nowField);
              appendSchemaByField(nowField, nowValue);
              limiterFields.push(nowField.field);
            });
          }
        });
      }

      function del(field) {
        limiterFields.forEach(function (value) {
          if (value.indexOf(`limit_${field}_`) != -1) {
            removeSchemaByFiled(value);
          }
        });
        removeSchemaByFiled(field);
      }

      function clearAllLimiter() {
        limiterFields.forEach(function (value) {
          removeSchemaByFiled(value);
        });
      }

      const keyword = ref<string>('');
      const searchParams = computed<Recordable>(() => {
        return { keyword: unref(keyword) };
      });

      function onSearch(value: string) {
        keyword.value = value;
      }

      const npcListApi = (params?: any) =>
        defHttp.get<any[]>({ url: '/cert/page?page=1&pageSize=1000&key=client', params });

      return {
        registerDrawer,
        registerForm,
        getTitle,
        handleSubmit,
        searchParams,
        onSearch,
        add,
        del,
        npcListApi,
      };
    },
  });
</script>
