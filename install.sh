# !bin/bash

touch hse-app.desktop

DIR="$(dirname -- "${BASH_SOURCE[0]}")" # Get the directory name
DIR="$(realpath -e -- "$DIR")"

cat >./hse-app.desktop <<EOL
[Desktop Entry]
Type=Application
Name=hse-app-desktop
MimeType=x-scheme-handler/ruz-app-fiddle
Exec=$DIR/hse-app-desktop %u
EOL

desktop-file-install --dir=$HOME/.local/share/applications ./hse-app.desktop

update-desktop-database ~/.local/share/applications
