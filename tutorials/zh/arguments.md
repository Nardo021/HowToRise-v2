如果你使用的是 Minecraft 启动器或其他第三方启动器（而非从 Vantage 下载 Rise 客户端时附带的 Rise 启动器），你需要添加以下额外启动参数才能启动 Rise：

`-noverify -XX:+DisableAttachMechanism`

如果你使用的是 Minecraft 启动器，完整参数应为：

`-XX:+UnlockExperimentalVMOptions -XX:+UseG1GC -XX:G1NewSizePercent=20 -XX:G1ReservePercent=20 -XX:MaxGCPauseMillis=50 -XX:G1HeapRegionSize=16M -Djava.net.preferIPv4Stack=true -noverify -XX:+DisableAttachMechanism`
