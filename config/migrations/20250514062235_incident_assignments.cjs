/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("incident_assignments", function (table) {
    table.increments("id").primary();
    table.integer("incident_id").unsigned().notNullable();
    table.integer("assignee_id").unsigned().notNullable();
    table.timestamp("assigned_at").defaultTo(knex.fn.now());

    table
      .foreign("incident_id")
      .references("id")
      .inTable("incidents")
      .onDelete("CASCADE");
    table
      .foreign("assignee_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .table("incident_assignments", function (table) {
      table.dropForeign("incident_id");
      table.dropForeign("assignee_id");
    })
    .then(function () {
      return knex.schema.dropTableIfExists("incident_assignments");
    });
};
