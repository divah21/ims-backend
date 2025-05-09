/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("incidents", function (table) {
        table.increments("id").primary();
        table.string("title").notNullable();
        table.string("description").notNullable();
        table.integer("department_id").notNullable();
        table
            .enum("type", [
                "Lost Time Injury",
                "Fatality",
                "Near Miss",
                "Environmental Incidents",
                "Property and Equipment Damage",
                "First Aid Cases",
                "HPI",
                "Medical Treatment Case",
            ])
            .notNullable();
        table
            .enum("priority", ["NEAR_MISS", "MINOR", "MAJOR"])
            .notNullable()
            .defaultTo("MINOR");
        table.enum("status", ["Open", "In Progress", "Resolved", "Closed"]).notNullable().defaultTo("Open");
        table.integer("reporter_id").notNullable(); // Change reporter_id to integer
        table.foreign("reporter_id").references("id").inTable("users");
        table.foreign("department_id").references("id").inTable("departments");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists("incidents", function (table) {
        table.dropColumn("department_id");
        table.dropColumn("type");
        table.dropColumn("priority");
        table.dropColumn("status");
    });
};
