# HSE DESKTOP APP

## Скачать | Download

[Download from github releases](https://github.com/ax3l3rator/hse-app-desktop/releases/latest)

## Tech info

Запуск:

```bash
yarn dev
```

Сборка:

```bash
yarn generate
```

## Release publishing

### Windows (requires gh)

```powershell
$version = node -p 'require("./package.json").version'

gh release create $version

Get-ChildItem -Path .\release\$version\win -File | ForEach-Object {
    gh release upload $version $_.FullName --clobber
}

Get-ChildItem -Path .\release\$version\linux -File | ForEach-Object {
    gh release upload $version $_.FullName --clobber
}

```

## Комментарии от КТ3

автоматический выбор, авто заказ аудитории, выводы из а следует б в вкр
