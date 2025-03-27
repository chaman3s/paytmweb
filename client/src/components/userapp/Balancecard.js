import { Card } from "../Card";


export const BalanceCard = ({ amount, locked ,style}) => {
  return (
    <Card title="Wallet Balance" style={style}>
      <div className="flex justify-between border-b border-slate-300 pb-2">
        <div>Unlocked balance</div>
        <div>{amount / 100} INR</div>
      </div>
      <div className="flex justify-between border-b border-slate-300 py-2">
        <div>Total Locked Balance</div>
        <div>{locked / 100} INR</div>
      </div>
      <div className="flex justify-between border-b border-slate-300 py-2 border-hidden">
        <div>Total Balance</div>
        <div>{(locked + amount) / 100} INR</div>
      </div>
    </Card>
  );
};
