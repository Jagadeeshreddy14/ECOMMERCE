const mongoose=require("mongoose")
const {Schema}=mongoose

const productSchema= new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
        min: 0
    },
    discountPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    discountedPrice: {
        type: Number,
        default: function() {
            return this.price * (1 - this.discountPercentage / 100);
        }
    },
    category:{
        type:Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },
    brand:{
        type:Schema.Types.ObjectId,
        ref:"Brand",
        required:true
    },
    stock: {
        quantity: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },
        status: {
            type: String,
            enum: ['In Stock', 'Low Stock', 'Out of Stock'],
            default: 'Out of Stock'
        },
        lowStockThreshold: {
            type: Number,
            default: 5
        }
    },
    stockHistory: [{
        quantity: Number,
        type: String, // 'add' or 'remove'
        reason: String, // 'order', 'admin-update', 'return'
        date: {
            type: Date,
            default: Date.now
        }
    }],
    thumbnail:{
        type:String,
        required:true
    },
    images:{
        type:[String],
        required:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},{timestamps:true,versionKey:false})

// Pre-save middleware to update stock status
productSchema.pre('save', function(next) {
    if (this.stock.quantity <= 0) {
        this.stock.status = 'Out of Stock';
    } else if (this.stock.quantity <= this.stock.lowStockThreshold) {
        this.stock.status = 'Low Stock';
    } else {
        this.stock.status = 'In Stock';
    }
    next();
});

// Method to update stock
productSchema.methods.updateStock = async function(quantity, type, reason) {
    if (type === 'remove' && quantity > this.stock.quantity) {
        throw new Error('Insufficient stock');
    }

    this.stock.quantity = type === 'add' ? 
        this.stock.quantity + quantity : 
        this.stock.quantity - quantity;

    this.stockHistory.push({
        quantity,
        type,
        reason
    });

    await this.save();
};

module.exports=mongoose.model('Product',productSchema)