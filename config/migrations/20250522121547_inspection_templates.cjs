/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("inspection_templates", function (table) {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("category").notNullable();
    table.text("description");
    table.jsonb("structure");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("inspection_templates");
};
