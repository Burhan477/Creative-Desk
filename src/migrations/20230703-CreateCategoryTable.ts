module.exports = {
  async up(db: any, client: any) {
    return await db.createCollection('categories')
  },

  async down(db: any, client: any) {
    return await db.collection('categories').drop()
  },
}
