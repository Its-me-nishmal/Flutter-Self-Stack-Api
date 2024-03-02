import mongoose from 'mongoose';

const aboutUsSchema = new mongoose.Schema({
  email: String,
  phoneNumber: String,
  content: String,
  logo: String,
  paraContent: String,
  subtitle: String,
  paraSub: String,
  pointsAndDetails: { 
    type: [{ point: String, details: String }],
    default: []
  },
  privacyLink: String,
  socialMedia: {
    type: [{ icon: String, link: String }],
    default: []
  }
});

const AboutUs = mongoose.model('AboutUs', aboutUsSchema);

export default AboutUs;
