// components/no-data/index.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    bgStyle: String, 
    img: String,
    tip: {
      type: String,
      value: '暂无内容',
    },
    isLoading: {
      type: Boolean,
      value: false,
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
