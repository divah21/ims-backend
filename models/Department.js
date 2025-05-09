import { Model } from "objection";

class Department extends Model {
  static get tableName() {
    return "departments";
  }
}
export default Department;
