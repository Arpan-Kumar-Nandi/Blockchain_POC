const mongoose = require('mongoose')

const db = 'mongodb+srv://arpan:12345@cluster0.udfdtyn.mongodb.net/DMarketPlace?retryWrites=true&w=majority'

;(async () => {
  try {
    await mongoose.connect(db)
    console.log('MongoDB connected')
  } catch(err) {
    console.error(err)
  }
})()

const contractSchema = mongoose.Schema({
    name: String,
    address: String
});

const Contract = mongoose.model('Contract',contractSchema)

module.exports =  { Contract }

