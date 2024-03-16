module.exports = {
  async up(db: any, client: any) {
    return await db.createCollection('products')
  },

  async down(db: any, client: any) {
    return await db.collection('products').drop()
  },
}
