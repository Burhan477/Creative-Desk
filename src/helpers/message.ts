const success = {
  userDetailSuccessfully: 'data get successfully',
  userSignInSuccessfully: 'User login successfully.',
  getProfileDataRetriveSuccessFully: 'Profile Details Retrive Successfully',
  profileEditSuccessFully: 'Profile Updated!',
  PaymentSuccessfully: 'Payment Successfull',
  OrderSuccessfull: 'Order Successfull',
  paymentDetailsRetriveSuccessfully: 'Payment List',
  signUpSuccessfull: 'Signup successfully',
  ViewAdded: 'View Added',
  newPromptAdded: 'New Prompt Added',
  productAdded: 'Product Added',
  subCategoryAdded: 'Sub Category Added',
  categoryRetriveSuccessfully: 'Category Retrive Successfully',
  subCategoryRetriveSuccessfully: 'Sub Category Retrive Successfully',
  productRetriveSuccessfully: 'Product Retrive Successfully',
  promptRetriveSuccessfully: 'Prompt Retrive Successfully',
  paymentFail: 'Payment failed',
  liked: 'Prompt Liked',
  alreadyLiked: 'Already Liked',
  BuyerDetailsSuccessfully: 'Buyer Details Retrive Successfully',
  sendMail: 'Mail send Successfully.',
  getPasswordResetSuccessfully: 'Password Reset Successfully',
  otpVerifySuccessFully: 'OTP verify successesfully.',
  resendMail: 'Resend Mail',
}
const smsContent = {}
const error = {
  userNotFound: 'user not found',
  validDataError: 'Please enter valid data',
  emailRequiredError: 'Email is Required',
  userExistError: 'User already exists.',
  tokenNotFound: 'Something went wrong, Please try after some time.',
  invalidAuthorizationToken: 'Invalid Authorization Token',
  notRegisteredError:
    'You are not registered user. Please register yourself to access.',
  wrongPasswordError:
    'The password you have entered was wrong. Please try with correct password.',
  emailNotFoundError:
    'User does not exists with this email! Please enter valid Email',
  wrongUserRole: 'Access Denied',
  somethingWentWrongError: 'Something went wrong please try again later',
  invalidCredentials: 'wrong data',
  fileNotFoundError: 'File not found!',
  imageLimitError: 'You can not upload more than 9 images',
  imageLimitthreeError: 'Minimum 3 Images required',
  unauthorizedaccess: 'You do not have any authorization to access this file',
  tokenIsRequired: 'Authorization token is required',
  invalidAuthorizationSchema: 'Invalid Authorization Token schema',
  fileIsMissingError: 'File not Provided',
  profileNotEdited: 'Profile Not Edited',
  somethingIsMissing: 'Something is missing Please Check Details',
  parameterMissing: 'Parameters not provided! Please Contact our support team.',
  passwordNotFoundError: 'Password Not Found',
  wrongOtpError: 'Wrong OTP',
  otpNotFound: 'OTP Not Found',
}
const subject = {
  welcomeToAHS: 'Welcome.',
}

export default {
  success,
  error,
  smsContent,
  subject,
}
