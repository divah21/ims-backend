import { Model } from 'objection';
import bcrypt from 'bcrypt';

class User extends Model {
  static tableName = 'users';

  // Method to hash password before saving to the database
  async $beforeInsert() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  // Method to compare password
  async comparePassword(password) {
    return bcrypt.compare(password, this.password);
  }

  // You can define additional fields here as needed
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['email', 'fullName', 'role'],

      properties: {
        id: { type: 'integer' },
        email: { type: 'string' },
        fullName: { type: 'string' },
        role: { type: 'string', enum: ['User', 'Administrator', 'Manager'], default: 'User' },
        picture: { type: 'string' },
        password: { type: 'string' },
      },
    };
  }
}

export default User;
