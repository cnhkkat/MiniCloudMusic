// components/load-more/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    loadingTxt: String,
    endTxt: String,
    tipTxt: String,
    isLoading: {
      type: Boolean,
      value: true,
      observer(nv) {
        let { loadingTxt, tipTxt, isEnd } = this.data;
        if (!isEnd) {
          if (nv) {
            this.setData({
              isLoading: nv,
              text: loadingTxt || '数据加载中'
            });
          } else {
            this.setData({
              isLoading: nv,
              text: tipTxt || '上拉加载更多'
            });
          }
        }
      }
    },
    isEnd: {
      type: Boolean,
      value: false,
      observer(nv) {
        if (nv) {
          let { endTxt } = this.data;
          this.setData({
            isEnd: nv,
            text: endTxt || '我是有底线的'
          });
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    text: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
