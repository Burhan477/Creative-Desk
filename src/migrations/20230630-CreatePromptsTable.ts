module.exports = {
  async up(db: any, client: any) {
    await db.createCollection('prompts')
  },

  async down(db: any, client: any) {
    await db.collection('prompts').drop()
  },
}
