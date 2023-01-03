import { ProForm, ProFormText } from '@ant-design/pro-components';
import { SafetyCertificateOutlined } from '@ant-design/icons';
import { getCaptchaId, getCaptchaImage } from '@/services/ant-design-pro/api';
import { useState, useEffect } from 'react';
import { Image, message } from 'antd';

const getCaptcha = async () => {
  try {
    const data = await getCaptchaId();
    if (data.captcha_id !== '') {
      return data.captcha_id;
    }
  } catch (error) {
    message.error('获取验证码失败');
  }
  return '';
};

const CaptchInput: React.FC = () => {
  const [captchImg, setCaptchImgUrl] = useState<string>('');
  useEffect(() => {
    getCaptcha().then(async (data: string) => {
      const result = await getCaptchaImage({ id: data });
      setCaptchImgUrl(result);
    });
  }, []);
  const reloadCaptch = () => {
    getCaptcha().then(async (data: string) => {
      const result = await getCaptchaImage({ id: data });
      setCaptchImgUrl(result);
    });
  };
  return (
    <ProForm.Group>
      <ProFormText
        fieldProps={{
          size: 'large',
          prefix: <SafetyCertificateOutlined />,
        }}
        width={190}
        placeholder="请输入验证码"
      ></ProFormText>
      <Image preview={false} width={100} src={captchImg} onClick={reloadCaptch} />
    </ProForm.Group>
  );
};

export default CaptchInput;
