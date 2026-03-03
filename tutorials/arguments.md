If you are using minecraft launcher or any other third party launcher other than Rise launcher which is inclueded when you download Rise Client from Vantage, you need to add these extra arguments in order to launch Rise:

`-noverify -XX:+DisableAttachMechanism`

If you are using Minecraft Launcher, this should be your full arguments:

`-XX:+UnlockExperimentalVMOptions -XX:+UseG1GC -XX:G1NewSizePercent=20 -XX:G1ReservePercent=20 -XX:MaxGCPauseMillis=50 -XX:G1HeapRegionSize=16M -Djava.net.preferIPv4Stack=true -noverify -XX:+DisableAttachMechanism`
