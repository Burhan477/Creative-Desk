module.exports = {
  async up(db: any, client: any) {
    return await db.createCollection('otp')
  },

  async down(db: any, client: any) {
    return await db.collection('otp').drop()
  },
}
