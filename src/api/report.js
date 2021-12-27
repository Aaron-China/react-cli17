import { axios } from '@utils/request'

export function getList (d) {
    return axios({
        url: `/report/list`,
        method: 'post',
        data: d
    })
}

export function saveD (d) {
    return axios({
        url: `/report/save`,
        method: 'post',
        data: d
    })
}


