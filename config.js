

twitch = window.Twitch ? window.Twitch.ext : null;

twitch.onContext((context) => {
  twitch.rig.log(context);
});

twitch.onAuthorized((auth) => {
  // token = auth.token;
  // userId = auth.userId;
});

// we'll catch any config changes in here.
twitch.configuration.onChanged(function(){
    // First get all creator coins.    
    getAllCreatorCoins()
    .then((out) => {
        for(var item in out){
          loadedCoins[item] = out[item];
          console.log('Item: ', out[item]);
          $('#coins-select').append("<option value='"+out[item].coinSymbol+"'>"+out[item].coinName+"</option>");
        }
        
    }).catch(err => twitch.rig.log(err));

    // get currency rates.
    getCurrencyRates()
    .then((out) => {
      for(var currencySymbol in out.rates){
        //TODO: add this currencySymbol to a dropdown.
        //TODO: add RLY, USD to top of the list too.
      }
    }).catch(err => twitch.rig.log(err));
    configs = loadConfig(twitch);
    if (configs != ""){
      // Access our configs here
      //TODO: ui: set default currency to `configs.currency` value
      //TODO: ui: set default coin to `configs.coin` value
    }
});

//TODO: please save configs after submiting a form by user
function saveConfig(currencySymbol, coinSymbol, floatPrecision, maxPollinginMinutes){
  configs = {"currency": currencySymbol, "coin": coinSymbol, "maxPolling": maxPollinginMinutes, "floatPrecision": floatPrecision};
  // save config in twitch configurations.
  saveConfig(twitch, configs);
}

