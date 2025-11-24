import { config } from 'dotenv';
import path from 'path';

// Load .env.local
config({ path: path.resolve(process.cwd(), '.env.local') });

const required = ['ALIPAY_APP_ID', 'ALIPAY_PRIVATE_KEY', 'ALIPAY_PUBLIC_KEY'];
const missing = required.filter(key => !process.env[key]);

if (missing.length > 0) {
    console.error('❌ Configuration missing:', missing.join(', '));
    console.log('Please add these to your .env.local file.');
    process.exit(1);
}

console.log('✅ Alipay configuration is present!');
console.log('App ID:', process.env.ALIPAY_APP_ID);
console.log('Gateway:', process.env.ALIPAY_GATEWAY || 'Default (Sandbox)');
