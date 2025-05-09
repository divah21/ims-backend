import { Model } from "objection";
import User from "./User.js";

class Newsfeed extends Model {
  static get tableName() {
    return "newsfeed";
  }

  static get relationMappings() {
    return {
      author: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "newsfeed.author_id",
          to: "users.id",
        },
      },
    };
  }
}

export default Newsfeed;
