const Product = require('../models/Product');
const Transaction = require('../models/Transaction');

exports.addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 25;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find().skip(skip).limit(limit),
      Product.countDocuments()
    ]);

    res.status(200).json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) return res.status(404).json({ msg: "Product not found" });
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "Product not found" });
    res.status(200).json({ msg: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.sellProduct = async (req, res) => {
  try {
    const { quantity } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product || product.stockQuantity < quantity) {
      return res.status(400).json({ msg: 'Invalid quantity or product not found' });
    }

    product.stockQuantity -= quantity;
    product.itemsSold += quantity;
    await product.save();

    await Transaction.create({
      productId: product._id,
      quantitySold: quantity,
      saleAmount: quantity * product.price
    });

    res.status(200).json({ msg: 'Sale recorded successfully', product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
