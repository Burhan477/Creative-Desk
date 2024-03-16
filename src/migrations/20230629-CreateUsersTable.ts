module.exports = {
  async up(db: any, client: any) {
    return await db.createCollection('users', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['name', 'email', 'password', 'role'],
          properties: {
            name: {
              bsonType: 'string',
            },
            email: {
              bsonType: 'string',
              pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}',
            },
            password: {
              bsonType: 'string',
            },
            role: {
              bsonType: 'string',
            },
          },
        },
      },
      validationLevel: 'strict',
      validationAction: 'error',
    })
  },

  async down(db: any, client: any) {
    return await db.collection('users').drop()
  },
}
