module.exports = {
  async up(db: any, client: any) {
    return await db.createCollection('views')
  },

  async down(db: any, client: any) {
    return await db.collection('views').drop()
  },
}
