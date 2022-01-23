<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> {{ t('routes.rule.add_rule') }} </a-button>
      </template>
      <template #expandedRowRender="{ record }">
        <span><b>meta data:</b> {{ record }} </span>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              popConfirm: {
                title: t('routes.rule.delete_confirm'),
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <MenuDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { defHttp } from '/@/utils/http/axios';
  import { useDrawer } from '/@/components/Drawer';
  import MenuDrawer from './RuleDrawer.vue';
  import { columns, searchFormSchema } from './rule.data';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();

  const getRuleList = (params: any) => defHttp.get<any>({ url: '/rule/page', params });

  export default defineComponent({
    name: 'DeptManagement',
    components: { BasicTable, MenuDrawer, TableAction },
    setup() {
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerTable, { reload }] = useTable({
        title: t('routes.rule.rule_list'),
        api: getRuleList,
        columns,
        pagination: true,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        striped: false,
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        showIndexColumn: false,
        canResize: false,
        expandRowByClick: true,
        actionColumn: {
          width: 80,
          title: t('routes.rule.option'),
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: undefined,
        },
      });

      function handleCreate() {
        openDrawer(true, {
          isUpdate: false,
        });
      }

      function handleEdit(record: Recordable) {
        openDrawer(true, {
          record,
          isUpdate: true,
        });
      }

      async function handleDelete(record: Recordable) {
        console.log(record);
        await defHttp.delete<any>({
          url: '/rule',
          data: record,
        });
        reload();
      }

      function handleSuccess() {
        reload();
      }

      return {
        registerTable,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        registerDrawer,
        t,
      };
    },
  });
</script>
