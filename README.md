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

3. Reactのビルド
    ```bash
    $ cd frontend
    $ npm run build:watch
    ```
    **※ 開発モード**
    ```bash
    $ cd frontend
    $ npm run build:watch
    ```

## メモ
* DBのテストデータ投入
    ```sql
    INSERT INTO tasks (name, estimated_hours, actual_hours, status) VALUES
    ('親タスク1', 10, 8, 1),
    ('子タスク1', 5, 4, 1),
    ('子タスク2', 5, 6, 0);

    UPDATE tasks SET parent_task_id = 1 WHERE id IN (2, 3);
    ```
