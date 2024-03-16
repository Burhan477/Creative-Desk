module.exports = {
  async up(db: any, client: any) {
    await db.createCollection('subcategories')
  },

  async down(db: any, client: any) {
    await db.collection('subcategories').drop()
  },
}
