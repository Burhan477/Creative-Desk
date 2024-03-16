module.exports = {
  async up(db: any, client: any) {
    return await db.createCollection('payments')
  },

  async down(db: any, client: any) {
    return await db.collection('payments').drop()
  },
}
