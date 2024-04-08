export default class UserDTO {
  static getUser(user) {
    const { first_name, last_name } = user;
    return { first_name, last_name };
  }
}
