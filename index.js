import dgram from "node:dgram";
import dnsPacket from "dns-packet";
import { db } from "./db.js";
const server = dgram.createSocket("udp4");
const PORT = 5313


server.on("error", (err) => {
  console.error(err);
  server.close();
})
server.on("message", (msg, rinfo) => {
  const incomingReq = dnsPacket.decode(msg);
  const ipFromDb = db[incomingReq.questions[0].name];
  console.log(ipFromDb);
  const ans = dnsPacket.encode({
    type: 'response',
    id: incomingReq.id,
    flags: dnsPacket.AUTHORITATIVE_ANSWER,
    questions: incomingReq.questions,
    answers: [{
      type: ipFromDb.type,
      class: 'IN',
      name: incomingReq.questions[0].name,
      data: ipFromDb.data
    }]
  })

  

  server.send(ans, rinfo.port, rinfo.address, (err) => {
    if (err) {
      console.error(err);
      server.close();
    } else {
      console.log(`Sent response to ${rinfo.address}:${rinfo.port}`);
    }
  })
});

server.bind(PORT,"0.0.0.0", () => {
  console.log(`UDP server listening on port ${PORT}`);
})