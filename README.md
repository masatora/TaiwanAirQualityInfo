# TaiwanAirQualityInfo
本 demo 為結合地理資訊系統及統計圖表加以視覺化
api 為資料開放平台所提供的每小時空氣品質指標
https://opendata.epa.gov.tw/api/v1/AQI?$skip=0&$top=1000&$format=json
此 api 之憑證在移動裝置上尚未得到核可，所以在移動裝置需先在"政府憑證管理中心"背景安裝憑證
https://gca.nat.gov.tw/web2/index.html

# 主要使用的 library:
- vue: 此 demo 以 single files 的方式並搭配 quasar-cli 來開發
- quasar: 提供 RWD 及各種 vue components
- leaflet: 對圖資進行操作、繪製
- ramda: 為 functional programing 的 library，用以計算圖表所要用的資料
- plotly: 繪製圖表

# 操作說明
- 點擊地圖上縣市時，會突顯該縣市的各個監測站的空氣品質
- 點擊右側選單的 title，會顯示該縣市各監測站空氣品質的柱狀圖
- 點擊右側選單的監測站會顯示詳細的監測數據
