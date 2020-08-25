import * as dotenv from 'dotenv';
import StellarClient from './client/StellarClient';
import { owners } from './Config';

dotenv.config({ path: './.env' });
const token = process.env.DISCORD_TOKEN;

const client: StellarClient = new StellarClient({ token, owners });
client.start();
