import React, { useState, useRef } from 'react';
import {
  ActionType,
  PageContainer,
  ProTable,
  ProColumns,
  DrawerForm,
  ProFormText,
  ProFormRadio,
  ProFormDigit,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { depart, addDepart } from '@/services/ant-design-pro/depart';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const handleAdd = async (fields: API.DepatListItem) => {
  const hide = message.info('正在添加部门');
  try {
    await addDepart({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败');
    return false;
  }
};

const columns: ProColumns<API.DepatListItem>[] = [
  {
    title: '编码',
    dataIndex: 'deptId',
    tooltip: '部门的唯一ID',
    valueType: 'text',
  },
  {
    title: '部门名称',
    dataIndex: 'deptName',
  },
  {
    title: '排序',
    dataIndex: 'sort',
  },
  {
    title: '状态',
    dataIndex: 'status',
    valueEnum: {
      0: '初始化',
      1: '处理中',
      2: '完成中',
      3: '已结束',
      4: '废弃',
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    valueType: 'date',
    sorter: true,
    hideInSearch: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    valueType: 'dateRange',
    hideInForm: true,
    hideInTable: true,
  },
  {
    title: '操作',
    dataIndex: 'option',
    valueType: 'option',
  },
];

const DepatList: React.FC = () => {
  const [createModalOpen, handleModelOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  return (
    <PageContainer>
      <ProTable<API.DepatListItem>
        headerTitle="部门查询"
        columns={columns}
        request={depart}
        rowKey="deptId"
        toolBarRender={() => [
          <Button
            key="button"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              handleModelOpen(true);
            }}
          >
            新建
          </Button>,
        ]}
      />
      <DrawerForm
        open={createModalOpen}
        title="新部门"
        width="400px"
        onOpenChange={handleModelOpen}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.DepatListItem);
          if (success) {
            handleModelOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
          return false;
        }}
      >
        <ProFormTreeSelect
          label="上级部门"
          tooltip="当前部门的上级部门"
          name="parentId"
          placeholder="Please select"
          allowClear
          width={330}
          secondary
          request={async () => {
            return [
              {
                title: 'Node1',
                value: '0-0',
                children: [
                  {
                    title: 'Child Node1',
                    value: '0-0-0',
                  },
                ],
              },
              {
                title: 'Node2',
                value: '0-1',
                children: [
                  {
                    title: 'Child Node3',
                    value: '0-1-0',
                  },
                  {
                    title: 'Child Node4',
                    value: '0-1-1',
                  },
                  {
                    title: 'Child Node5',
                    value: '0-1-2',
                  },
                ],
              },
            ];
          }}
          // tree-select args
          fieldProps={{
            showArrow: false,
            filterTreeNode: true,
            showSearch: true,
            dropdownMatchSelectWidth: false,
            labelInValue: true,
            autoClearSearchValue: true,
            treeNodeFilterProp: 'title',
            fieldNames: {
              label: 'title',
            },
          }}
        />
        <ProFormText width="md" name="deptName" label="名称" required />
        <ProFormText width="md" name="leader" label="负责人" required />
        <ProFormText width="md" name="phone" label="电话" required />
        <ProFormText width="md" name="email" label="邮箱" required />
        <ProFormRadio.Group
          name="satus"
          label="状态"
          initialValue={1}
          options={[
            {
              label: '正常',
              value: 1,
            },
            {
              label: '停用',
              value: 2,
            },
          ]}
        />
        <ProFormDigit label="排序" required width="md" name="sort" />
      </DrawerForm>
    </PageContainer>
  );
};
export default DepatList;
