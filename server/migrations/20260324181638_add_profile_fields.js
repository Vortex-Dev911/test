/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('users', (table) => {
    table.string('avatar_url');
    table.boolean('is_private').defaultTo(false);
  });
};

exports.down = function(knex) {
  return knex.schema.table('users', (table) => {
    table.dropColumn('avatar_url');
    table.dropColumn('is_private');
  });
};
