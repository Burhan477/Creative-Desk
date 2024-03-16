module.exports = {
  async up(db: any, client: any) {
    return await db.createCollection('buy')
  },

  async down(db: any, client: any) {
    return await db.collection('buy').drop()
  },
}
