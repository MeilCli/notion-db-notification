# notion-db-notification
This cli tool is that notify created or updated page of notion database. When you run the CLI tool, it will notify you of changes since the last time you ran it.

## Usage
### Setup
Create config file:
```yml
scheme: 'v0'
notion:
  token: 'notion_token' # your notion token
  interval: 1000
store:
  type: 'file'
  path: 'path' # path of cli tool's state file
senders:
  - type: 'slack'
    token: 'slack_token' # your slack token, required scope is chat:write
channels:
  - name: 'name' # channel name
    slack_id: 'slack_id' # your slack channel id
sources:
  - database: 'database_id' # your notion database id
    channel: 'channel_name' # channel name
```

### Initialization
`notion-db-notification {config_yml_file_to_path} -i`

### Running
`notion-db-notification {config_yml_file_to_path}`

if you want to dry-run: you can use `-d` option  
`notion-db-notification {config_yml_file_to_path} -d`

## License
This repository is under MIT License

including libraries:
- [makenotion/notion-sdk-js](https://github.com/makenotion/notion-sdk-js), published by [MIT License](https://github.com/makenotion/notion-sdk-js/blob/main/LICENSE)
- [nodeca/js-yaml](https://github.com/nodeca/js-yaml), published by [MIT License](https://github.com/nodeca/js-yaml/blob/master/LICENSE)
- [slackapi/node-slack-sdk](https://github.com/slackapi/node-slack-sdk), published by [MIT License](https://github.com/slackapi/node-slack-sdk/blob/main/LICENSE)