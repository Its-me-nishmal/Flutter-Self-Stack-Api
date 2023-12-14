import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const productSchema = new mongoose.Schema({
    id: {
      type: String,
      default: () => `seeds-pro-${uuidv4()}`,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
    },
    size: {
      type: String,
    },
    height: {
      type: Number,
    },
  });  

const Product = mongoose.model('Product', productSchema);

export default Product;
