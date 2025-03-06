# Azure secrets-to-environment
This project is a [Protocol Extension](https://docs.harperdb.io/docs/developers/components/reference#protocol-extension) that accesses an Azure key vault and assigns the keys to environment variables.

## Installation
Install this package in your Harper application: `npm install --save @harperdb/azure-secrets-to-environment`

## Configuration

After installation, add the extension (`@harperdb/azure-secrets-to-environment`) into your application's `config.yaml` file.
This component must be listed above the component that will access the environment variables:
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

### Environment variables
This project relies on environment variables to properly access the desired Azure key vault.  Please note this project relies on an Azure application registration for credentials.

#### From 1.2.0 on

* AZURE_VAULT_NAME - (required) Name of the Azure Key Vault holding the secrets
* AZURE_TENANT_ID - (required if vault map not provided) Tenant ID of the Azure Subscription
* AZURE_CLIENT_ID - (required if vault map not provided) Client ID of the application registration
* AZURE_CLIENT_SECRET - (required if vault map not provided) Client Secret of the application registration
* SECRETS_LIST - (optional) Comma seperated list of secrets to access from the vault
* AZURE_VAULT_MAP - (optional) A JSON object with multiple credentials. See [Vault Map](#vault-map)

##### Vault Map

In order to support cases where users want to load vaults dynamically (per worker start) and we don't want to expose vault credentials,
a JSON object can be provided with following structure:

```
{
  ...
  "AZURE_VAULT_NAME": {
    "AZURE_TENANT_ID": "AZURE_TENANT_ID",
    "AZURE_CLIENT_ID": "AZURE_CLIENT_ID",
    "AZURE_CLIENT_SECRET": "AZURE_CLIENT_SECRET"
  },
  ...
}
```

You can still provide all the below variables and expect backward-compatible behavior.

#### Before 1.2.0

* AZURE_VAULT_NAME - (required) Name of the Azure Key Vault holding the secrets
* AZURE_TENANT_ID - (required) Tenant ID of the Azure Subscription
* AZURE_CLIENT_ID - (required) Client ID of the application registration
* AZURE_CLIENT_SECRET - (required) Client Secret of the application registration
* SECRETS_LIST - (optional) Comma seperated list of secrets to access from the vault