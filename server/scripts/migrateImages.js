import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { UploadedImage } from '../models/UploadedImage.js';
import { SiteData } from '../models/SiteData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const DEFAULT_MONGODB_URI = 'mongodb+srv://anuradha:anuradha@anuradha.av9fjk8.mongodb.net/bizpark_studio?retryWrites=true&w=majority';
const rawUri = (process.env.MONGODB_URI && process.env.MONGODB_URI.trim()) || DEFAULT_MONGODB_URI;
const MONGODB_URI = rawUri.replace(/^["']|["']$/g, '').trim();

async function migrate() {
  console.log('🔗 Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI, { dbName: 'bizpark_studio', serverSelectionTimeoutMS: 15000 });
  console.log('✓ Connected to bizpark_studio database');

  const siteDoc = await SiteData.findOne({ key: 'main_site_data' });
  if (!siteDoc) {
    console.log('❌ No main_site_data document found in sitedatas');
    await mongoose.disconnect();
    return;
  }

  const rawBefore = JSON.stringify(siteDoc.toObject());
  const sizeBeforeKb = Math.round(rawBefore.length / 1024);
  console.log(`📊 Current SiteData size: ${sizeBeforeKb} KB (${rawBefore.length} bytes)`);

  let extractedCount = 0;
  const imageCache = new Map(); // Cache identical base64 strings to avoid duplicates

  async function offloadBase64(val) {
    if (typeof val !== 'string' || !val.startsWith('data:image/') && !val.startsWith('data:video/')) {
      return val;
    }

    if (imageCache.has(val)) {
      return imageCache.get(val);
    }

    const matches = val.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) {
      return val;
    }

    const contentType = matches[1];
    const base64Data = matches[2];

    const imgDoc = await UploadedImage.create({
      data: base64Data,
      contentType,
      size: Buffer.byteLength(base64Data, 'base64')
    });

    const newUrl = `/api/images/${imgDoc._id}`;
    imageCache.set(val, newUrl);
    extractedCount++;
    console.log(`   ✓ Extracted image #${extractedCount}: ${contentType} (${Math.round(val.length / 1024)} KB) -> ${newUrl}`);
    return newUrl;
  }

  async function processDeep(obj) {
    if (!obj || typeof obj !== 'object') return obj;

    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        if (typeof obj[i] === 'string') {
          obj[i] = await offloadBase64(obj[i]);
        } else if (typeof obj[i] === 'object') {
          obj[i] = await processDeep(obj[i]);
        }
      }
      return obj;
    }

    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === 'string') {
        obj[key] = await offloadBase64(obj[key]);
      } else if (typeof obj[key] === 'object') {
        obj[key] = await processDeep(obj[key]);
      }
    }
    return obj;
  }

  const plainDoc = siteDoc.toObject();
  console.log('⏳ Processing categories, banners, products, and team members...');
  
  if (plainDoc.categories) {
    plainDoc.categories = await processDeep(plainDoc.categories);
  }
  if (plainDoc.homepageHeroBanners) {
    plainDoc.homepageHeroBanners = await processDeep(plainDoc.homepageHeroBanners);
  }
  if (plainDoc.softwareBanners) {
    plainDoc.softwareBanners = await processDeep(plainDoc.softwareBanners);
  }
  if (plainDoc.softwareProducts) {
    plainDoc.softwareProducts = await processDeep(plainDoc.softwareProducts);
  }
  if (plainDoc.teamMembers) {
    plainDoc.teamMembers = await processDeep(plainDoc.teamMembers);
  }

  // Save back to SiteData
  const updatedDoc = await SiteData.findOneAndUpdate(
    { key: 'main_site_data' },
    {
      $set: {
        categories: plainDoc.categories,
        homepageHeroBanners: plainDoc.homepageHeroBanners,
        softwareBanners: plainDoc.softwareBanners,
        softwareProducts: plainDoc.softwareProducts,
        teamMembers: plainDoc.teamMembers
      }
    },
    { new: true, returnDocument: 'after' }
  ).lean();

  const rawAfter = JSON.stringify(updatedDoc);
  const sizeAfterKb = Math.round(rawAfter.length / 1024);
  console.log('====================================================');
  console.log(`✅ MIGRATION COMPLETE!`);
  console.log(`📸 Images offloaded to UploadedImage collection: ${extractedCount}`);
  console.log(`📉 SiteData size reduced: ${sizeBeforeKb} KB → ${sizeAfterKb} KB (Reduced by ${Math.round((1 - sizeAfterKb / sizeBeforeKb) * 100)}%)!`);
  console.log('====================================================');

  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
