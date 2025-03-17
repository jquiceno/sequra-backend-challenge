export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database_uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/sequra',
});
