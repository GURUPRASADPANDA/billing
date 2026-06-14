require('dotenv').config();
const mongoose = require('mongoose');

async function fixIndexes() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // --- Fix Bills Collection ---
    const billsCollection = mongoose.connection.collection('bills');
    const billIndexes = await billsCollection.indexes();
    if (billIndexes.some(i => i.name === 'billNumber_1')) {
      await billsCollection.dropIndex('billNumber_1');
      console.log(`✅ Successfully dropped old index: billNumber_1 from bills collection`);
    }

    // --- Fix Items Collection ---
    const itemsCollection = mongoose.connection.collection('items');
    const itemIndexes = await itemsCollection.indexes();
    if (itemIndexes.some(i => i.name === 'name_1')) {
      await itemsCollection.dropIndex('name_1');
      console.log(`✅ Successfully dropped old index: name_1 from items collection`);
    }

    // Trigger mongoose index creation for all models
    const Bill = require('../models/Bill');
    const Item = require('../models/Item');
    const Party = require('../models/Party');
    const Profile = require('../models/Profile');
    const Counter = require('../models/Counter');
    
    await Promise.all([
      Bill.syncIndexes(),
      Item.syncIndexes(),
      Party.syncIndexes(),
      Profile.syncIndexes(),
      Counter.syncIndexes(),
    ]);
    
    console.log('✅ Synced new indexes from schema for all models');
    console.log('🎉 Index fix completed successfully!');
  } catch (err) {
    console.error('🔥 Index fix failed:', err);
  } finally {
    mongoose.connection.close();
  }
}

fixIndexes();
