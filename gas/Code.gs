const PRODUCT_LIST = [
  { id: 'p01', name: '蕎麥茶包12入', price: 160 },
  { id: 'p02', name: '蕎麥茶包50入', price: 600 },
  { id: 'p03', name: '蕎麥脆粒', price: 200 },
  { id: 'p04', name: '蕎麥海苔原味', price: 90 },
  { id: 'p05', name: '蕎麥海苔芝麻', price: 90 },
  { id: 'p06', name: '蕎麥海苔杏仁', price: 90 },
  { id: 'p07', name: '蕎麥海苔麻辣', price: 90 },
  { id: 'p08', name: '脆丸子蕎麥風味', price: 90 },
  { id: 'p09', name: '脆丸子海苔風味', price: 90 },
  { id: 'p10', name: '蕎麥QQ麵', price: 180 },
  { id: 'p11', name: '蕎麥黃金麵', price: 180 },
  { id: 'p12', name: '蕎麥波浪麵', price: 180 },
  { id: 'p13', name: '蕎麥長壽細麵', price: 180 },
  { id: 'p14', name: '蕎麥麵味露', price: 200 },
  { id: 'p15', name: '蕎麥醬全素', price: 200 },
  { id: 'p16', name: '蕎麥芝麻醬全素', price: 180 },
  { id: 'p17', name: '澎玉紅心芭樂乾', price: 180 },
  { id: 'p18', name: '澎玉愛文芒果乾', price: 230 },
  { id: 'p19', name: '澎玉蘋果乾', price: 170 },
  { id: 'p20', name: '澎玉情人果乾', price: 170 },
  { id: 'p21', name: '澎玉草莓乾', price: 180 },
  { id: 'p22', name: '澎玉即食檸檬片', price: 170 },
  { id: 'p23', name: '澎玉水蜜桃乾', price: 170 },
  { id: 'p24', name: '澎玉鳳梨花乾無糖', price: 180 },
  { id: 'p25', name: '澎玉碳烤魷魚片', price: 165 },
  { id: 'p26', name: '澎玉小卷片', price: 165 },
  { id: 'p27', name: '澎玉綜合果仁400g', price: 160 },
  { id: 'p28', name: '澎玉無調味綜合堅果', price: 285 },
];

function doPost(e) {
  try {
    const params = e.parameter;
    const name = params.name || '';
    const ship = params.ship || '';
    const summary = params.summary || '';
    const total = parseInt(params.total || '0', 10);
    const note = params.note || '';

    const ss = getOrCreateSheet();
    const sheet = ss.getSheets()[0];

    // 檢查標題列
    if (sheet.getRange(1, 1).getValue() === '') {
      setupHeaders(sheet);
    }

    const row = sheet.getLastRow() + 1;
    const timestamp = new Date();

    // 各商品數量
    const qtys = PRODUCT_LIST.map(p => {
      const q = parseInt(params[p.id] || '0', 10);
      return q > 0 ? q : '';
    });

    // 備註欄：自動生成確認訊息
    const itemLines = [];
    PRODUCT_LIST.forEach(p => {
      const q = parseInt(params[p.id] || '0', 10);
      if (q > 0) itemLines.push(`${p.name} ${q}個 單價${p.price}元`);
    });
    const replyMsg = `${name}你好，你所訂購的產品如下：${itemLines.join('、')}、總金額：${total}元${note ? '\n備註：' + note : ''}`;

    // 寫入：時間 | 姓名 | 配送 | p01~p28 | 訂購摘要 | 總金額 | 備註及回覆
    const rowData = [timestamp, name, ship, ...qtys, summary, total, replyMsg];
    sheet.getRange(row, 1, 1, rowData.length).setValues([rowData]);

    // 格式：數量欄置中
    const qtyStart = 4;
    sheet.getRange(row, qtyStart, 1, PRODUCT_LIST.length).setHorizontalAlignment('center');

    // 交替底色
    const bgColor = (row % 2 === 0) ? '#e8f5ea' : '#ffffff';
    sheet.getRange(row, 1, 1, rowData.length).setBackground(bgColor);

    // 摘要欄 wrap
    sheet.getRange(row, qtyStart + PRODUCT_LIST.length).setWrap(true);
    // 備註欄 wrap
    sheet.getRange(row, qtyStart + PRODUCT_LIST.length + 2).setWrap(true);

    return ContentService.createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', msg: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet() {
  const props = PropertiesService.getScriptProperties();
  let ssId = props.getProperty('SPREADSHEET_ID');
  if (ssId) {
    try { return SpreadsheetApp.openById(ssId); } catch(e) {}
  }
  const ss = SpreadsheetApp.create('玉民蕎麥×澎玉191 團購訂單');
  props.setProperty('SPREADSHEET_ID', ss.getId());
  setupHeaders(ss.getSheets()[0]);
  return ss;
}

function setupHeaders(sheet) {
  // 欄位：時間 | 姓名 | 配送 | p01~p28（28欄）| 訂購摘要 | 總金額 | 備註及回覆
  const headers = ['時間戳記', '姓名', '配送方式'];
  PRODUCT_LIST.forEach(p => headers.push(p.name + '\n$' + p.price));
  headers.push('訂購摘要', '總金額（元）', '備註及回覆');

  const totalCols = headers.length;
  sheet.getRange(1, 1, 1, totalCols).setValues([headers]);

  const headerRange = sheet.getRange(1, 1, 1, totalCols);
  headerRange.setBackground('#1a5c2a')
    .setFontColor('#ffffff')
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
    .setWrap(true);
  sheet.setRowHeight(1, 48);

  // 欄寬
  sheet.setColumnWidth(1, 155); // 時間
  sheet.setColumnWidth(2, 80);  // 姓名
  sheet.setColumnWidth(3, 90);  // 配送
  for (let i = 4; i <= 4 + PRODUCT_LIST.length - 1; i++) {
    sheet.setColumnWidth(i, 78);
  }
  const summaryCol = 4 + PRODUCT_LIST.length;
  sheet.setColumnWidth(summaryCol, 220);     // 訂購摘要
  sheet.setColumnWidth(summaryCol + 1, 90);  // 總金額
  sheet.setColumnWidth(summaryCol + 2, 200); // 備註及回覆

  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(2);
}

function getSpreadsheetUrl() {
  const props = PropertiesService.getScriptProperties();
  const ssId = props.getProperty('SPREADSHEET_ID');
  if (ssId) {
    Logger.log(SpreadsheetApp.openById(ssId).getUrl());
  } else {
    Logger.log('尚未建立試算表，請先送出一筆訂單。');
  }
}
