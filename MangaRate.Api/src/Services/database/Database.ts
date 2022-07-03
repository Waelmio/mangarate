import { Logger } from "tslog";
import config from 'config';
import pg = require('pg');
import { types } from 'pg';
import path = require("path");
import Postgrator = require('postgrator');

const log: Logger = new Logger();

if (!config.has("database.credentials")) {
    log.error("There is no database credentials in the configuration !");
    process.exit(1);
}

const dbConfig: pg.PoolConfig = config.get("database.credentials");


let poolOff = false;
let pool = new pg.Pool(dbConfig);

types.setTypeParser(1700, function(val) {
    const thefloat = parseFloat(val);
    if (isNaN(thefloat)) {
        throw new Error("Could not parse NUMERIC to Float");
    }
    return thefloat;
});

/**
 * Initialize a new pool for the database with the actual configuration or give the existing one.
 * This pool should only be ended with db_init.end().
 * @returns pg.Pool
 */
export function getPool() {
    if (poolOff) {
        log.warn("Recreating a pool after ending the previous one. This should not happen.");
        pool = new pg.Pool(dbConfig);
        poolOff = false;
    }
    return pool;
}

/**
 * End the current pool. This should be used instead of ending the pool directly.
 */
export async function endPool() {
    if (pool) {
        await pool.end();
        poolOff = true;
    }
};

export async function migrate(to = 'max') {
    try {
        const client = await getPool().connect();

        const postgrator = new Postgrator({
            // Directory containing migration files
            migrationPattern: path.resolve(__dirname, 'migrations/*'),
            // Driver: must be pg, mysql, mysql2 or mssql
            driver: 'pg',
            // Database connection config
            ...dbConfig,
            // Schema table name. Optional. Default is schemaversion
            // If using Postgres, schema may be specified using . separator
            // For example, { schemaTable: 'schema_name.table_name' }
            schemaTable: "migration_tracking",
            execQuery: (query) => client.query(query)
        });

        const appliedMigrations = await postgrator.migrate(to);
        if (Object.keys(appliedMigrations).length !== 0) {
            log.info("Migrated: ", appliedMigrations);
        }
        client.release();
    }
    catch (error) {
        log.fatal(error);
        // Because migrations prior to the migration with error would have run
        // error object is decorated with appliedMigrations
        process.exit(-1);
    }
}
