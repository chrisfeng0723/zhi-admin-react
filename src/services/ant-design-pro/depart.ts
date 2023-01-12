import { request } from '@umijs/max';

export async function depart(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request('/api/v1/departs', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  }).then((data) => {
    return {
      success: true,
      total: data?.pagination?.total,
      data: data?.list,
    };
  });
}

/** 新建规则 POST /api/depart */
export async function addDepart(options?: { [key: string]: any }) {
  return request<API.DepatListItem>('/api/v1/departs', {
    method: 'POST',
    data: options || {},
  });
}

/** 更新规则 PUT /api/depart */
export async function updateDepart(id?: string, options?: { [key: string]: any }) {
  return request<API.DepatListItem>('/api/v1/departs/' + id, {
    method: 'PUT',
    data: options || {},
  });
}

/** 删除部门 DELETE /api/depart */
export async function deleteDepart(id?: string, options?: { [key: string]: any }) {
  return request<API.DepatListItem>('/api/v1/departs/' + id, {
    method: 'DELETE',
    data: options || {},
  });
}
