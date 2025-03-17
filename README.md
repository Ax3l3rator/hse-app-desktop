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
gh release upload <your.version.here> '.\release\<your.version.here>\HSE App Desktop_<your.version.here>_setup.exe'
```
