/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments("id").primary();
    table.string("email").notNullable().unique(); // User's email
    table.string("password").notNullable(); // User's hashed password
    table.string("fullName"); // User's full name
    table.enu("role", ["User", "Administrator", "Manager"]).defaultTo("User"); // User role
    table.string("picture"); // URL to the user's profile picture
    table.timestamps(true, true); // Created at and updated at timestamps
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
