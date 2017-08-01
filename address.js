import util from '../util'

export default {
  /**
   * getById
   * @param  {Number} rId aa
   * @return {Object}
   */
  getById (rId) {
    return util.get('/receiver/edit', {r_id: rId})
  },

  /**
   * getList description
   * @param  {Number} options.pageSize [pageSize]
   * @param  {Number} options.curPage  [curPage]
   * @return {Object}
   */
  getList ({pageSize = 10, curPage = 1}) {
    console.debug('获取收货地址')
    return util.get('/receiver/list', {
      page_size: pageSize,
      cur_page: curPage
    })
  },

}
