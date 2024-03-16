module.exports = {
  async up(db: any, client: any) {
    return await db.createCollection('reviews')
  },

  async down(db: any, client: any) {
    return await db.collection('reviews').drop()
  },
}
