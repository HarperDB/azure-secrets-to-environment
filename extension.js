import { ClientSecretCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";
import { appendFile, writeFile } from "node:fs/promises"

const { AZURE_VAULT_NAME, AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, SAVE_ENV } = process.env;
//comma seperated list of secrets
const SECRETS_LIST = process.env.SECRETS_LIST?.split(',');

const ERROR_PREAMBLE = 'Unable to access Azure Secrets Vault due to: ';

//validate that AZURE_VAULT_NAME, AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET are defined.
if (!AZURE_VAULT_NAME) {
  throw new Error(`${ERROR_PREAMBLE} AZURE_VAULT_NAME is required.`);
}

if (!AZURE_TENANT_ID) {
  throw new Error(`${ERROR_PREAMBLE} AZURE_TENANT_ID is required.`);
}

if (!AZURE_CLIENT_ID) {
  throw new Error(`${ERROR_PREAMBLE} AZURE_CLIENT_ID is required.`);
}

if (!AZURE_CLIENT_SECRET) {
  throw new Error(`${ERROR_PREAMBLE} AZURE_CLIENT_SECRET is required.`);
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
    try {
      let secret = await client.getSecret(secret_name);
      //set secret to process.env.  Because Azure KV does not support underscores, we put the secret names with dashes.  On retrieval we replace dashes with underscore
      process.env[secret.name.replace(/-/g, '_')] = secret.value;
    } catch (error) {
      console.warn(error.message);
    }
  }
} else {
  if(SAVE_ENV === "true") {
    await writeFile(process.cwd() + '/.env', '', { flags: 'a' });
  }

  //if there is no predefined list of secrets iterate all secrets in vault
  for await (let secretProperties of client.listPropertiesOfSecrets()) {
    let secret = await client.getSecret(secretProperties.name);
    //set secret to process.env. Because Azure KV does not support underscores, we put the secret names with dashes.  On retrieval we replace dashes with underscore
    const secretName = [secret.name.replace(/-/g, '_')];
    process.env[secretName] = secret.value;

    if(SAVE_ENV === "true") {
      await appendFile(process.cwd() + '/.env', `${secretName}=${secret.value}\n`, { flags: 'a' });
    }
  }
}