import mongoose from 'mongoose';
import Product from '../models/prodectModel.js';
import httpStatus from 'http-status';

const { OK, INTERNAL_SERVER_ERROR } = httpStatus;

const productGet = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(OK).json(product);
    } catch (err) {
        next(err);
    }
}

const productGetAll = async (req, res, next) => {
    try {
        const products = await Product.find();
        res.status(OK).json(products);
    } catch (err) {
        next(err);
    }
}

const productDelete = async (req, res, next) => {
    try {
        const product = await Product.findOneAndDelete({ id: req.params.id });
        res.status(OK).json(product);
    } catch (err) {
        next(err);
    }
}

const productDeleteAll = async (req, res, next) => {
    try {
        const products = await Product.deleteMany();
        res.status(OK).json(products);
    } catch (err) {
        next(err);
    }
}

const productCreate = async (req, res, next) => {
    try {
        const newProduct = new Product({ ...req.body });
        const savedProduct = await newProduct.save();
        res.status(OK).json(savedProduct);
    } catch (err) {
        next(err);
    }
}

const productCreateMultiple = async (req, res, next) => {
    try {
        const products = req.body.map(product => ({ ...product }));
        const createdProducts = await Product.create(products);
        res.status(OK).json(createdProducts);
    } catch (err) {
        next(err);
    }
}

const productUpdate = async (req, res, next) => {
    try {
        const updatedProduct = await Product.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        res.status(OK).json(updatedProduct);
    } catch (err) {
        next(err);
    }
}

const productUpdateMultiple = async (req, res, next) => {
    try {
        const updates = req.body;
        const updatedProducts = [];

        for (const update of updates) {
            const updatedProduct = await Product.findOneAndUpdate({ id: update.id }, update.fieldsToUpdate, { new: true });
            updatedProducts.push(updatedProduct);
        }

        res.status(OK).json(updatedProducts);
    } catch (err) {
        next(err);
    }
}

const productSearch = async (req, res, next) => {
    try {
        const { name ,price ,color } = req.query;
        const serch_data = {};
        if (name) {serch_data.name = {$regex: new RegExp(name,'i')}}
        if (color) {serch_data.color = {$regex: new RegExp(color,'i')}}
        if (price) {serch_data.price = parseFloat(price)}
        const results = await Product.find(serch_data).select({ _id: 0 });
        res.status(OK).json(results);

    } catch (err) {next(err)}
}

export default {
    productGet,
    productGetAll,
    productDelete,
    productDeleteAll,
    productCreate,
    productUpdate,
    productCreateMultiple,
    productUpdateMultiple,
    productSearch
};
