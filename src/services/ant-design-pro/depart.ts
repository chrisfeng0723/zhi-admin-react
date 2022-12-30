import { request } from '@umijs/max';

export async function depart(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.DepartList>('/api/depart', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 POST /api/depart */
export async function addDepart(options?: { [key: string]: any }) {
  return request<API.DepatListItem>('/api/depart', {
    method: 'POST',
    data: options || {},
  });
}
