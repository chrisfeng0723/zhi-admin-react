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
  getCaptchId: (n: string) => void;
}

const CaptchInput: React.FC<Iprops> = (props: Iprops) => {
  const { width, getCaptchId } = props;
  const [captchId, setCapthId] = useState<string>('');
  const [captchImg, setCaptchImgUrl] = useState<string>('');
  useEffect(() => {
    getCaptcha().then(async (data: string) => {
      const result = await getCaptchaImage({ id: data });
      setCapthId(data);
      getCaptchId(captchId);
      setCaptchImgUrl(result);
    });
  }, []);
  const reloadCaptch = () => {
    getCaptcha().then(async (data: string) => {
      const result = await getCaptchaImage({ id: data });
      setCapthId(data);
      getCaptchId(captchId);
      setCaptchImgUrl(result);
    });
  };
  return <Image preview={false} width={width} src={captchImg} onClick={reloadCaptch} />;
};

export default CaptchInput;
