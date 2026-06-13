const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // will now be e.g. "billNumber_userid"
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seq: { type: Number, default: 0 },
    reusable: { type: [Number], default: [] }
  },
  { timestamps: true }
);

// 🔢 Get next bill number (reuse OR increment + auto reset)
counterSchema.statics.getNextSequence = async function (name, userId) {
  const Bill = mongoose.model('Bill');
  const counterId = `${name}_${userId}`;

  // ✅ STEP 1: Check if any bills exist FOR THIS USER
  const totalBills = await Bill.countDocuments({ userId });

  let counter = await this.findById(counterId);

  // ✅ STEP 2: If NO bills exist → RESET counter
  if (totalBills === 0) {
    if (!counter) {
      counter = await this.create({ _id: counterId, userId, seq: 1, reusable: [] });
      return 1;
    }

    counter.seq = 1;
    counter.reusable = [];
    await counter.save();

    return 1;
  }

  // If counter doesn't exist
  if (!counter) {
    counter = await this.create({ _id: counterId, userId, seq: 1, reusable: [] });
    return 1;
  }

  // ✅ CASE 1: Reuse deleted numbers
  if (counter.reusable.length > 0) {
    const smallest = Math.min(...counter.reusable);

    await this.findByIdAndUpdate(counterId, {
      $pull: { reusable: smallest }
    });

    return smallest;
  }

  // ✅ CASE 2: Increment safely
  const updated = await this.findByIdAndUpdate(
    counterId,
    { $inc: { seq: 1 } },
    { new: true }
  );

  return updated.seq;
};

// ➕ Add reusable number when bill is deleted
counterSchema.statics.addReusableNumber = async function (name, userId, number) {
  if (!number || number <= 0) return;
  const counterId = `${name}_${userId}`;

  await this.findByIdAndUpdate(
    counterId,
    {
      $addToSet: { reusable: number },
      $setOnInsert: { userId } // make sure userId is set if upserted
    },
    { upsert: true }
  );
};

// 🧹 Clean reusable numbers
counterSchema.statics.cleanReusable = async function (name, userId) {
  const counterId = `${name}_${userId}`;
  const counter = await this.findById(counterId);
  if (!counter) return;

  const cleaned = [...new Set(counter.reusable.filter(n => n > 0))];

  counter.reusable = cleaned;
  await counter.save();
};


module.exports = mongoose.model('Counter', counterSchema);