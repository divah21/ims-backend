/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const tableExists = await knex.schema.hasTable("departments");

  if (!tableExists) {
    return knex.schema.createTable("departments", function (table) {
      table.increments("id").primary();
      table.string("name").notNullable().unique();
      table.string("hod").nullable();
      table.string("location").nullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  } else {
    return knex.schema.alterTable("departments", function (table) {
      table.increments("id").primary();
      table.string("name").notNullable().unique();
      table.string("hod").nullable();
      table.string("location").nullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("departments");
};
