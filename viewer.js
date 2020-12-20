// some defaults
currentCoin = "STEP";
currentCurrency = "USD";
currentMaxPolling = 5 * 60 * 1000;
currentFloatPrecision = 5;

twitch = window.Twitch ? window.Twitch.ext : null;

twitch.onContext(function (context) {
  twitch.rig.log(context);
});

twitch.onAuthorized(function (auth) {
  // save our credentials
  // token = auth.token;
  // tuid = auth.userId;
});

// we'll catch any config changes in here.
twitch.configuration.onChanged(function(){
   
   twitch.configuration.set("broadcaster", "1", JSON.stringify(""));
   configs = loadConfig(twitch);
   if (configs != ""){
       currentCurrency = configs.currency;
       currentCoin = configs.coin;
       currentMaxPolling = configs.maxPolling;
       currentFloatPrecision = configs.floatPrecision;
   }
   // Rally.io consts
   
   getAllCreatorCoins()
   .then((out) => {
        for(var item in out){
          if (out[item].coinSymbol == currentCoin){
              twitch.rig.log(out[item]);
              //TODO: is this working?
              $('.coin-name').html(out[item].coinName);
              //TODO: is this working?
              $('.coin-image').attr('src', out[item].coinImagePath);
              return
          }
        }
        
    }).catch(err => console.error(err));
    // Get coin price for the first time;
    updateCoinPrice();
    // Update using max polling
    setInterval(function(){ 
        // code goes here that will be run every `currentMaxPolling` minutes.  
        updateCoinPrice();
    }, currentMaxPolling * 60 * 1000);
});

function updateCoinPrice(){
      getCreatorCoinBySymbol(currentCoin)
      .then((out) => {
          twitch.rig.log(out);
          // add coin price to index 
          var curPrice;
          if (currentCurrency == "USD"){
             const price = parseFloat(out.priceInUSD).toFixed(currentFloatPrecision);
             curPrice = "$"+price;
          }else if( currentCurrency == "RLY"){
             const price = parseFloat(out.priceInRLY).toFixed(currentFloatPrecision);
              curPrice = price + " $RLY";
          }else{
             const price = getPrice(currentCurrency, currentCoin, currentFloatPrecision);
              curPrice = price + " " + currentCurrency;
          }
          //TODO: is this working?
          $('.coin-price').html(curPrice);
      });  
}
