const { Schema, default: mongoose } = require("mongoose")
const Product=require("../models/Product")

exports.create = async (req, res) => {
  try {
    // Validate image URLs
    const validateImageUrl = (url) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    if (!req.body.thumbnail || !validateImageUrl(req.body.thumbnail)) {
      return res.status(400).json({ 
        message: 'Valid thumbnail URL is required' 
      });
    }

    const validImages = req.body.images.filter(validateImageUrl);
    if (!validImages.length) {
      return res.status(400).json({ 
        message: 'At least one valid image URL is required' 
      });
    }

    const productData = {
      ...req.body,
      price: parseFloat(req.body.price),
      discountPercentage: parseFloat(req.body.discountPercentage) || 0,
      stockQuantity: parseInt(req.body.stockQuantity) || 0,
      images: validImages
    };

    const product = new Product(productData);
    await product.save();
    
    // Populate brand and category
    const populatedProduct = await Product.findById(product._id)
      .populate('brand')
      .populate('category');

    res.status(201).json(populatedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      message: 'Error adding product, please try again later',
      error: error.message
    });
  }
};

exports.getAll = async (req, res) => {
    try {
        const filter={}
        const sort={}
        let skip=0
        let limit=0

        if(req.query.brand){
            filter.brand={$in:req.query.brand}
        }

        if(req.query.category){
            filter.category={$in:req.query.category}
        }

        if(req.query.user){
            filter['isDeleted']=false
        }

        if(req.query.sort){
            sort[req.query.sort]=req.query.order?req.query.order==='asc'?1:-1:1
        }

        if(req.query.page && req.query.limit){

            const pageSize=req.query.limit
            const page=req.query.page

            skip=pageSize*(page-1)
            limit=pageSize
        }

        const totalDocs=await Product.find(filter).sort(sort).populate("brand").countDocuments().exec()
        const results=await Product.find(filter).sort(sort).populate("brand").skip(skip).limit(limit).exec()

        res.set("X-Total-Count",totalDocs)

        res.status(200).json(results)
    
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error fetching products, please try again later'})
    }
};

exports.getById=async(req,res)=>{
    try {
        const {id}=req.params
        const result=await Product.findById(id).populate("brand").populate("category")
        res.status(200).json(result)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error getting product details, please try again later'})
    }
}

exports.updateById=async(req,res)=>{
    try {
        const {id}=req.params
        const updated=await Product.findByIdAndUpdate(id,req.body,{new:true})
        res.status(200).json(updated)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error updating product, please try again later'})
    }
}

exports.undeleteById=async(req,res)=>{
    try {
        const {id}=req.params
        const unDeleted=await Product.findByIdAndUpdate(id,{isDeleted:false},{new:true}).populate('brand')
        res.status(200).json(unDeleted)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error restoring product, please try again later'})
    }
}

exports.deleteById=async(req,res)=>{
    try {
        const {id}=req.params
        const deleted=await Product.findByIdAndUpdate(id,{isDeleted:true},{new:true}).populate("brand")
        res.status(200).json(deleted)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error deleting product, please try again later'})
    }
}

exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    const products = await Product.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ]
    })
    .populate('brand')
    .limit(10);
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStock = async (req, res) => {
    try {
        const { quantity, type, reason } = req.body;
        const product = await Product.findById(req.params.id);
        
        if (!product) throw new Error('Product not found');

        await product.updateStock(quantity, type, reason);
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


