export default class FirstPlugin {
    constructor() {
      // for test
      this.isRobotPage = (appKey, pageKey) => {
        return appKey === 'robot' && pageKey === 'robot_b'
      }
      this.isAddSlot = (tableKey) => {
        return tableKey === '96af3470-4aa4-11ed-9b88-c7f06a1db96a'
      }
    }
    apply(hooks) {
      // 添加固定行
      hooks.firstPluginChange.tap(
        'FirstPlugin--addFixedContent', // 可以是任意string
        (appKey, pageKey, tableKey, columns, dataSource) => {
          // console.log('firstPlugin', appKey, pageKey, tableKey, columns, dataSource, )
          if (this.isRobotPage(appKey, pageKey) && this.isAddSlot(tableKey)) {
            // ....
          }
        }
      )
    }
  }
  