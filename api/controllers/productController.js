const mongoose = require('mongoose');
const Product = require("../models/product");


exports.createProduct =  (req, res) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  });
  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created product successfully",
        createdProduct: {
            name: result.name,
            price: result.price,
            _id: result._id,
            request: {
                type: 'GET',
                url: "http://localhost:3000/api/products/" + result._id
            }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};


exports.getAllProduct =  (req, res) => {
  Product.find()
    .select("name price _id")
    .exec()
    .then(results => {
      const response = {
        count: results.length,
        products: results.map(result => {
          return {
            name: result.name,
            price: result.price,
            _id: result._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/api/products/" + result._id
            }
          };
        })
      };
      res.status(200).json(response);
     
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};


exports.getOneProduct = (req, res) => {
  const id = req.params.productId;
  
  Product.findById(id)
    .select('name price _id')
    .exec()
    .then(result => {
      console.log("From database", result);
      if (result) {
        res.status(200).json({
            product: result,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/api/products'
            }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};


exports.updateProduct = (req, res) => {
  const id = req.params.productId;

  let options = req.body;
  const updates = {};
 
   for (const option of Object.keys(options)) {
     updates[option] = options[option]
   }

   
  Product.findByIdAndUpdate(
    req.params.productId,
    { $set: updates },
    { new: true, contex: "query" }
  )
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'Product updated',
          request: {
              type: 'GET',
              url: 'http://localhost:3000/api/products/' + id
          }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};


exports.deleteProduct = (req, res) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'Product deleted',
          request: {
              type: 'POST',
              url: 'http://localhost:3000/api/products',
              body: { name: 'String', price: 'Number' }
          }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};