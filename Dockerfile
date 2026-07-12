# syntax=docker/dockerfile:1

# Debian 上で Node.js の最新 LTS バージョンを使用する。
# 最新バージョンは以下のリンクで確認できる。
# - Docker Hub (Node.js): https://hub.docker.com/_/node
# - Node.js: https://nodejs.org/ja/about/previous-releases
# - Debian: https://wiki.debian.org/DebianReleases#Current_Debian_Releases_and_repositories
FROM node:26-trixie

# OS レベルの依存関係をインストールする。
# 注: パッケージインストール後、イメージサイズを削減するため apt キャッシュを削除する。
RUN apt-get update && apt-get install -y \
    git \
    sudo \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Azure CLI のインストール
RUN curl -sL https://aka.ms/InstallAzureCLIDeb | bash

# 'node' ユーザーがパスワードなしで sudo コマンドを使えるようにする。
# mkdir -p: 中間ディレクトリをすべて一度に作成する。
# /etc/sudoers.d: 各スーパーユーザーの設定を格納するディレクトリ。
# 0440: 'sudo' コマンドは 0440 以外の権限のファイルを無視する。
RUN mkdir -p /etc/sudoers.d \
    && echo "node ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/node \
    && chmod 0440 /etc/sudoers.d/node
    
# コンテナ内の作業ディレクトリ。ここにアプリケーションコードが配置される。
WORKDIR /app

# Dev Container での処理を可能にするため、workspace の所有者を変更する。
# --> .devcontainer/devcontainer.json を参照。
RUN chown -R node:node /app

# package.json と package-lock.json を作業ディレクトリにコピーし、パッケージをインストールする。
# Angular はバージョン依存関係が非常にシビアなため、意図しない最新バージョンの
# パッケージがインストールされるのを防ぐため 'npm install' は使用しない。
COPY --chown=node:node package*.json ./
USER node
RUN npm ci
USER root

# コンテナ実行時にソースコードはマウントされるため、イメージにはコピーしない。
# COPY . .

# コンテナが以下のポートで待ち受けることを示す。
# コンテナ実行時に -p オプションを指定し、これらのポートをホストマシンにマッピングすることを忘れないこと。
# 4200: Angular 開発サーバーのポート。
EXPOSE 4200 4000

# デフォルト動作 (Do nothing)
CMD ["sleep", "infinity"]

