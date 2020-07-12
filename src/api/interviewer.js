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
