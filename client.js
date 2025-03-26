import dgram from "node:dgram";
import dnsPacket from "dns-packet";

const client = dgram.createSocket("udp4");
const PORT = 5300;
const HOST = "localhost";

// const msg = Buffer.from("Hello DNS server");
// client.send(msg, PORT, HOST, (err) => {
//     if (err) {
//         console.error(err);
//         client.close();
//     } else {
//         console.log("message sent!!");
//         // client.close();
//     }
// })

const query = dnsPacket.encode({
    type: "query",
    id: 1,
    flags: dnsPacket.RECURSION_DESIRED,
    questions: [
        {
            type: "CNAME",
            class: "IN",
            name: "blog.ksaquib.dev",
        },
    ],
});

client.send(query, PORT, HOST, (err) => {
    if (err) {
        console.error(err);
        client.close();
    } else {
        console.log("Query sent!!");
        // client.close();
    }
})

client.on("message", (msg) => {
    const response = dnsPacket.decode(msg);
    console.log("Response received:", response);
    client.close();
});