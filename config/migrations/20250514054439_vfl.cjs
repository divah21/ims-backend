/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("vfl_reports", function (table) {
    table.increments("id").primary();
    table.date("report_date").notNullable();
    table.integer("leader_id").unsigned().notNullable();
    table.string("location").notNullable();
    table.text("observation").notNullable();
    table.text("action_taken").nullable();
    table.integer("department_id").unsigned().notNullable();
    table
      .foreign("leader_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .foreign("department_id")
      .references("id")
      .inTable("departments")
      .onDelete("CASCADE");

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .table("vfl_reports", function (table) {
      table.dropForeign("leader_id");
      table.dropForeign("department_id");
    })
    .then(function () {
      return knex.schema.dropTableIfExists("vfl_reports");
    });
};
