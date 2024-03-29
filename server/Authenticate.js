const { connectToDatabase, performQuery } = require('./DatabaseConnector');

// Checks if session is valid and has a user
function authenticate(session) {
    return new Promise(async (resolve, reject) => {
      let conn;
      try {
        conn = await connectToDatabase();
        console.log(session.id);
        const rows = await performQuery(
          conn,
          "SELECT * FROM `cookie_data` WHERE `sessionId` = ?",
          [session.id]
        );
        console.log(rows);
  
        if (rows.length !== 1) {
          resolve(0);
          return;
        }
  
        // If expired delete entry
        const currentTime = new Date();
        if (rows[0].expiresAt < currentTime) {
          session.destroy();
          await performQuery(
            conn,
            "DELETE FROM `cookie_data` WHERE userId = ?",
            [rows[0].userId]
          );
          resolve(0);
          return;
        }
  
        // Authentication successful, cookie is correct
        resolve(1);
      } catch (error) {
        reject(error);
      } finally {
        if (conn) {
          conn.end();
        }
      }
    });
  }

module.exports = {
    authenticate
}