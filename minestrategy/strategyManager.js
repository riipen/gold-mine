class StrategyManager{
    constructor(){
        this._strategy = null;    
    }
    set strategy(strategy){
        this._strategy = strategy;
    }
    get strategy(){
        return this.strategy;    
    }
    move(mine, position){
        return this._strategy.move(mine, position);
    }
}
export default StrategyManager;