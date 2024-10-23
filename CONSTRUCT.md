# 專案結構

- src/
  - assets/ # 資源文件
    - images/ # 圖片
    - styles/ # 樣式
      - main.css # 全局樣式
      - clock.css # 時鐘樣式
      - leftSettings.css # 左側設置面板樣式
      - rightObjectList.css # 右側對象列表樣式
  - components/ # 組件
    - ClockDisplay.vue # 時鐘顯示組件
    - LeftSettingsPanel.vue # 左側設置面板組件
    - DateObject.vue # 日期對象組件
    - RightObjectList.vue # 右側對象列表組件
  - composables/ # 邏輯
    - useClockLogic.js # 時鐘邏輯
    - useSettingsLogic.js # 設置邏輯
    - useObjectListLogic.js # 對象列表邏輯
    - useDateObjectLogic.js # 日期對象邏輯
  - utils/
    - logger.js # 日誌工具
  - store/ # 存儲
    - plugins/ # 插件
      - persistencePlugin.js # 持久化插件
      - LoggerPlugin.js # 日誌插件
    - settings.js # 設置存儲
  - views/ # 視圖
    - Home.vue
  - App.vue # 應用程序
  - main.js # 主入口