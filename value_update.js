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

        // Get the Mute parameter from the ember tree
        let muteNode = await client.getElementByPathAsync("_3/_1/_4/_d00/_e/_400016c0/_400016c1");
        console.log('Mute node:', muteNode);

        // Check if muteNode is a parameter, and then set its value
        if (muteNode && muteNode.contents && muteNode.contents.value !== undefined) {
            await client.setValueAsync(muteNode, false); // This is where you set the new boolean value (true/false)
            console.log('Mute value set to true');

            // Get update of new value printed to console
            let updatedMuteNode = await client.getElementByPathAsync("_3/_1/_4/_d00/_e/_400016c0/_400016c1");
            console.log('Updated Mute node:', updatedMuteNode);
        } else {
            console.log('Mute node not found or not a valid parameter.');
        }

    } catch (e) {
        console.error('Error:', e.stack);
    } finally {
        await client.disconnectAsync(); // Close the connection
        console.log('Disconnected from Lawo MC² console');
    }
}

runClient();
