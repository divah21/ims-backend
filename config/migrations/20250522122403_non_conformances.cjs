/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("non_conformances", function (table) {
    table.increments("id").primary();
    table.integer("inspection_id").unsigned().notNullable();
    table.string("title");
    table.text("description");
    table.enum("severity", ["low", "medium", "high"]).notNullable();
    table.boolean("is_resolved").defaultTo(false);
    table.date("target_date");
    table.integer("assigned_to").unsigned();
    table.text("resolution_notes");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table
      .foreign("inspection_id")
      .references("id")
      .inTable("inspections")
      .onDelete("CASCADE");
    table
      .foreign("assigned_to")
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .table("non_conformances", function (table) {
      table.dropForeign("inspection_id");
      table.dropForeign("assigned_to");
    })
    .then(function () {
      return knex.schema.dropTableIfExists("non_conformances");
    });
};
