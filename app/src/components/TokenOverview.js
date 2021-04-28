import React from "react";
import { newContextComponents } from "@drizzle/react-components";

const { ContractData } = newContextComponents;

export default ({ drizzle, drizzleState }) => {
  return(
    <div className="max-w-lg mx-auto my-8 shadow-lg bg-gray-700 rounded-lg px-8 py-4">
      <div className="flex justify-between space-x-4 text-white">
        <div className="flex justify-between space-x-2">
          <span>Your balance</span>
          <ContractData
            drizzle={drizzle}
            drizzleState={drizzleState}
            contract="WrappedBitCloutToken"
            method="balanceOf"
            methodArgs={[drizzleState.accounts[0]]}
          />
        </div>
        <div className="flex justify-between space-x-2">
          <span>Total Supply</span>
          <ContractData
            drizzle={drizzle}
            drizzleState={drizzleState}
            contract="WrappedBitCloutToken"
            method="totalSupply"
            methodArgs={[{ from: drizzleState.accounts[0] }]}
          />
        </div>
        <div>
          <ContractData
            drizzle={drizzle}
            drizzleState={drizzleState}
            contract="WrappedBitCloutToken"
            method="symbol"
            hideIndicator
          />
        </div>
      </div>
    </div>
  );
};