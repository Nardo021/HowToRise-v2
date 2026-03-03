**适用以下情况时请使用此修复方法：**

- 控制台输出中包含 `java.lang.UnsatisfiedLinkError`（并非所有 Linux 发行版都会出现，但我在 Fedora 上遇到过此问题）
- 无法加入 Minecraft 服务器（出现 Netty 错误）（所有 Linux 发行版均可能出现，并非 Rise 特有问题，使用 Java 21 运行 1.8.9 的 Netty 时会发生）（另一个解决方法是将 options.txt 中的 `useNativeTransport` 设置为 `false`）

## 操作步骤

1. 下载 [此补丁（Google Drive）](https://drive.google.com/file/d/14DdNp8ZxPnQrHmq5S1XjaZ0n4Tjss1mA/view?usp=sharing) | [备用链接（Google Drive）](https://drive.google.com/file/d/148BlSE44OCzyJ_PGhLZaGVAyokG8m5MT/view?usp=sharing)
2. 将压缩包移入 Rise 目录，使其与 `Start MacOS ARM.sh` 位于同一目录
3. 打开新的终端
4. 使用 `cd` 命令进入该目录（例如：`cd "Downloads/Rise v6 New"`）
5. 运行 `unzip rise-linux-x64-patch.zip`
6. 需要启动 Rise 时，运行 `./start-linux-x64.sh`

注意：`unzip` 步骤只需执行一次
