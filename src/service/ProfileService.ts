import { User } from '../models/User'

/**Get userdetails services
 * @author:  aniket.trapasiya<aniket.trapasiya@dataprophets.in>
 * @description:GET user Profile details using Email.
 * @return: all the users details you need.
 */
export const detail = async (req: any) => {
  const findUser = await User.findOne({ _id: req.user._id })
  if (findUser) {
    return findUser
  } else {
    return null
  }
}

/**Update userdetails controller
 * @author:  aniket.trapasiya<aniket.trapasiya@dataprophets.in>
 * @description:Update user Profile details with update query.
 * @return: updated row with data.
 */
export const ProfileUpdateWithImage = async (
  req: any,
  profile_key: string,
  poster_key: string
) => {
  const updateProfile: any = await User.updateMany(
    { _id: req.user._id },
    {
      $set: {
        profile_url: profile_key,
        poster: poster_key,
      },
    }
  )
  if (updateProfile) return true
  else return false
}
export const ProfileUpdate = async (req: any, data: { name: string }) => {
  const UserProfile = await User.updateOne(
    { _id: req.user._id },
    {
      $set: {
        name: data.name,
      },
    }
  )
  if (UserProfile) {
    const document: any = User.findOne({
      _id: req.user._id,
    })

    if (document.name === data.name) return true
    else return 'notUpdated'
  } else return false
}
