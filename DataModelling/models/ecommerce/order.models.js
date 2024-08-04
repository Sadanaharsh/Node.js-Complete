import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },

  quantity: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderPrice: {
      type: Number,
      required: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // orderItems ka type ek array hoga, and each item of array me product and uski quantity rahegi.
    orderItems: {
        // orderItems ka type ek array hoga and uss array ka each item will be of type orderItemSchema
      type: [orderItemSchema],

      // orderItemSchema ko hum internally yahan par bhi define kar sakte the.
    //   type: [
    //     {
    //       productId: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "Product",
    //       },

    //       quantity: {
    //         type: Number,
    //         required: true,
    //       },
    //     },
    //   ],
    },

    address: {
        type: String,
        required: true
    },

    status: {
        type: String,
        // Suppose ki hume choices deni hai, and suppose ki wo choices fixed hai, unn choices ke alawa aap kuch aur nahi rakh sakte.
        // So we define enum, now yeh field required bhi hai and inhi me se choose kar sakte hain.
        enum: ["PENDING", "CANCELLED", "DELIVERED"],
        default: "PENDING",
    }

  },
  { timeStamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
