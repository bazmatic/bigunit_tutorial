# BigUnit tutorial

[https://github.com/bazmatic/bigunit](https://github.com/bazmatic/bigunit)

Set up a basic Typescript project:

```bash
mkdir bu
cd bu
yarn init -y
yarn add -D typescript @types/node
```

Edit `tsconfig.json` `compilerOptions`

```jsx

"target": "esnext"
```

Edit `package.json`

```json
"scripts": {
	"build": "tsc",
	"start": "tsc && node index.js"
}
```

Add BigUnit!

```bash
yarn add bigunit
```

Make a new file `index.ts`

```jsx
import { BigUnit, BigUnitFactory } from "bigunit";

function main() {

}
```

Let’s pretend we’re getting some crypto amounts from a contract as `bigint` values

```tsx
function getBalancesFromContract() {
    return {
        eth: 1_123_456_789_000_000_123n, // 1.123456789 ETH
        btc: 1_234_567_890n, // 123.456789 BTC
        usd: 450_000_29n, // 450,000.29 USD
    }
}
```

We can convert those into BigUnits

```jsx
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
}
```

We can display them as precise decimal strings by with `.toString()`

```jsx
// Display balances as decimal strings
console.log(`ETH balance: ${ethBalance.toString()}`);
console.log(`BTC balance: ${btcBalance.toString()}`);
console.log(`USD balance: ${usdAmount.toString()}`);
```

```bash
ETH balance: 1.123456789000000123
BTC balance: 12.34567890
USD balance: 450000.29
```

We can convert them into `number`, `bigint`, or a decimal `string` with a given number of decimal places.

```jsx
// Convert balance to number, bigint, bigint string or formatted decimal string
const ethBalanceNumber = ethBalance.toNumber() // Loses precision
const ethBalanceBigInt = ethBalance.toBigInt();
const ethBalanceFormattedDecimal = ethBalance.format(4); // 4 decimal places

console.log(`ETH balance number: ${ethBalanceNumber}`);
console.log(`ETH balance bigint: ${ethBalanceBigInt}`);
console.log(`ETH balance formatted decimal: ${ethBalanceFormattedDecimal}`);
```

```bash
ETH balance number: 1.123456789
ETH balance bigint: 1123456789000000123
ETH balance formatted decimal: 1.1235
```

Let’s calculate our portfolio value

```jsx
const ethPrice = UsdFactory.fromNumber(2_300.45);
const btcPrice = UsdFactory.fromNumber(85_000);
const ethDollarValue = UsdFactory.from(ethPrice.mul(ethBalance));
const btcDollarValue = UsdFactory.from(btcPrice.mul(btcBalance));

// Add up the dollar values
const totalPortfolioValue = ethDollarValue.add(btcDollarValue).add(usdAmount);

// Display it as a pretty locale string with commas
console.log(`Total value: $${totalPortfolioValue.toNumber().toLocaleString()}`);    
```

```bash
Total value: $1,501,967.44
```

Saving / loading BigUnits from storage with `toObject()` from `fromObject()`

```jsx
// Save my ethBalance to DB
console.log("Saving my ethBalance to DB");
const ethBalanceDb = ethBalance.toObject();
console.log(JSON.stringify(ethBalanceDb, null, 2));

// Load my ethBalance from DB
console.log("Loading my ethBalance from DB");
const ethBalanceFromDb = BigUnit.fromObject(ethBalanceDb);
console.log(`ETH balance from DB: ${ethBalanceFromDb.toString()}`);
```

```bash
Saving my ethBalance to DB
{
  "value": "1123456789000000123",
  "precision": 18,
  "name": "ETH"
}
Loading my ethBalance from DB
ETH balance from DB: 1.123456789000000123
```

Sending / parsing BigUnits from JSON

```jsx
// Send my ethBalance as a DTO
console.log("Sending my ethBalance as JSON");
const ethBalanceDto = ethBalance.toDTO();
console.log(JSON.stringify(ethBalanceDto, null, 2));

// Load my ethBalance from DTO
console.log("Loading my ethBalance from JSON");
const ethBalanceFromDto = BigUnit.fromObject(ethBalanceDto);
console.log(ethBalanceFromDto.toString());
```

```bash
Sending my ethBalance as JSON
{
  "value": "1123456789000000123",
  "precision": 18,
  "name": "ETH",
  "decimalValue": "1.123456789000000123"
}
Loading my ethBalance from DTO
1.123456789000000123
```