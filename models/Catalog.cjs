const mongoose = require('mongoose');

const catalogSchema = new mongoose.Schema({
    type: String,
    name: String,
    mac: String,
    ipv4: String,
    online: Boolean,
    description: String,
    creationDate: Date
});

const Catalog = mongoose.model('Catalog', catalogSchema);

module.exports = Catalog;
