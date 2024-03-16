export async function up(db: any): Promise<void> {
  // Create the "users" collection

  // Get the Mongoose model for the "users" collection
  const categories = [
    {
      name: 'AI Models',
      icon: 'fa fa-cubes',
      title: 'All prompts',
      page_title: 'Best prompts',
      link: 'best-ai-prompts',
      description: 'Explore',
    },
    {
      name: 'Art & Illustrations',
      icon: 'fa fa-palette',
      title: 'All Art & Illustrations prompts',
      page_title: 'Art & Illustrations prompts',
      link: 'art-and-illustrations',
      description: 'Explore',
    },
    {
      name: 'Logos & Icons',
      icon: 'fa fa-shapes',
      title: 'All Logos & Icons prompts',
      page_title: 'Logos & Icons prompts',
      link: 'logos-and-icons',
      description: 'Explore',
    },
    {
      name: 'Graphics & Design',
      icon: 'fa fa-image',
      title: 'All Graphics & Design prompts',
      page_title: 'Graphics & Design prompts',
      link: 'graphics-and-design',
      description: 'Explore',
    },
    {
      name: 'Productivity & Writing',
      icon: 'fa fa-signature',
      title: 'All Productivity & Writing prompts',
      page_title: 'Productivity & Writing prompts',
      link: 'productivity-and-writing',
      description: 'Explore',
    },
    {
      name: 'Marketing & Business',
      icon: 'fa fa-briefcase',
      title: 'All Marketing & Business prompts',
      page_title: 'Marketing & Business prompts',
      link: 'marketing-and-business',
      description: 'Explore',
    },
    {
      name: 'Photography',
      icon: 'fa fa-camera',
      title: 'All Photography prompts',
      page_title: 'Photography prompts',
      link: 'photography',
      description: 'Explore',
    },
    {
      name: 'Games & 3D',
      icon: 'fa fa-gamepad',
      title: 'All Games & 3D prompts',
      page_title: 'Games & 3D prompts',
      link: 'games-and-3d',
      description: 'Explore',
    },
  ]
  try {
    await db.collection('categories').insertMany(categories)
  } catch (err) {
    console.log(err, 'error')
    throw err
  }

  // Optionally, add any initial data or perform additional database operations
  // For example:
  // await User.insertMany([
  //   { name: 'John', age: 25 },
  //   { name: 'Jane', age: 30 },
  // ]);
}

export async function down(db: any): Promise<void> {
  // Drop the "users" collection
  await db.collection('topcategories').drop()
}
