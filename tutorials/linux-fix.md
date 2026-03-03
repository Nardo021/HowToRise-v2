**This fix should be used:**

- If you gets console output containing `java.lang.UnsatisfiedLinkError` (doesn't happen on all Linux distros, however I've had this issue on Fedora)
- If you can't join a Minecraft server (they get a netty error) (happens with every single Linux distro, not specific to Rise, happens when using 1.8.9's netty with Java 21) (another fix is to set `useNativeTransport` to `false` in options.txt)

## Steps

1. Download [this patch (Google Drive)](https://drive.google.com/file/d/14DdNp8ZxPnQrHmq5S1XjaZ0n4Tjss1mA/view?usp=sharing) | [Backup link (Google Drive)](https://drive.google.com/file/d/148BlSE44OCzyJ_PGhLZaGVAyokG8m5MT/view?usp=sharing)
2. Move the zip into the Rise directory, so that the zip ends up in the same directory as `Start MacOS ARM.sh`
3. Open a new terminal
4. `cd` into that directory, depending on its location (example: `cd "Downloads/Rise v6 New"`)
5. Run `unzip rise-linux-x64-patch.zip`
6. Run `./start-linux-x64.sh` when you want to start Rise

Note: The `unzip` step should only be done once
