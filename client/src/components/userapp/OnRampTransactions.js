import { Card } from "../Card";

export const OnRampTransactions = ({ transactions, title, data, style }) => {
  if (!data || data.length === 0) {
    return (
      <Card title={title} style={style}>
        <div className="text-center pb-8 pt-8">No Recent transactions</div>
      </Card>
    );
  }

  return (
    <Card title={title} style={style}>
      <div className="pt-2">
        {data.slice(-2).reverse().map((transaction, index) => (
          <div key={index} className="flex justify-between">
            <div>
              <div className="text-sm">{transaction.description}</div>
              <div className="text-slate-600 text-xs">{transaction.valueDate}</div>
            </div>
            <div className="flex flex-col justify-center">+ Rs {transaction.amount}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};
