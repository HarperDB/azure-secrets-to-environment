import { isMainThread } from 'node:worker_threads';
import { ClientSecretCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";

const AZURE_VAULT_NAME = process.env.AZURE_VAULT_NAME;
const AZURE_TENANT_ID = process.env.AZURE_TENANT_ID;
const AZURE_CLIENT_ID = process.env.AZURE_CLIENT_ID;
const AZURE_CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET;
//comma seperated list of secrets
const SECRETS_LIST = process.env.SECRETS_LIST?.split(',');

if(isMainThread) {
  try {
    //validate that AZURE_VAULT_NAME, AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET are defined.
    if (!AZURE_VAULT_NAME) {
      throw new Error('AZURE_VAULT_NAME is required.');
    }

    if (!AZURE_TENANT_ID) {
      throw new Error('AZURE_TENANT_ID is required.');
    }

    if (!AZURE_CLIENT_ID) {
      throw new Error('AZURE_CLIENT_ID is required.');
    }

    if (!AZURE_CLIENT_SECRET) {
      throw new Error('AZURE_CLIENT_SECRET is required.');
    }

    // Configure vault URL
    const vaultUrl = `https://${AZURE_VAULT_NAME}.vault.azure.net`;

    //Set credentials based on Service Registration
    const credential = new ClientSecretCredential(
      AZURE_TENANT_ID,
      AZURE_CLIENT_ID,
      AZURE_CLIENT_SECRET,
    );

    // Create authenticated secret client
    const client = new SecretClient(vaultUrl, credential);

    if(SECRETS_LIST?.length > 0) {
      for (const secret_name of SECRETS_LIST) {
        let secret = await client.getSecret(secret_name);
        //set secret to process.env
        process.env[secret.name] = secret.value;
      }
    } else {
      //if there is no predefined list of secrets iterate all secrets in vault
      for await (let secretProperties of client.listPropertiesOfSecrets()) {
        let secret = await client.getSecret(secretProperties.name);
        //set secret to process.env
        process.env[secret.name] = secret.value;
      }
    }
  } catch (error) {
    console.error(`Unable to access Azure Secrets Vault due to: ${error.message}`);
  }
}