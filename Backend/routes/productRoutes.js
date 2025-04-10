const express = require('express');
const router = express.Router();
const {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  sellProduct
} = require('../controllers/productController');
const auth = require('../middleware/auth');
const fs = require('fs');
const fastcsv = require('fast-csv');
const multer = require('multer');
const csv = require('csv-parser');
const Product = require('../models/Product');

const upload = multer({ dest: 'uploads/' });

router.post('/', auth, addProduct);
router.get('/', auth, getProducts);
router.put('/:id', auth, updateProduct);
router.delete('/:id', auth, deleteProduct);
router.post('/:id/sell', auth, sellProduct);

router.get('/export/csv', auth, async (req, res) => {
  try {
    const products = await Product.find().lean();
    console.log("Exporting Products:", products.length, products);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=products.csv');

    const csvStream = fastcsv.format({ headers: true });
    csvStream.pipe(res);

    products.forEach(product => csvStream.write(product));
    csvStream.end();
  } catch (err) {
    console.error('CSV export error:', err);
    res.status(500).json({ error: 'Failed to export CSV' });
  }
});


router.post('/import/csv', auth, upload.single('file'), async (req, res) => {
  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        const productsToInsert = [];

        for (let row of results) {
          // Skip empty rows
          if (Object.values(row).every(val => val.trim?.() === '')) continue;

          // Normalize and trim all fields
          const name = row.name?.trim();
          const sku = row.sku?.trim() || '';
          const category = row.category?.trim() || 'Uncategorized';
          const price = parseFloat(row.price);
          const stockQuantity = parseInt(row.stockQuantity || row.quantity); // supports both
          const itemsSold = parseInt(row.itemsSold) || 0;
          const description = row.description?.trim() || '';

          // Validate required fields
          if (!name || isNaN(price) || isNaN(stockQuantity)) {
            console.warn('Skipping invalid row:', row);
            continue;
          }

          productsToInsert.push({
            name,
            sku,
            category,
            price,
            stockQuantity,
            itemsSold,
            description
          });
        }

        if (productsToInsert.length > 0) {
          await Product.insertMany(productsToInsert);
        }

        // Clean up uploaded file
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('File deletion error:', err);
        });

        res.status(201).json({
          message: 'CSV Imported Successfully',
          inserted: productsToInsert.length,
          skipped: results.length - productsToInsert.length
        });
      } catch (err) {
        console.error('CSV Import Error:', err);
        res.status(500).json({ error: 'CSV Import Failed' });
      }
    });
});


module.exports = router;
