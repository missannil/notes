### page中 properties在attached后的load或onLoad才进来，如果计算属性关联了properties数据，由于计算属性初始化在load，所以

### 如果在beforcreate初始化计算字段，要放弃在计算字段中使用this上的方法，只能使用this.data,还要修改默认对象类型不加null的事情。