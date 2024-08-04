import mongoose from "mongoose";
import { SubTodo } from "./sub_todo.models";

const todoSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },

    complete: {
        type: Boolean,
        // hum default value kisi ko bhi de sakte hain.
        default : false,
    },

    createdBy : {
        // Ab yahan par hume user ka reference dena padega ki kaunse user ne banaya hai.
        // Jab dusre model se reference lena ho, tab type ese hi define karte hain.
        type: mongoose.Schema.Types.ObjectId,
        // and next line me reference likhte hain jisme model ka first parameter likhte hain.
        ref: "User"
    },
    
    // Array of Sub-Todos
    subTodos : [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "SubTodo",
        }
    ]
  },
  { timestamps: true }
);

export const Todo = mongoose.model("Todo", todoSchema);
