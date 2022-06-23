// components/search/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder:{
      type:String,
      value:'请输入关键字'
    },
    value:{
      type:String,
      value:'',
      observer(val){
        this.setData({
          searchClearVisible:Boolean(val)
        })
      }
    }
  },
  options:{
    addGlobalClass:true
  },

  /**
   * 组件的初始数据
   */
  data: {
    searchClearVisible: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onInput(e){
      const { value } = e.detail
      this.setData({
        value,
        searchClearVisible:Boolean(value)
      })
    },
    onSearch(){
      let value = this.data.value.trim()
      this.triggerEvent('search',{ keyword : value })
    },
    onClearInputValue(){
      this.setData({
        value:'',
        searchClearVisible:false
      })
      this.triggerEvent('clear')
    }
  }
})
