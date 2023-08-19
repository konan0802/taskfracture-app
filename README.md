# TaskFracture
タスク管理アプリ「TaskFracture」のREADMEです。

## 開発環境
* Docker
* Python（Flask）
* MySQL
* ローカル開発環境: macOS (Docker)

## セットアップ方法
1. リポジトリのクローン:
    ```bash
    $ git clone [your-repo-url] taskfracture-app
    $ cd taskfracture-app
    ```

2. Docker Compose を使用してアプリケーションとデータベースを起動:
    ```bash
    $ docker-compose up
    ```
    ブラウザで http://localhost:8080/ にアクセスするとアプリケーションにアクセスできます。