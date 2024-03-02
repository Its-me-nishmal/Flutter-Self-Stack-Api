import AboutUs from '../models/aboutUs.js';

export const getAboutUs = async (req, res) => {
  try {
    const aboutUs = await AboutUs.findOne();
    res.json(aboutUs);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateAboutUs = async (req, res) => {
  try {
    const updatedAboutUs = await AboutUs.findOneAndUpdate({}, req.body, { new: true });
    res.json(updatedAboutUs);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createAboutUs = async (req, res) => {
    try {
      const newAboutUs = new AboutUs(req.body);
      const savedAboutUs = await newAboutUs.save();
      res.status(201).json(savedAboutUs);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };    