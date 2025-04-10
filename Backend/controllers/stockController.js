const Product = require('../models/Product');

exports.getStockData = async (req, res) => {
  try {
    const products = await Product.find();

    let totalRevenue = 0;
    let totalItemsSold = 0;

    products.forEach(product => {
      totalRevenue += product.itemsSold * product.price;
      totalItemsSold += product.itemsSold;
    });

    res.status(200).json({
      products,
      totalItemsSold,
      totalRevenue
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
