/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("corrective_actions", function (table) {
    table.increments("id").primary();
    table.integer("non_conformance_id").unsigned().notNullable();
    table.string("action_required").notNullable();
    table.date("due_date");
    table.boolean("is_completed").defaultTo(false);
    table.integer("assigned_to").unsigned();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table
      .foreign("non_conformance_id")
      .references("id")
      .inTable("non_conformances")
      .onDelete("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .table("corrective_actions", function (table) {
      table.dropForeign("non_conformance_id");
    })
    .then(function () {
      return knex.schema.dropTableIfExists("corrective_actions");
    });
};
