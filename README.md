# Azure secrets-to-environment
This project accesses an Azure key vault and assigns the keys to environment variables.

This project executes as a dependency in HarperDB component and needs to be the first dependency to load in order to ensure the environment variables are loaded prior to being accessed.

## Add dependecy info

## Add config.yaml info

## Environment variables
This project relies on environment variables to properly access the desired Azure key vault.  Please note this project relies on an Azure application registration for credentials.

* AZURE_VAULT_NAME - Name of the Azure Key Vault holding the secrets
* AZURE_TENANT_ID - Tenant ID of the Azure Subscription
* AZURE_CLIENT_ID - Client ID of the application registration
* AZURE_CLIENT_SECRET - Client Secret of the application registration
