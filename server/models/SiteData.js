import mongoose from 'mongoose';

const siteDataSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'main_site_data',
      unique: true
    },
    categories: {
      type: Array,
      default: []
    },
    homepageHeroBanners: {
      type: Array,
      default: []
    },
    softwareBanners: {
      type: Array,
      default: []
    },
    softwareProducts: {
      type: Array,
      default: []
    },
    teamMembers: {
      type: Array,
      default: []
    },
    settings: {
      type: Object,
      default: {
        adminEmail: 'bizparkstudio@gmail.com',
        whatsappNumber: '+94 72 954 5538',
        phone: '+94 72 954 5538',
        address: 'Colombo, Sri Lanka',
        web3formsKey: '68a920d3-df9e-456d-84d8-feb25b489cd5',
        linkedin: 'https://www.linkedin.com/company/bizparkstudio/',
        facebook: 'https://www.facebook.com/bizparkstudio',
        instagram: 'https://www.instagram.com/bizparkstudio',
        tiktok: 'https://www.tiktok.com/@bizpark_studio'
      }
    }
  },
  {
    timestamps: true,
    strict: false
  }
);

export const SiteData = mongoose.model('SiteData', siteDataSchema);
