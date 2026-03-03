## 方法一：检查游戏设置

#### 1. 打开 Minecraft。
#### 2. 进入「设置」>「音频」。
#### 3. 确认所有音量滑块（如总音量、音乐、环境音效等）未被静音。

## 方法二：下载并安装音效包

#### 1. 下载音效包

点击下方链接下载音效包：

- [从 Discord 下载](https://cdn.discordapp.com/attachments/1265664137652867210/1319283833966956594/Sound_Pack.zip?ex=69741591&is=6972c411&hm=e8f106183cf95c841a2ad8504074f4d4c25195cff4e1930cca7a915463c4f14d&)

#### 2. 安装音效包

1. 打开 Minecraft 游戏目录。
2. 将下载的资源包文件（`Sound Pack.zip`）放入 `resourcepacks` 文件夹。
3. 启动游戏，进入「设置」>「资源包」。
4. 从可用列表中选择新添加的资源包并启用。
5. 保存设置并返回游戏。

## 方法三：手动将文件添加到 JAR 文件中

#### 1. 下载音效包
点击下方链接下载音效包：

- [从 Discord 下载](https://cdn.discordapp.com/attachments/1265664137652867210/1319283833966956594/Sound_Pack.zip?ex=69741591&is=6972c411&hm=e8f106183cf95c841a2ad8504074f4d4c25195cff4e1930cca7a915463c4f14d&)

#### 2. 打开音效包
使用任意压缩软件（如 **7-Zip** 或 **Bandizip**）打开下载的文件。  
其中包含以下文件：  

![Sound Pack.zip 文件](../assets/img/sound3.png)

#### 3. 找到启动器文件夹
- 如果你使用的是 **官方 Rise 启动器**，继续执行第 4 至 7 步。  
- 如果不是，**跳到第 7 步后的说明**。

#### 4. 打开启动器文件夹
进入启动器安装目录（包含 `start.bat` 或 `start_Macos.sh` 的文件夹）：  

![启动器文件夹](../assets/img/sound1.png)

#### 5. 打开 "files" 文件夹
在启动器文件夹内，找到并打开 **files** 文件夹：  

![Files 文件夹](../assets/img/sound2.png)

#### 6. 打开 JAR 文件
像打开 ZIP 文件一样，打开 **Standalone.jar**（方式与打开 `Sound Pack.zip` 相同）。

#### 7. 合并 Assets 文件夹
- 在 `Sound Pack.zip` 中，找到名为 **assets** 的文件夹。  
- 将 **assets 文件夹** 拖放到 `Standalone.jar` 中。  
- **重要：** 不要将其拖入 `Standalone.jar` 的任何子文件夹内。  
- 如有提示，选择 **合并**（而非替换）。  

完成后，`Standalone.jar` 应如下图所示：  

![assets 文件夹](../assets/img/sound4.png)

#### 非 Rise 启动器用户说明
如果你**未使用官方 Rise 启动器**，请跳过第 4 和 5 步，改为在 Minecraft 目录中找到 `Rise.jar`：

- **Minecraft 启动器（Windows）：**  
  `%appdata%/.minecraft/versions/Rise/Rise.jar`

- **Minecraft 启动器（Mac）：**  
  `~/Library/Application Support/Minecraft/versions/Rise/Rise.jar`
