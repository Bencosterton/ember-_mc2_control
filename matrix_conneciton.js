const { EmberClient, EmberClientEvent, Emberlib, LoggingService } = require('node-emberplus');

async function runClient() {
    const host = 'mc2 IP address';
    const port = 9000;
    const client = new EmberClient({ host, port, logger: new LoggingService(5) });

    client.on(EmberClientEvent.ERROR, e => {
        console.error('Error:', e);
    });

    try {
        await client.connectAsync();
        console.log(`Connected to Lawo MC² console at ${host}:${port}`);

                await client.getDirectoryAsync();
                let matrix = await client.getElementByPathAsync("_4/_1/_0"); //This is the Audio Matrix element
                console.log("Connecting source 1 to target 0");

                await client.matrixConnectAsync(matrix, 1897, [207]); // This is the destaion and [source] to be routed
//              await client.matrixDisconnectAsync(matrix, 1897, [207])
                matrix = await client.matrixSetConnectionAsync(matrix, 0, [1897,207])
                await client.getElementByPathAsync(matrix.getPath())
                await client.disconnectAsync();

    } catch (e) {
        console.error('Error:', e.stack);
    } finally {
        await client.disconnectAsync(); // Close the connection
        console.log('Disconnected from Lawo MC² console');
    }
}

runClient();
