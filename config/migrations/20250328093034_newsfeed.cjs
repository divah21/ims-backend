/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("newsfeed", function (table) {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.text("content").notNullable();
    table.string("image_url").nullable();
    table.integer("author_id").unsigned().notNullable();
    table
      .foreign("author_id")
      .references("id")
      .inTable("users")
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
  return knex.schema.dropTableIfExists("newsfeed");
};
