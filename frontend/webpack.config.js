const path = require('path');

module.exports = {
  entry: './src/index.js',  // エントリーポイント（変更する場合あり）
  output: {
    filename: 'main.js',  // 出力されるファイル名
    path: path.resolve(__dirname, '../app/static'),  // 出力先のディレクトリ
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,  // .jsと.jsxファイルを対象とする
        exclude: /node_modules/,  // node_modulesディレクトリは除外
        use: {
          loader: "babel-loader"  // babel-loaderを使用する
        }
      }
      // ...その他のルール
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']  // .jsと.jsxファイルを解決する
  }
};
