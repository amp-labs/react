To integrate VSCode with this repo's `eslint` settings, please add these settings to your VSCode `settings.json` file.

```json
{
  "eslint.format.enable": true,
  "eslint.validate": ["typescript", "typescriptreact"],
  "editor.rulers": [100],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```