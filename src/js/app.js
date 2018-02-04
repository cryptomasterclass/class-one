App = {

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      App.web3Provider = web3.currentProvider;
      App.setStatus("MetaMask detected");
    } else {
      // set the provider you want from Web3.providers
      alert("This Dapp requires that you first install an Ethereum wallet. This wallet allows ChatWei to talk to the Ethereum network. If you are using Chrome, you can download the MetaMask extension by clicking the logo below. Once you have installed MetaMask go ahead and login then come back to this page and refresh and you should be good to go!");
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      return null;
    }

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your account, please try again later.");
        return;
      }
      account = accs[0];
      if (!account) {
        App.setStatus("Please login to MetaMask");
        alert("Could not fetch your Ethereum account. Make sure you are logged in to MetaMask, then refresh the page.");
        return;
      }
      return App.initContract();
    });
  },

  //todo
  initContract: function() {},
  //todo
  getContractProperties: function() {},

  setStatus: function(message) {
    document.getElementById("status").innerHTML = message;
  }

};

$(document).ready(function() {
  App.init();
});
