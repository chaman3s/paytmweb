import {Card} from "../Card";
import Button from "../Button";
export const BankCard = ({ name,title,style ,bal,clk}) => {
  if (false) {
    return (
    
      <Card  style={style}title={name}>
        <div className="text-center pb-8 pt-8">No Recent transactions</div>
      </Card>
    );
  }


  return (
    <Card   style={style} title={title}>
      <div className="pt-2">
        { (
          <div key={0} className="flex justify-between">
            <div>
              <div className="text-sm">Dummy bank</div>
              <div className="text-slate-600 text-xs">
                {Date.now()}
              </div>
            </div>
            <div className="flex flex-col justify-center">{(bal)?(<div>{"Rs " +bal}</div>):(<Button label="Check" clk={clk}/>)}</div>
          </div>
        )}
      </div>
    </Card>
  );
};
