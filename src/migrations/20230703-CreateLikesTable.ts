module.exports = {
  async up(db: any, client: any) {
    return await db.createCollection('likes')
  },

  async down(db: any, client: any) {
    return await db.collection('likes').drop()
  },
}
