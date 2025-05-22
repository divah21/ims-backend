/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("documents", function (table) {
    table.increments("id").primary();
    table.string("file_name").notNullable();
    table.string("file_path").notNullable();
    table.string("description").nullable();
    table.integer("incident_id").unsigned().nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table
      .foreign("incident_id")
      .references("id")
      .inTable("incidents")
      .onDelete("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .table("documents", function (table) {
      table.dropForeign("incident_id");
    })
    .then(function () {
      return knex.schema.dropTableIfExists("documents");
    });
};
