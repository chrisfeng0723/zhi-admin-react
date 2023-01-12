import React, { useState } from 'react';
import { Popconfirm } from 'antd';

interface IProps {
  title: string;
  id: string;
  handelDelete?: (id: string) => Promise<boolean>;
}
const DeleteConfirm: React.FC<IProps> = (props: IProps) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  console.log(props, '++++');
  const handleOk = () => {
    setConfirmLoading(true);
    // props.handelDelete(props.id)
    setTimeout(() => {
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
  };

  return (
    <Popconfirm
      title={props.title}
      onConfirm={handleOk}
      okButtonProps={{ loading: confirmLoading }}
      onCancel={handleCancel}
    >
      <a href="">删除</a>
    </Popconfirm>
  );
};

export default DeleteConfirm;
