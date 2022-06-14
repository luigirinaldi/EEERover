import React from "react";

export const IpContext = React.createContext({
    roverIP: "192.168.0.16",
    localIP: "172.20.10.2",
    changeIP: () => {},
  }
);