import { BigUnit, BigUnitFactory } from "bigunit";

function getBalancesFromContract() {
    return {
        eth: 1_123_456_789_000_000_123n, // 1.123456789 ETH
        btc: 1_234_567_890n, // 123.456789 BTC
        usd: 450_000_29n, // 450,000.29 USD
    }
}

function main() {
    // Make factories
    const EthFactory = new BigUnitFactory(18, "ETH");
    const BtcFactory = new BigUnitFactory(8, "BTC");
    const UsdFactory = new BigUnitFactory(2, "USD");

    // Pretend to get balances from contract as BigInts
    const balances = getBalancesFromContract();
    const ethBalance = EthFactory.fromBigInt(balances.eth);
    const btcBalance = BtcFactory.fromBigInt(balances.btc);
    const usdAmount = UsdFactory.fromBigInt(balances.usd);

    // Display balances as strings
    console.log(`ETH balance: ${ethBalance.toString()}`);
    console.log(`BTC balance: ${btcBalance.toString()}`);
    console.log(`USD balance: ${usdAmount.toString()}`);

    // Convert balance to number, bigint, bigint string or formatted decimal string
    const ethBalanceNumber = ethBalance.toNumber() // Loses precision
    const ethBalanceBigInt = ethBalance.toBigInt();
    const ethBalanceFormattedDecimal = ethBalance.format(4); // 4 decimal places

    console.log(`ETH balance number: ${ethBalanceNumber}`);
    console.log(`ETH balance bigint: ${ethBalanceBigInt}`);
    console.log(`ETH balance formatted decimal: ${ethBalanceFormattedDecimal}`);

    // Multiply balances by prices to get dollar values
    const ethPrice = UsdFactory.from(2_300.45);
    const btcPrice = UsdFactory.from(85_000);
    const ethDollarValue = UsdFactory.from(ethPrice.mul(ethBalance));
    const btcDollarValue = UsdFactory.from(btcPrice.mul(btcBalance));

    // Add up the dollar values
    const totalPortfolioValue = ethDollarValue.add(btcDollarValue).add(usdAmount);
    console.log(`Total value: ${totalPortfolioValue.toNumber().toLocaleString()}`);

    // Save my ethBalance to DB
    console.log("Saving my ethBalance to DB");
    const ethBalanceDb = ethBalance.toObject();
    console.log(JSON.stringify(ethBalanceDb, null, 2));

    // Load my ethBalance from DB
    console.log("Loading my ethBalance from DB");
    const ethBalanceFromDb = BigUnit.fromObject(ethBalanceDb);
    console.log(`ETH balance from DB: ${ethBalanceFromDb.toString()}`);

    // Send my ethBalance as JSON
    console.log("Sending my ethBalance as JSON");
    const ethBalanceDto = ethBalance.toDTO();
    console.log(JSON.stringify(ethBalanceDto, null, 2));

    // Load my ethBalance from JSON
    console.log("Loading my ethBalance from JSON");
    const ethBalanceFromDto = BigUnit.fromObject(ethBalanceDto);
    console.log(ethBalanceFromDto.toString());
}

main()