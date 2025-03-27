import {Card} from "../Card";

export const OnRampTransactions = ({ transactions ,title , style}) => {
  if (false) {
    return (
    
      <Card title={title}>
        <div className="text-center pb-8 pt-8">No Recent transactions</div>
      </Card>
    );
  }

  return (
    <Card title={title} style={style}>
      <div className="pt-2">
        { (
          <div key={0} className="flex justify-between">
            <div>
              <div className="text-sm">Received INR</div>
              <div className="text-slate-600 text-xs">
                {"25-02-2024"}
              </div>
            </div>
            <div className="flex flex-col justify-center">+ Rs {10000/ 100}</div>
          </div>
        )}
      </div>
    </Card>
  );
};
