# notion-db-notification
[![CI](https://github.com/MeilCli/notion-db-notification/actions/workflows/ci.yml/badge.svg)](https://github.com/MeilCli/notion-db-notification/actions/workflows/ci.yml) [![npm version](https://badge.fury.io/js/notion-db-notification-cli.svg)](https://badge.fury.io/js/notion-db-notification-cli)  
This cli tool is that notify created or updated page of notion database. 

When you run the CLI tool, it will notify you of changes since the last time you ran it.

## Usage
### Install
`npm install -g notion-db-notification-cli`

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

## Advanced
### Secure token
if you avoid to write token to config file, you can use environment variable.
```yml
notion:
  token: 'env:NOTION_TOKEN' # environment variable name is NOTION_TOKEN
  interval: 1000
```
```yml
senders:
  - type: 'slack'
    token: 'env:SLACK_TOKEN' # environment variable name is SLACK_TOKEN
```

### Ratelimit for Notion API
Notion API has Rate limits.  
ref: https://developers.notion.com/reference/request-limits#rate-limits

So, this tool can be set interval milli seconds for api call.
```yml
notion:
  token: 'notion_token' # your notion token
  interval: 1000 # recommend range of 500~1500
```

## Recipe
### Notify empty title page
config file:
```yml
sources:
  - database: 'database_id' # your notion database id
    channel: 'channel_name' # channel name
    filter: 'page.properties["YOUR_TITLE_PROPERTY_NAME"].title.length == 0' # replace YOUR_TITLE_PROPERTY_NAME
```

## Development
- install: `npm install`
- add package: 
  - `npm init -w packages/xxx`
  - add manually reference at package.json 
  - change properties at new package.json
  - add reference root tsconfig.json
  - `npm run reference`
  - add `npm run copy:xxx` command
  - change `.github/bump.yml`
- publish: `npm publish --access public --workspaces`

## License
This repository is under MIT License

including libraries:
- [makenotion/notion-sdk-js](https://github.com/makenotion/notion-sdk-js), published by [MIT License](https://github.com/makenotion/notion-sdk-js/blob/main/LICENSE)
- [nodeca/js-yaml](https://github.com/nodeca/js-yaml), published by [MIT License](https://github.com/nodeca/js-yaml/blob/master/LICENSE)
- [slackapi/node-slack-sdk](https://github.com/slackapi/node-slack-sdk), published by [MIT License](https://github.com/slackapi/node-slack-sdk/blob/main/LICENSE)