import database from '../../src/database';

// Limpa todos os dados do banco de dados
export default function truncate() {
  return Promise.all(
    Object.keys(database.connection.models).map(key =>
      database.connection.models[key].destroy({
        truncate: true,
        force: true,
      })
    )
  );
}
