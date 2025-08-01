const mongoose =  require('mongoose');
const connectionString  =  process.env.PRODUCT_MONGODB_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/myticket';

mongoose.connect(connectionString)
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
    
class Database{
    constructor() {
        this.connect();
    }
    
    connect(type = 'mongodb'){
        if (1==1){
            mongoose.set('debug', true);
            mongoose.set('debug', {color:true});
        }
    
        mongoose.connect(connectionString, {
            maxPoolSize: 50
        })
            .then( _ => console.log('MongoDB connected successfully'))
            .catch(err => console.error('MongoDB connection error:', err));
    }
    
    static  getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const instanceMongoDB = Database.getInstance();
module.exports = instanceMongoDB;