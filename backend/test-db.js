import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();
dns.setDefaultResultOrder('ipv4first');

const test = async () => {
    try {
        console.log('Testing connection to:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connection Suceeded!');
        process.exit(0);
    } catch (e) {
        console.error('❌ Connection Failed:', e.message);
        process.exit(1);
    }
};

test();
