const excludedAPIs = [
  'GET:/api/prompt/',
  'GET:/api/prompt/:id',
  'GET:/api/product/',
  'GET:/api/product/:id/:timePeriod',
  'GET:/api/category/',
  'GET:/api/category/:id',
  'GET:/api/category/prompt/:id/:timePeriod',
  'GET:/api/subCategory/',
  'GET:/api/subCategory/:id',
  'GET:/api/subCategory/prompt/:id/:timePeriod',
  'POST:/api/auth/signIn',
  'POST:/api/auth/signUp',
]
export default excludedAPIs
