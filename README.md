# HSE DESKTOP APP

Запуск:

```bash
yarn dev
```

Сборка:

```bash
yarn generate
```

## Release publish protocol

### Windows

```bash
gh release create <your.version.here>
```

```bash
gh release upload <your.version.here> '.\release\<your.version.here>\<file here>'
```

```powershell
$version = node -p 'require("./package.json").version'

Get-ChildItem -Path .\release\$version\win -File | ForEach-Object {
    gh release upload $version $_.FullName --clobber
}

Get-ChildItem -Path .\release\$version\linux -File | ForEach-Object {
    gh release upload $version $_.FullName --clobber
}
```
