import request from '@/utils/interview-request'

export function getList(query) {
  return request({
    url: 'getList',
    method: 'get',
    params: query
  })
}

export function addInterviewer(query) {
  return request({
    url: 'addInterviewer',
    method: 'get',
    params: query
  })
}

export function deleteInterviewer(query) {
  return request({
    url: 'deleteInterviewer',
    method: 'get',
    params: query
  })
}

export function editInterviewer(id, query) {
  return request({
    url: 'editInterviewer',
    method: 'get',
    params: {
      id,
      query
    }
  })
}

export function uploadExcel() {
  return request({
    url: 'excel',
    method: 'get'
  })
}
