/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("inspection_items", function (table) {
    table.increments("id").primary();
    table.integer("inspection_id").unsigned().notNullable();
    table.integer("template_item_id").unsigned();
    table.string("question_text").notNullable();
    table.string("response");
    table.text("comments");
    table.string("status");
    table.jsonb("media");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table
      .foreign("inspection_id")
      .references("id")
      .inTable("inspections")
      .onDelete("CASCADE");
    table
      .foreign("template_item_id")
      .references("id")
      .inTable("inspection_templates")
      .onDelete("SET NULL");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .table("inspection_items", function (table) {
      table.dropForeign("inspection_id");
      table.dropForeign("template_item_id");
    })
    .then(function () {
      return knex.schema.dropTableIfExists("inspection_items");
    });
};
