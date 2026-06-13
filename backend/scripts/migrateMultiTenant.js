require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Bill = require('../models/Bill');
const Item = require('../models/Item');
const Party = require('../models/Party');
const Profile = require('../models/Profile');
const Counter = require('../models/Counter');

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // 1. Create or find mahavir user
    let user = await User.findOne({ username: 'mahavir' });
    if (!user) {
      user = new User({
        username: 'mahavir',
        password: '1977'
      });
      await user.save();
      console.log('✅ Created user: mahavir');
    } else {
      console.log('⚡ User mahavir already exists');
    }

    const userId = user._id;

    // 2. Update Bills
    const billsResult = await Bill.updateMany(
      { userId: { $exists: false } },
      { $set: { userId } }
    );
    console.log(`✅ Updated Bills: ${billsResult.modifiedCount}`);

    // 3. Update Items
    const itemsResult = await Item.updateMany(
      { userId: { $exists: false } },
      { $set: { userId } }
    );
    console.log(`✅ Updated Items: ${itemsResult.modifiedCount}`);

    // 4. Update Parties
    const partiesResult = await Party.updateMany(
      { userId: { $exists: false } },
      { $set: { userId } }
    );
    console.log(`✅ Updated Parties: ${partiesResult.modifiedCount}`);

    // 5. Update Profile
    const profileResult = await Profile.updateMany(
      { userId: { $exists: false } },
      { $set: { userId } }
    );
    console.log(`✅ Updated Profiles: ${profileResult.modifiedCount}`);

    // 6. Migrate Counter
    const globalCounter = await Counter.findById('billNumber');
    if (globalCounter && !globalCounter.userId) {
      // It's the old global counter
      const newCounterId = `billNumber_${userId}`;
      await Counter.create({
        _id: newCounterId,
        userId: userId,
        seq: globalCounter.seq,
        reusable: globalCounter.reusable
      });
      await Counter.findByIdAndDelete('billNumber');
      console.log(`✅ Migrated Counter to tenant specific: ${newCounterId}`);
    } else {
      console.log('⚡ Counter already migrated or does not exist');
    }

    console.log('🎉 Migration completed successfully!');
  } catch (err) {
    console.error('🔥 Migration failed:', err);
  } finally {
    mongoose.connection.close();
  }
}

migrate();
