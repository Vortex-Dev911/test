exports.up = function(knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.increments('id').primary();
      table.string('username').unique().notNullable();
      table.string('email').unique().notNullable();
      table.string('password').notNullable();
      table.string('real_name');
      table.integer('level').defaultTo(1);
      table.integer('xp').defaultTo(0);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('games', (table) => {
      table.string('id').primary();
      table.string('name').notNullable();
      table.string('icon');
      table.string('category');
      table.boolean('is_hot').defaultTo(false);
      table.boolean('is_new').defaultTo(false);
    })
    .createTable('user_stats', (table) => {
      table.integer('user_id').unsigned().primary();
      table.foreign('user_id').references('users.id');
      table.integer('games_played').defaultTo(0);
      table.integer('wins').defaultTo(0);
      table.integer('losses').defaultTo(0);
      table.integer('draws').defaultTo(0);
      table.integer('win_streak').defaultTo(0);
      table.integer('challenges_sent').defaultTo(0);
    })
    .createTable('achievements', (table) => {
      table.string('id').primary();
      table.string('name').notNullable();
      table.string('icon');
      table.string('description');
      table.integer('requirement');
    })
    .createTable('user_achievements', (table) => {
      table.integer('user_id').unsigned();
      table.string('achievement_id');
      table.primary(['user_id', 'achievement_id']);
      table.foreign('user_id').references('users.id');
      table.foreign('achievement_id').references('achievements.id');
      table.timestamp('unlocked_at').defaultTo(knex.fn.now());
    })
    .createTable('friends', (table) => {
      table.integer('user_id1').unsigned();
      table.integer('user_id2').unsigned();
      table.string('status'); // 'pending', 'accepted'
      table.primary(['user_id1', 'user_id2']);
      table.foreign('user_id1').references('users.id');
      table.foreign('user_id2').references('users.id');
    })
    .createTable('messages', (table) => {
      table.increments('id').primary();
      table.integer('sender_id').unsigned();
      table.integer('receiver_id').unsigned();
      table.text('content').notNullable();
      table.boolean('is_read').defaultTo(false);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.foreign('sender_id').references('users.id');
      table.foreign('receiver_id').references('users.id');
    })
    .createTable('match_history', (table) => {
      table.increments('id').primary();
      table.integer('p1_id').unsigned();
      table.integer('p2_id').unsigned();
      table.string('game_id');
      table.string('winner_id');
      table.timestamp('played_at').defaultTo(knex.fn.now());
      table.foreign('p1_id').references('users.id');
      table.foreign('p2_id').references('users.id');
      table.foreign('game_id').references('games.id');
    })
    .createTable('game_rooms', (table) => {
      table.string('id').primary(); // Room ID
      table.integer('host_id').unsigned();
      table.integer('guest_id').unsigned();
      table.string('game_id');
      table.string('status').defaultTo('waiting'); // waiting, playing, finished
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.foreign('host_id').references('users.id');
      table.foreign('guest_id').references('users.id');
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('game_rooms')
    .dropTableIfExists('messages')
    .dropTableIfExists('match_history')
    .dropTableIfExists('friends')
    .dropTableIfExists('user_achievements')
    .dropTableIfExists('achievements')
    .dropTableIfExists('user_stats')
    .dropTableIfExists('games')
    .dropTableIfExists('users');
};
