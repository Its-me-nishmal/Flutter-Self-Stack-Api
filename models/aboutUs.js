import mongoose from 'mongoose';

const aboutUsSchema = new mongoose.Schema({
  email: String,
  phoneNumber: String,
  content: String,
  logo: String,
  paraContent: String,
  subtitle: String,
  paraSub: String,
  pointsAndDetails: [{ point: String, details: String }],
  privacyLink: String,
  socialMedia: [{ icon: String, link: String }]
});

const AboutUs = mongoose.model('AboutUs', aboutUsSchema);

export default AboutUs;
