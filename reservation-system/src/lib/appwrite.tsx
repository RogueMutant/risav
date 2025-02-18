import { Client, Account } from "appwrite";

export const client = new Client();
export const BUCKET_ID_RESOURCE = "67b330910029cc11aa0d";
export const BUCKET_ID_USER_IMAGE = "67af90b7003376ac64cf";
export const bucket_endpoint_url = "https://cloud.appwrite.io/v1";
client.setEndpoint(bucket_endpoint_url).setProject("678128fa0032bdd179a3");

export const account = new Account(client);
export { ID } from "appwrite";
