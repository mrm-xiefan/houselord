let CONST = {
  httpTimeout: 120000,
  developHost: 'http://localhost:3000/',
  socketpath: '/socket.io/',
  defaultApp: 'home',
  title: {
    'S001': 'エラー',
    'S002': 'エラー',
    'S003': 'エラー',
    'S004': 'エラー',
    'S005': 'エラー',
    'S006': 'エラー',
    'B001': 'インフォメーション',
    'B002': 'インフォメーション',
    'B003': 'インフォメーション',
    'B004': 'インフォメーション',
    'B005': 'インフォメーション',
    'B006': 'インフォメーション',
    'B007': 'インフォメーション',
    'B008': 'インフォメーション',
    'B009': 'インフォメーション',
    'B010': 'インフォメーション',
    'B011': 'インフォメーション',
    'B012': 'インフォメーション',
    'B013': 'インフォメーション',
    'B900': 'エラー',
    'I001': 'インフォメーション',
    'I002': '確認',
    'I003': '確認',
    'I004': '確認'
  },
  message: {
    'S001': 'ネットワークエラー',
    'S002': '予期せぬエラー',
    'S003': '予期せぬエラー（データベース）',
    'S004': '予期せぬエラー（S3）',
    'S005': '接続が切断されました。',
    'S006': 'アップロードが失敗しました。',
    'B001': 'データがありません。',
    'B002': 'アカウント名もしくはパスワードに誤りがあります。',
    'B003': 'アカウントはすでに存在しています。',
    'B004': '入力エラー',
    'B005': '日付不正！開始日＜＝初回支払日＜＝終了日で入力してください。',
    'B006': '500部屋以上を作成することができません。階層数もしくは部屋数を減らしてください。',
    'B007': 'まだ契約が結ばれていません。',
    'B008': '1階層には99部屋までしか登録できません。',
    'B009': '刻み料金の金額を正しく設定してください。',
    'B010': '初回検針をしてください。',
    'B011': '基本料金に正しい金額を入力してください。不要の場合は0にしてください。',
    'B012': '正しい刻み値を入力してください。',
    'B013': '正しい金額を入力してください。',
    'B900': 'アカウント認証が失敗しました。',
    'I001': '接続が回復しました。',
    'I002': 'データを削除します。よろしいですか？',
    'I003': '契約を解除します。よろしいですか？注意：支払の精算を済ませてから契約の解除をしてください。',
    'I004': 'ルームを削除します。よろしいですか？'
  },
  type: {
    'S001': 'warn',
    'S002': 'warn',
    'S003': 'warn',
    'S004': 'warn',
    'S005': 'warn',
    'S006': 'warn',
    'B001': 'info',
    'B002': 'info',
    'B003': 'info',
    'B004': 'info',
    'B005': 'info',
    'B006': 'info',
    'B007': 'info',
    'B008': 'info',
    'B009': 'info',
    'B010': 'info',
    'B011': 'info',
    'B012': 'info',
    'B013': 'info',
    'B900': 'warn',
    'I001': 'info',
    'I002': 'select',
    'I003': 'select',
    'I004': 'select'
  },
  feeTypes: {
    '1': {'name': '上水道代', 'value': '1', 'type': 'meter', 'unit': true, 'sample': '上水道メーター'},
    '2': {'name': '下水道代', 'value': '2', 'type': 'meter', 'unit': true, 'sample': '下水道メーター'},
    '3': {'name': '電気代', 'value': '3', 'type': 'meter', 'unit': true, 'sample': '電気メーター'},
    '4': {'name': 'ガス代', 'value': '4', 'type': 'meter', 'unit': true, 'sample': 'ガスメーター'},
    '5': {'name': '管理費', 'value': '5', 'type': 'monthly', 'unit': false, 'sample': '管理費'},
    '6': {'name': '共益費', 'value': '6', 'type': 'monthly', 'unit': false, 'sample': '共益費'},
    '7': {'name': '更新料金', 'value': '7', 'type': 'once', 'unit': false, 'sample': '更新料'},
    '8': {'name': 'ネット代', 'value': '8', 'type': 'monthly', 'unit': false, 'sample': 'ネット代'},
    '30': {'name': 'その他月次', 'value': '30', 'type': 'monthly', 'unit': false, 'sample': '月次雑費'},
    '99': {'name': 'その他雑費', 'value': '99', 'type': 'once', 'unit': false, 'sample': 'その他雑費'}
  },
  expenseTypes: {
    '1': {'name': '上水道代', 'value': '1'},
    '2': {'name': '下水道代', 'value': '2'},
    '3': {'name': '電気代', 'value': '3'},
    '4': {'name': 'ガス代', 'value': '4'},
    '5': {'name': '清潔費', 'value': '5'},
    '6': {'name': '品代', 'value': '6'},
    '7': {'name': '修理費用', 'value': '7'},
    '8': {'name': 'メンテ費用', 'value': '8'},
    '9': {'name': 'その他経費', 'value': '9'}
  }
}

export default CONST
