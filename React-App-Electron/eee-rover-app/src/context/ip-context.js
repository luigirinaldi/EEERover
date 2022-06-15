import React from "react";

export const IpContext = React.createContext({
    roverIP: "192.168.0.16",
    changeIP: () => {},
  }
);