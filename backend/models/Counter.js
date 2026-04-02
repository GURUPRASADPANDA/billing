const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // e.g. "bill"
    seq: { type: Number, default: 0 },     // last max number used
    reusable: { type: [Number], default: [] } // deleted numbers
  },
  { timestamps: true }
);


// 🔢 Get next bill number (reuse OR increment + auto reset)
counterSchema.statics.getNextSequence = async function (name) {
  const Bill = mongoose.model('Bill'); // access Bill model

  // ✅ STEP 1: Check if any bills exist
  const totalBills = await Bill.countDocuments();

  let counter = await this.findById(name);

  // ✅ STEP 2: If NO bills exist → RESET counter
  if (totalBills === 0) {
    if (!counter) {
      counter = await this.create({ _id: name, seq: 1, reusable: [] });
      return 1;
    }

    counter.seq = 1;
    counter.reusable = [];
    await counter.save();

    return 1;
  }

  // If counter doesn't exist
  if (!counter) {
    counter = await this.create({ _id: name, seq: 1, reusable: [] });
    return 1;
  }

  // ✅ CASE 1: Reuse deleted numbers
  if (counter.reusable.length > 0) {
    const smallest = Math.min(...counter.reusable);

    await this.findByIdAndUpdate(name, {
      $pull: { reusable: smallest }
    });

    return smallest;
  }

  // ✅ CASE 2: Increment safely
  const updated = await this.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true }
  );

  return updated.seq;
};


// ➕ Add reusable number when bill is deleted
counterSchema.statics.addReusableNumber = async function (name, number) {
  if (!number || number <= 0) return;

  await this.findByIdAndUpdate(
    name,
    {
      $addToSet: { reusable: number }
    },
    { upsert: true }
  );
};


// 🧹 Clean reusable numbers
counterSchema.statics.cleanReusable = async function (name) {
  const counter = await this.findById(name);
  if (!counter) return;

  const cleaned = [...new Set(counter.reusable.filter(n => n > 0))];

  counter.reusable = cleaned;
  await counter.save();
};


module.exports = mongoose.model('Counter', counterSchema);