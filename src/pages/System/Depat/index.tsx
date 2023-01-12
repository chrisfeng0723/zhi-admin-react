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
  ProDescriptions,
  ProDescriptionsItemProps,
} from '@ant-design/pro-components';
import { depart, addDepart, updateDepart, deleteDepart } from '@/services/ant-design-pro/depart';
import { Button, message, Form, Popconfirm, Drawer } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const handleAdd = async (fields: API.DepatListItem) => {
  const hide = message.loading('正在添加部门');
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

const handleEdit = async (fields: API.DepatListItem) => {
  const hide = message.loading('正在编辑部门');
  try {
    await updateDepart(fields.id, fields);
    hide();
    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新失败');
    return false;
  }
};

const selectData = async () => {
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
};

const DepatList: React.FC = () => {
  const [createModalOpen, handleModelOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.DepatListItem>();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();

  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleDelete = async (id?: string) => {
    const hide = message.loading('正在删除');
    setConfirmLoading(true);
    try {
      await deleteDepart(id);
      hide();
      await console.log(id);
      message.success('删除成功');
      setConfirmLoading(false);
      return true;
    } catch (error) {
      hide();
      message.error('删除失败');
      setConfirmLoading(false);
      return false;
    }
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
  };

  const hanldeOk = (id?: string) => {
    setConfirmLoading(true);
    handleDelete(id);
  };
  const columns: ProColumns<API.DepatListItem>[] = [
    {
      title: '编码',
      dataIndex: 'id',
      tooltip: '部门的唯一ID',
      valueType: 'text',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '部门名称',
      dataIndex: 'depart_name',
    },
    {
      title: '负责人',
      dataIndex: 'leader',
    },
    {
      title: '电话',
      dataIndex: 'phone',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        1: {
          text: '正常',
          status: 'Success',
        },
        2: {
          text: '停用',
          status: 'Default',
        },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      valueType: 'dateTime',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      valueType: 'dateRange',
      hideInForm: true,
      hideInTable: true,
      hideInDescriptions: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      hideInDescriptions: true,
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            setCurrentRow(record);
            handleUpdateModalOpen(true);
          }}
        >
          编辑
        </a>,
        <Popconfirm
          key="delete"
          title="删除"
          onConfirm={() => {
            hanldeOk(record.id);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }}
          okButtonProps={{
            loading: confirmLoading,
          }}
          onCancel={handleCancel}
        >
          <a href="">删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.DepatListItem>
        headerTitle="部门查询"
        columns={columns}
        request={depart}
        actionRef={actionRef}
        rowKey="id"
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
        form={form}
        onOpenChange={handleModelOpen}
        drawerProps={{
          destroyOnClose: true,
        }}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.DepatListItem);
          if (success) {
            handleModelOpen(false);
            // form.resetFields()
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
        <ProFormText width="md" name="depart_name" label="名称" required />
        <ProFormText width="md" name="leader" label="负责人" required />
        <ProFormText
          width="md"
          name="phone"
          label="电话"
          rules={[
            {
              required: true,
              message: '请填写电话',
            },
          ]}
        />
        <ProFormText
          width="md"
          name="email"
          label="邮箱"
          rules={[
            {
              required: true,
              message: '请填写邮箱',
              type: 'email',
            },
          ]}
        />
        <ProFormRadio.Group
          name="status"
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

      <DrawerForm
        open={updateModalOpen}
        title="更新部门"
        width="400px"
        form={form}
        drawerProps={{
          destroyOnClose: true,
          // maskClosable:false,
          afterOpenChange: () => {
            setCurrentRow(undefined);
          },
        }}
        onOpenChange={handleUpdateModalOpen}
        onFinish={async (value) => {
          const success = await handleEdit(value as API.DepatListItem);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            // form.resetFields()
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
          request={selectData}
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
        <ProFormText name="id" hidden={true} initialValue={currentRow?.id} />
        <ProFormText
          width="md"
          name="depart_name"
          label="名称"
          initialValue={currentRow?.depart_name}
          required
        />
        <ProFormText
          width="md"
          name="leader"
          label="负责人"
          initialValue={currentRow?.leader}
          required
        />
        <ProFormText
          width="md"
          name="phone"
          label="电话"
          initialValue={currentRow?.phone}
          required
        />
        <ProFormText
          width="md"
          name="email"
          label="邮箱"
          initialValue={currentRow?.email}
          required
        />
        <ProFormRadio.Group
          name="status"
          label="状态"
          initialValue={currentRow?.status}
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
        <ProFormDigit
          label="排序"
          required
          width="md"
          name="sort"
          initialValue={currentRow?.sort}
        />
      </DrawerForm>

      <Drawer
        width={400}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.depart_name && (
          <ProDescriptions<API.DepatListItem>
            column={1}
            title={currentRow?.depart_name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.depart_name,
            }}
            columns={columns as ProDescriptionsItemProps<API.DepatListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};
export default DepatList;
