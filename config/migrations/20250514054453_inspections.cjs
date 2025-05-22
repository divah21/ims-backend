exports.up = function (knex) {
  return knex.schema.createTable("inspections", function (table) {
    table.increments("id").primary();

    table.string("title").notNullable();
    table
      .enum("type", ["one_time", "recurring"])
      .defaultTo("one_time")
      .notNullable();
    table.date("inspection_date").notNullable();
    table.time("inspection_time");
    table.date("next_inspection_date");
    table.integer("inspector_id").unsigned().notNullable();
    table
      .foreign("inspector_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table.integer("department_id").unsigned().notNullable();
    table
      .foreign("department_id")
      .references("id")
      .inTable("departments")
      .onDelete("CASCADE");

    table.string("location").notNullable();

    table.integer("template_id").unsigned();
    table
      .foreign("template_id")
      .references("id")
      .inTable("inspection_templates")
      .onDelete("SET NULL");

    table
      .enum("status", ["scheduled", "in_progress", "completed", "cancelled"])
      .defaultTo("scheduled");

    table
      .enum("frequency", ["weekly", "monthly", "yearly"])
      .defaultTo("monthly")
      .nullable();

    table.text("general_findings");

    table.jsonb("meta");

    // Timestamps
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  knex.schema.table("inspections", function (table) {
    table.dropForeign("inspector_id");
    table.dropForeign("department_id");
    table.dropForeign("template_id");
  });
  return knex.schema.dropTableIfExists("inspections");
};
