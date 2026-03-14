const mongoose = require('mongoose');

/**
 * Business Schema
 * Stores complete business registration information across 4 steps
 */
const businessSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },

    // CreateBusiness (Step 1): Basic Business Details
    legalBusinessName: {
      type: String,
      trim: true,
    },
    proprietorName: {
      type: String,
      trim: true,
    },
    businessPhone: {
      type: String,
    },
    businessEmail: {
      type: String,
      lowercase: true,
    },
    addressLine1: {
      type: String,
      trim: true,
    },
    area: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    pincode: {
      type: String,
    },

    // VerifyBusiness (Step 2): Document & Business Type Details
    businessType: {
      type: String,
      enum: ['Wholesaler', 'Manufacturer', 'Distributor', 'Retailer'],
    },
    gstNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    panNumber: {
      type: String,
    },
    businessLicenceImage: {
      imageURL: {
        type: String,
      },
      publicId: {
        type: String,
      },
    },

    // CreateWareHouse (Step 3): Warehouse Details
    warehouseName: {
      type: String,
      trim: true,
    },
    contactPerson: {
      type: String,
      trim: true,
    },
    fullAddress: {
      type: String,
      trim: true,
    },
    warehouseCity: {
      type: String,
      trim: true,
    },
    warehousePincode: {
      type: String,
    },
    warehouseState: {
      type: String,
      trim: true,
    },
    locationLink: {
      type: String,
      trim: true,
    },

    // Step 4: Distributor Code
    distributorCode: {
      type: String,
      unique: true,
      sparse: true,
    },

    // Registration Status
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Remove __v field from JSON responses
 */
businessSchema.methods.toJSON = function () {
  const business = this.toObject();
  delete business.__v;
  return business;
};

module.exports = mongoose.model('Business', businessSchema);
