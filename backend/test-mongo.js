const mongoose = require('mongoose');
const uri = 'mongodb+srv://sanvigoyall22_db_user:qrFekgXta6NJv3iF@cluster0.ffyelfa.mongodb.net/moodlet?appName=Cluster0';
mongoose.connect(uri)
  .then(() => { console.log('✅ Connected'); process.exit(0); })
  .catch(err => { console.error('❌ Error:', err.message); process.exit(1); });
