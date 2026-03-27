# BBMS Backend - Sample Data & Database Guide

## Sample Data Setup

### Creating Initial Data

Create `scripts/seedDatabase.js`:

```javascript
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Donor = require('../models/Donor');
const BloodInventory = require('../models/BloodInventory');
const BloodRequest = require('../models/BloodRequest');
const BloodBank = require('../models/BloodBank');

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data (CAUTION!)
    await Promise.all([
      User.deleteMany({}),
      Donor.deleteMany({}),
      BloodInventory.deleteMany({}),
      BloodRequest.deleteMany({}),
      BloodBank.deleteMany({}),
    ]);

    console.log('Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@bbms.com',
      password: 'admin@123',
      phone: '9999999999',
      role: 'admin',
      status: 'active',
      isVerified: true,
    });

    console.log('✅ Admin created:', adminUser.email);

    // Create 5 donor users
    const donorUsers = await User.insertMany([
      {
        name: 'John Donor',
        email: 'john@example.com',
        password: 'donor@123',
        phone: '9876543210',
        role: 'donor',
        status: 'active',
        isVerified: true,
      },
      {
        name: 'Jane Donor',
        email: 'jane@example.com',
        password: 'donor@123',
        phone: '8765432109',
        role: 'donor',
        status: 'active',
        isVerified: true,
      },
      {
        name: 'Mike Smith',
        email: 'mike@example.com',
        password: 'donor@123',
        phone: '7654321098',
        role: 'donor',
        status: 'active',
        isVerified: true,
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        password: 'donor@123',
        phone: '6543210987',
        role: 'donor',
        status: 'active',
        isVerified: true,
      },
      {
        name: 'David Lee',
        email: 'david@example.com',
        password: 'donor@123',
        phone: '5432109876',
        role: 'donor',
        status: 'active',
        isVerified: true,
      },
    ]);

    console.log('✅ 5 Donor users created');

    // Create donor profiles
    const donors = await Donor.insertMany([
      {
        userId: donorUsers[0]._id,
        bloodType: 'O+',
        dateOfBirth: new Date('1990-05-15'),
        weight: 70,
        height: 180,
        gender: 'male',
        medicalHistory: {
          hasHighBloodPressure: false,
          hasDiabetes: false,
          hasHeartDisease: false,
          medications: 'None',
          allergies: 'None',
        },
        donationHistory: {
          totalDonations: 5,
          lastDonationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          nextEligibleDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        },
        status: 'eligible',
        availability: 'weekends',
        location: {
          address: '123 Main St',
          city: 'Ahmedabad',
          state: 'Gujarat',
          pincode: '380001',
        },
        rewardPoints: 250,
      },
      {
        userId: donorUsers[1]._id,
        bloodType: 'A+',
        dateOfBirth: new Date('1992-08-20'),
        weight: 65,
        height: 165,
        gender: 'female',
        medicalHistory: {
          hasHighBloodPressure: false,
          hasDiabetes: false,
          hasHeartDisease: false,
          medications: 'None',
          allergies: 'Penicillin',
        },
        donationHistory: {
          totalDonations: 3,
          lastDonationDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          nextEligibleDate: new Date(),
        },
        status: 'eligible',
        availability: 'always',
        location: {
          address: '456 Oak Ave',
          city: 'Ahmedabad',
          state: 'Gujarat',
          pincode: '380002',
        },
        rewardPoints: 150,
      },
      {
        userId: donorUsers[2]._id,
        bloodType: 'B+',
        dateOfBirth: new Date('1988-12-10'),
        weight: 75,
        height: 175,
        gender: 'male',
        medicalHistory: {
          hasHighBloodPressure: true,
          hasDiabetes: false,
          hasHeartDisease: false,
          medications: 'BP medication',
          allergies: 'None',
        },
        donationHistory: {
          totalDonations: 1,
          lastDonationDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
          nextEligibleDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        },
        status: 'eligible',
        availability: 'specific_days',
        location: {
          address: '789 Pine Rd',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001',
        },
        rewardPoints: 50,
      },
      {
        userId: donorUsers[3]._id,
        bloodType: 'AB-',
        dateOfBirth: new Date('1995-03-25'),
        weight: 62,
        height: 160,
        gender: 'female',
        medicalHistory: {
          hasHighBloodPressure: false,
          hasDiabetes: false,
          hasHeartDisease: false,
          medications: 'None',
          allergies: 'None',
        },
        donationHistory: {
          totalDonations: 8,
          lastDonationDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
          nextEligibleDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        },
        status: 'eligible',
        availability: 'always',
        location: {
          address: '321 Maple Dr',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
        },
        rewardPoints: 400,
      },
      {
        userId: donorUsers[4]._id,
        bloodType: 'O-',
        dateOfBirth: new Date('1989-07-08'),
        weight: 72,
        height: 178,
        gender: 'male',
        medicalHistory: {
          hasHighBloodPressure: false,
          hasDiabetes: true,
          hasHeartDisease: false,
          medications: 'Diabetes medication',
          allergies: 'None',
        },
        donationHistory: {
          totalDonations: 0,
          lastDonationDate: null,
          nextEligibleDate: new Date(),
        },
        status: 'not_eligible',
        reasonForIneligibility: 'Type 2 Diabetes',
        availability: 'on_demand',
        location: {
          address: '654 Cedar Ln',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110001',
        },
        rewardPoints: 0,
      },
    ]);

    console.log('✅ 5 Donor profiles created');

    // Create blood inventory
    const bloodInventory = await BloodInventory.insertMany([
      {
        bloodType: 'O+',
        quantity: 20,
        unit: 'bags',
        volume: 450,
        collectionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        expiryDate: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000),
        donorId: donors[0]._id,
        donorName: donors[0].userId.name,
        status: 'available',
        testResults: {
          hiv: 'negative',
          hepatitisB: 'negative',
          hepatitisC: 'negative',
          syphilis: 'negative',
          malaria: 'negative',
          testDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
        storage: {
          location: 'Building A',
          shelf: 'A1',
          temperature: 4,
        },
      },
      {
        bloodType: 'A+',
        quantity: 15,
        unit: 'bags',
        volume: 450,
        collectionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        expiryDate: new Date(Date.now() + 39 * 24 * 60 * 60 * 1000),
        donorId: donors[1]._id,
        donorName: donors[1].userId.name,
        status: 'available',
        testResults: {
          hiv: 'negative',
          hepatitisB: 'negative',
          hepatitisC: 'negative',
          syphilis: 'negative',
          malaria: 'negative',
          testDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
        storage: {
          location: 'Building A',
          shelf: 'A2',
          temperature: 4,
        },
      },
      {
        bloodType: 'B+',
        quantity: 8,
        unit: 'bags',
        volume: 450,
        collectionDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        expiryDate: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000),
        donorId: donors[2]._id,
        donorName: donors[2].userId.name,
        status: 'available',
        testResults: {
          hiv: 'negative',
          hepatitisB: 'negative',
          hepatitisC: 'negative',
          syphilis: 'negative',
          malaria: 'negative',
          testDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        },
        storage: {
          location: 'Building B',
          shelf: 'B1',
          temperature: 4,
        },
      },
      {
        bloodType: 'AB-',
        quantity: 5,
        unit: 'bags',
        volume: 450,
        collectionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        expiryDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        donorId: donors[3]._id,
        donorName: donors[3].userId.name,
        status: 'available',
        testResults: {
          hiv: 'negative',
          hepatitisB: 'negative',
          hepatitisC: 'negative',
          syphilis: 'negative',
          malaria: 'negative',
          testDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        storage: {
          location: 'Building B',
          shelf: 'B2',
          temperature: 4,
        },
      },
      {
        bloodType: 'O-',
        quantity: 12,
        unit: 'bags',
        volume: 450,
        collectionDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        donorId: donors[0]._id,
        donorName: donors[0].userId.name,
        status: 'available',
        testResults: {
          hiv: 'negative',
          hepatitisB: 'negative',
          hepatitisC: 'negative',
          syphilis: 'negative',
          malaria: 'negative',
          testDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
        },
        storage: {
          location: 'Building C',
          shelf: 'C1',
          temperature: 4,
        },
      },
    ]);

    console.log('✅ 5 Blood inventory units created');

    // Create recipient user
    const recipientUser = await User.create({
      name: 'Hospital ABC',
      email: 'hospital@abc.com',
      password: 'hospital@123',
      phone: '9111111111',
      role: 'recipient',
      status: 'active',
      isVerified: true,
    });

    // Create blood requests
    const bloodRequests = await BloodRequest.insertMany([
      {
        requesterId: recipientUser._id,
        requesterName: recipientUser.name,
        requesterPhone: recipientUser.phone,
        requesterEmail: recipientUser.email,
        bloodType: 'O+',
        quantity: 3,
        unit: 'bags',
        reason: 'emergency',
        urgency: 'emergency',
        status: 'pending',
        requestDate: new Date(),
        requiredByDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
        recipientDetails: {
          name: 'John Doe',
          age: 45,
          gender: 'male',
          bloodType: 'O+',
          hospitalName: 'Hospital ABC',
          doctorName: 'Dr. Smith',
          medicalReason: 'Accident injury',
        },
        location: {
          hospital: 'Hospital ABC',
          address: '999 Hospital Lane',
          city: 'Ahmedabad',
          state: 'Gujarat',
          pincode: '380001',
        },
      },
      {
        requesterId: adminUser._id,
        requesterName: adminUser.name,
        requesterPhone: adminUser.phone,
        requesterEmail: adminUser.email,
        bloodType: 'A+',
        quantity: 2,
        unit: 'bags',
        reason: 'surgery',
        urgency: 'urgent',
        status: 'approved',
        requestDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        requiredByDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        approvedDate: new Date(),
        allocatedInventoryIds: [bloodInventory[1]._id],
        recipientDetails: {
          name: 'Jane Doe',
          age: 32,
          gender: 'female',
          bloodType: 'A+',
          hospitalName: 'City Hospital',
          doctorName: 'Dr. Johnson',
          medicalReason: 'Surgery',
        },
        location: {
          hospital: 'City Hospital',
          address: '456 Medical Rd',
          city: 'Ahmedabad',
          state: 'Gujarat',
          pincode: '380002',
        },
      },
      {
        requesterId: recipientUser._id,
        requesterName: recipientUser.name,
        requesterPhone: recipientUser.phone,
        requesterEmail: recipientUser.email,
        bloodType: 'B+',
        quantity: 1,
        unit: 'bags',
        reason: 'blood_transfusion',
        urgency: 'routine',
        status: 'fulfilled',
        requestDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        requiredByDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        approvedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        fulfillmentDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        allocatedInventoryIds: [bloodInventory[2]._id],
        recipientDetails: {
          name: 'Robert Smith',
          age: 60,
          gender: 'male',
          bloodType: 'B+',
          hospitalName: 'Hospital ABC',
          doctorName: 'Dr. Williams',
          medicalReason: 'Regular transfusion',
        },
        location: {
          hospital: 'Hospital ABC',
          address: '999 Hospital Lane',
          city: 'Ahmedabad',
          state: 'Gujarat',
          pincode: '380001',
        },
      },
    ]);

    console.log('✅ 3 Blood requests created');

    // Create blood bank info
    await BloodBank.create({
      name: 'Central Blood Bank',
      email: 'central@bloodbank.com',
      phone: '9876543210',
      registrationNumber: 'BB/REG/001/2024',
      licenseNumber: 'BB/LIC/001/2024',
      licenseExpiryDate: new Date('2026-12-31'),
      address: {
        street: '123 Medical Complex',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380001',
        country: 'India',
      },
      coordinates: {
        latitude: 23.0225,
        longitude: 72.5714,
      },
      operatingHours: {
        monday: { open: '09:00 AM', close: '06:00 PM' },
        tuesday: { open: '09:00 AM', close: '06:00 PM' },
        wednesday: { open: '09:00 AM', close: '06:00 PM' },
        thursday: { open: '09:00 AM', close: '06:00 PM' },
        friday: { open: '09:00 AM', close: '06:00 PM' },
        saturday: { open: '10:00 AM', close: '04:00 PM' },
        sunday: { open: 'Closed', close: 'Closed' },
      },
      capacity: {
        maxStorage: 500,
        currentUsage: bloodInventory.length,
        storageTemperature: 4,
      },
      staffCount: 15,
      accreditation: {
        isAccredited: true,
        accreditationBody: 'AABB',
        validUntil: new Date('2025-12-31'),
      },
      inventory: {
        totalUnits: bloodInventory.length,
        bloodTypes: {
          'A+': 15,
          'A-': 0,
          'B+': 8,
          'B-': 0,
          'AB+': 0,
          'AB-': 5,
          'O+': 20,
          'O-': 12,
        },
      },
      statistics: {
        totalDonors: 5,
        totalDonations: 17,
        totalRequests: 3,
        totalFulfilled: 1,
        totalRejected: 0,
      },
      services: [
        'blood_donation',
        'blood_testing',
        'transfusion',
      ],
      status: 'active',
    });

    console.log('✅ Blood bank info created');

    console.log('\n✅ Database seeding completed successfully!\n');

    // Print login credentials
    console.log('📝 Sample Login Credentials:\n');
    console.log('Admin:');
    console.log('  Email: admin@bbms.com');
    console.log('  Password: admin@123\n');
    console.log('Donor:');
    console.log('  Email: john@example.com');
    console.log('  Password: donor@123\n');
    console.log('Recipient:');
    console.log('  Email: hospital@abc.com');
    console.log('  Password: hospital@123\n');

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

// Run seeding
seedDatabase();
```

### Running the Seed Script

```bash
# Create scripts directory
mkdir scripts

# Add seed script (paste above)
# Then run:
node scripts/seedDatabase.js
```

Add to `package.json`:
```json
"scripts": {
  "seed": "node scripts/seedDatabase.js"
}
```

Then run:
```bash
npm run seed
```

---

## Database Backup & Restore

### Backup MongoDB

```bash
# Local MongoDB backup
mongodump --db bbms --out ./backup

# MongoDB Atlas backup
# Use Atlas GUI or:
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/bbms" --out ./backup

# Create tar file
tar -czf bbms-backup.tar.gz backup/
```

### Restore MongoDB

```bash
# From backup
mongorestore --db bbms ./backup/bbms

# From MongoDB Atlas
mongorestore --uri "mongodb+srv://user:pass@cluster.mongodb.net/bbms" ./backup/bbms
```

---

## Database Migrations

Create `scripts/migrate.js` for future changes:

```javascript
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Donor = require('../models/Donor');

async function migrateDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database');

    // Example migration: Add new field
    // Update all donors with default value
    await Donor.updateMany(
      { status: { $exists: false } },
      { $set: { status: 'eligible' } }
    );

    console.log('✅ Migration completed');
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

migrateDatabase();
```

---

## Data Validation

### Check Data Integrity

```javascript
// scripts/validateData.js
const mongoose = require('mongoose');
require('dotenv').config();

const Donor = require('../models/Donor');
const BloodInventory = require('../models/BloodInventory');

async function validateData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Check donors
    const donors = await Donor.find();
    console.log(`Total Donors: ${donors.length}`);
    
    const eligibleDonors = await Donor.countDocuments({ status: 'eligible' });
    console.log(`Eligible Donors: ${eligibleDonors}`);

    // Check inventory
    const inventory = await BloodInventory.find();
    console.log(`Total Inventory Units: ${inventory.length}`);

    const bloodTypes = await BloodInventory.aggregate([
      { $group: { _id: '$bloodType', count: { $sum: 1 } } },
    ]);
    console.log('Units by Blood Type:', bloodTypes);

    await mongoose.connection.close();
  } catch (error) {
    console.error('Validation error:', error);
  }
}

validateData();
```

---

## Exporting Data

### Export to CSV

```bash
# Install mongo-export
npm install mongo-export

# Export donors
mongoexport --db bbms --collection donors --out donors.json
mongoexport --db bbms --collection donors --csv --fields userId,bloodType,status > donors.csv
```

### Export from MongoDB Compass

1. Open MongoDB Compass
2. Select collection
3. Click "Export Full Collection"
4. Choose JSON or CSV format

---

## Data Cleanup

### Remove Old/Expired Data

```javascript
// scripts/cleanup.js
const mongoose = require('mongoose');
require('dotenv').config();

const BloodInventory = require('../models/BloodInventory');

async function cleanupDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Delete expired blood units
    const result = await BloodInventory.deleteMany({
      expiryDate: { $lt: new Date() },
      status: { $ne: 'used' },
    });

    console.log(`Deleted ${result.deletedCount} expired units`);

    // Delete old completed requests (older than 1 year)
    // Add similar logic for BloodRequest

    await mongoose.connection.close();
  } catch (error) {
    console.error('Cleanup error:', error);
  }
}

cleanupDatabase();
```

Run with:
```bash
node scripts/cleanup.js
```

---

## Production Database Tips

1. **Use MongoDB Atlas** for production
2. **Enable encryption** at rest
3. **Set up backups** (automated daily)
4. **Monitor database** metrics
5. **Set alerts** for critical issues
6. **Use read replicas** for high availability
7. **Implement indexes** for frequently queried fields
8. **Archive old data** to reduce size
9. **Set up point-in-time recovery** (PITR)
10. **Regular testing** of backup restoration

---

**Sample data is ready to load. Start seeding to see the backend in action!**
