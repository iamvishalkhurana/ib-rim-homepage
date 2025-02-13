/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./utils/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:MawgQ2z4TxUG@ep-rough-tooth-a1iuhlei.ap-southeast-1.aws.neon.tech/Interview-Buddy?sslmode=require",
  },
};
