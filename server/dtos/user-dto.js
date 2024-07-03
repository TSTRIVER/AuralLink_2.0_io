class UserDto {
  id;
  phone;
  name;
  email;
  avatar;
  activated;
  createdAt;

  constructor(user) {
    this.id = user._id;
    (this.name = user.name);
      (this.avatar = user.avatar
        ? `${process.env.BASE_URL}${user.avatar}`
        : null);
    this.phone = user.phone;
    this.email = user.email;
    this.activated = user.activated;
    this.createdAt = user.createdAt;
  }
}

export default UserDto;
