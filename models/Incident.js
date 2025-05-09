import { Model } from "objection";
import User from "./User.js";  // Import User model correctly
import Department from "./Department.js";  // Import Department model correctly

class Incident extends Model {
  static get tableName() {
    return "incidents";
  }

  static get relationMappings() {
    return {
      reporter: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "incidents.reporter_id",
          to: "users.id",
        },
      },
      department: {
        relation: Model.BelongsToOneRelation,
        modelClass: Department,
        join: {
          from: "incidents.department_id",
          to: "departments.id",
        },
      },
    };
  }
}

export default Incident;
