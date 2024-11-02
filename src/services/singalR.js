const connection = new signalR.HubConnectionBuilder()
  .withUrl("https://voice-paddel-fmgzeugkg5bjh6f9.brazilsouth-01.azurewebsites.net/matchHub")
  .build();

async function start() {
  try {
    await connection.start();
    console.log("Conectado a SignalR");
  } catch (err) {
    console.error(err);
    setTimeout(start, 5000);
  }
}

function joinGroup(matchIdentifier) {
  if (matchIdentifier) {
    connection
      .invoke("JoinMatch", matchIdentifier)
      .catch((err) => console.error(err));
  }
}

connection.onclose(start);

export async function startSingalR(matchIdentifier) {
  await start();
  joinGroup(matchIdentifier);

  return connection;
}
