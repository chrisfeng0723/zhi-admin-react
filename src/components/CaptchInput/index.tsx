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

interface Iprops {
  width: number;
  getCaptchaId: (n: string) => void;
}

const CaptchInput: React.FC<Iprops> = ({ width, getCaptchaId }) => {
  // const [captchaId, setCapthaId] = useState<string>('');
  const [captchaImg, setCaptchaImgUrl] = useState<string>('');
  useEffect(() => {
    getCaptcha().then(async (data: string) => {
      const result = await getCaptchaImage({ id: data });
      // setCapthaId(data);
      getCaptchaId(data);
      setCaptchaImgUrl(result);
    });
  }, []);
  const reloadCaptch = () => {
    getCaptcha().then(async (data: string) => {
      const result = await getCaptchaImage({ id: data });
      // setCapthaId(data);
      getCaptchaId(data);
      setCaptchaImgUrl(result);
    });
  };
  return <Image preview={false} width={width} src={captchaImg} onClick={reloadCaptch} />;
};

export default CaptchInput;
