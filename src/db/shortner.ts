import sqlite3 from "sqlite3";

const pool = await (async () => {
  const db = new sqlite3.Database(
    import.meta.env.DEV ? ":memory:" : "db/database.db"
  );

  db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS shortened (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          link TEXT NOT NULL,
          shortened_id VARCHAR(8) NOT NULL UNIQUE
        )
  
    `);
  });

  return db;
})();

function sql(
  template: TemplateStringsArray,
  ...params: Array<string | number>
) {
  return new Promise<unknown[]>((resolve, reject) => {
    const query = template.reduce((prev, curr, i) => {
      return `${prev}${curr}${i < params.length ? "?" : ""}`;
    }, "");

    pool.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function genID() {
  const caracteres =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";

  for (let i = 0; i < 8; i++) {
    const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
    id += caracteres.charAt(indiceAleatorio);
  }
  return id;
}

export const saveLink = async (link: string): Promise<string | undefined> => {
  try {
    const id = genID();

    await sql`INSERT INTO shortened (link, shortened_id) VALUES (${link}, ${id}) `;

    return id;
  } catch (e) {
    console.error(e);
  }
};

export const getUrlById = async (id: string) => {
  const rows =
    (await sql`SELECT link FROM shortened WHERE shortened_id = ${id}`) as Array<
      Record<string, string>
    >;

  if (rows && rows[0] && rows[0].link) {
    return rows[0].link;
  }
};
