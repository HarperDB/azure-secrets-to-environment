# Azure secrets-to-environment
This project accesses an Azure key vault and assigns the keys to environment variables.

This project executes as a dependency in HarperDB component and needs to be the first dependency to load in order to ensure the environment variables are loaded prior to being accessed.
## Installation
Go into the HarperDB application you are building and install this package and add it to the config.yaml file:

1. Install:
`npm install --save @harperdb/azure-secrets-to-environment`

2. Add to config.yaml. `@harperdb/azure-secrets-to-environment` must be the first dependency listed:
```
'@harperdb/azure-secrets-to-environment':
  package: '@harperdb/azure-secrets-to-environment'
'@harperdb/http-router':
  package: '@harperdb/http-router'
  files: '*.*js' # to load the routes.js and config files
'@harperdb/nextjs':
  package: '@harperdb/nextjs'
  files: '/*'
```


## Environment variables
This project relies on environment variables to properly access the desired Azure key vault.  Please note this project relies on an Azure application registration for credentials.

* AZURE_VAULT_NAME - (required) Name of the Azure Key Vault holding the secrets
* AZURE_TENANT_ID - (required) Tenant ID of the Azure Subscription
* AZURE_CLIENT_ID - (required) Client ID of the application registration
* AZURE_CLIENT_SECRET - (required) Client Secret of the application registration
* SECRETS_LIST - (optional) Comma seperated list of secrets to access from the vault
