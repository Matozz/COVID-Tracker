import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";

import "./InfoBox.css";

function InfoBox({ title, cases, active, isRed, isOrange, total, ...props }) {
  return (
    <Card
      className={`infoBox ${active && "infoBox--selected"} ${
        isOrange && "infoBox--orange"
      } ${isRed && "infoBox--red"}`}
      onClick={props.onClick}
    >
      <CardContent>
        {/* title */}
        <Typography className="infoBox_title" gutterBottom>
          <strong>{title}</strong>
        </Typography>
        {/* +num */}
        <h2
          className={`infoBox_cases ${
            !isRed && !isOrange && "infoBox_cases--green"
          }`}
        >
          {cases}
        </h2>
        {/* total */}
        <Typography className="infoBox_total">
          <strong>{total} Total</strong>
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
