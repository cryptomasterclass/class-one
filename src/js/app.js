// Upon refresh of page the following happing in order:
//1. initWeb3();
//2. initContract();
//3. getContractProperties();
//4. displayMyAccountInfo();
//5. checkUserRegistration();
//6. registerUser() getMyInboxSize();
//7. receiveMessages();

var myInboxSize = 0;

App = {

  web3Provider: null,
  contracts: {},

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
      alert("Error: Please install MetaMask then refresh the page.")
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
        alert("Could not fetch your account. Make sure you are logged in to MetaMask, then refresh the page.");
        return;
      }
      return App.initContract();
    });
  },

  initContract: function() {
    $.getJSON('ChatWei.json', function(ChatWeiArtifact) {
      // Get the necessary contract artifact file and use it to instantiate a truffle contract abstraction.
      App.contracts.ChatWei = TruffleContract(ChatWeiArtifact);
      // Set the provider for our contract.
      App.contracts.ChatWei.setProvider(App.web3Provider);
      return App.getContractProperties();
    });
  },

  getContractProperties: function() {
    var self = this;
    var meta;
    App.contracts.ChatWei.deployed().then(function(instance) {
      meta = instance;
      return meta.getContractProperties.call({from: account});
    }).then(function(value) {
      var networkAddress = App.contracts.ChatWei.address;
      document.getElementById("contractAddress").innerHTML = networkAddress;
      var by = value[0];
      var registeredUsersAddress = value[1];
      var numRegisteredUsers = registeredUsersAddress.length;
      var select = '';
      for (i = 0; i < numRegisteredUsers; i++) {
        select += '<option val=' + i + '>' + registeredUsersAddress[i] + '</option>';
      }
      $('#registeredUsersAddressMenu').html(select);
      document.getElementById("contractOwner").innerHTML = by;
    }).catch(function(e) {
      console.log(e);
      self.setStatus("");
    });
    return App.displayMyAccountInfo();
  },

  displayMyAccountInfo: function() {
    web3.eth.getAccounts(function(err, account) {
      if (err === null) {
        App.account = account;
        document.getElementById("myAddress").innerHTML = account;
        web3.eth.getBalance(account[0], function(err, balance) {
          if (err === null) {
            if (balance == 0) {
              alert("Your account has zero balance. You must transfer some Ether to your MetaMask account to be able to send messages with ChatWei. Just come back and refresh this page once you have transferred some funds.");
              App.setStatus("Please buy more Ether");
              return;
            } else {
              document.getElementById("myBalance").innerHTML = web3.fromWei(balance, "ether").toNumber() + " Ether";
              return App.checkUserRegistration();
            }
          } else {
            console.log(err);
          }
        });
      }
    });
    return null;
  },

  setStatus: function(message) {
    document.getElementById("status").innerHTML = message;
  },

  checkUserRegistration: function() {
    var self = this;
    self.setStatus("Checking user registration...please wait");
    var meta;
    App.contracts.ChatWei.deployed().then(function(instance) {
      meta = instance;
      return meta.checkUserRegistration.call({from: account});
    }).then(function(value) {
      if (value) {
        self.setStatus("User is registered...ready");
      } else {
        if (confirm("New user: we need to setup an inbox for you on the Ethereum blockchain. For this you will need to submit a transaction in MetaMask. You will only need to do this once.")) {
          App.registerUser();
        } else {
          return null;
        }
      }
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error checking user registration; see log");
    });
    return App.getMyInboxSize();
  },

  registerUser: function() {
    var self = this;
    self.setStatus("User registration:(open MetaMask->submit->wait)");
    var meta;
    App.contracts.ChatWei.deployed().then(function(instance) {
      meta = instance;
      return meta.registerUser({}, {
        from: account,
        gas: 6385876,
        gasPrice: 20000000000
      });
    }).then(function(result) {
      var gasUsedWei = result.receipt.gasUsed;
      var gasUsedEther = web3.fromWei(gasUsedWei, "ether");
      self.setStatus("User is registered...gas spent: " + gasUsedWei + "(Wei)");
      alert("A personal inbox has been established for you on the Ethereum blockchain. You're all set!");
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error logging in; see log");
    });
    return null;
  },

  getMyInboxSize: function() {
    var self = this;
    var meta;
    App.contracts.ChatWei.deployed().then(function(instance) {
      meta = instance;
      return meta.getMyInboxSize.call({from: account});
    }).then(function(value) {
      // Set global variable
      myInboxSize = value[1];
      if (myInboxSize > 0) {
        document.getElementById("receivedTable").style.display = "inline";
        return App.receiveMessages();
      } else {
        document.getElementById("receivedTable").style.display = "none";
        return null;
      }
    }).catch(function(e) {
      console.log(e);
      self.setStatus("");
    });
  },

  sendMessage: function() {
    var self = this;
    var receiver = document.getElementById("receiver").value;
    if (receiver == "") {
      App.setStatus("Send address cannot be empty");
      return null;
    }
    if (!web3.isAddress(receiver)) {
      App.setStatus("You did not enter a valid Ethereum address");
      return null;
    }
    var myAddress = document.getElementById("myAddress").innerHTML;
    var newMessage = document.getElementById("message").value;
    if (newMessage == "") {
      App.setStatus("Oops! Message is empty");
      return null;
    }
    document.getElementById("message").value = "";
    document.getElementById("sendMessageButton").disabled = true;
    this.setStatus("Sending message:(open MetaMask->submit->wait)");
    var meta;
    App.contracts.ChatWei.deployed().then(function(instance) {
      meta = instance;
      return meta.sendMessage(receiver, newMessage, {
        from: account,
        gas: 6385876,
        gasPrice: 20000000000
      });
    }).then(function(result) {
      console.log(result);
      var gasUsedWei = result.receipt.gasUsed;
      var gasUsedEther = web3.fromWei(gasUsedWei, "ether");
      self.setStatus("Message successfully sent...gas spent: " + gasUsedWei + " Wei");
      document.getElementById("sendMessageButton").disabled = false;
      document.getElementById("message").value = "";
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error sending message; see log");
    });
  },

  receiveMessages: function() {
    var self = this;
    var meta;
    App.contracts.ChatWei.deployed().then(function(instance) {
      meta = instance;
      return meta.receiveMessages.call({}, {from: account});
    }).then(function(value) {
      var content = value[0];
      var timestamp = value[1];
      var sender = value[2];
      for (var m = 0; m < myInboxSize; m++) {
        var tbody = document.getElementById("mytable-tbody");
        var row = tbody.insertRow();
        var cell1 = row.insertCell();
        cell1.innerHTML = timestamp[m];
        var cell2 = row.insertCell();
        cell2.innerHTML = sender[m];
        var cell3 = row.insertCell();

        var thisRowReceivedText = content[m].toString();
        var receivedAscii = web3.toAscii(thisRowReceivedText);
        var thisRowSenderAddress = sender[m];
        cell3.innerHTML = receivedAscii;
        cell3.hidden = true;
      }
      var table = document.getElementById("mytable");
      var rows = table.rows;
      for (var i = 1; i < rows.length; i++) {
        rows[i].onclick = (function(e) {
          replyToAddress = this.cells[1].innerHTML;
          var thisRowContent = (this.cells[2].innerHTML);
          document.getElementById("reply").innerHTML = thisRowContent;
        });
      }
      // create inbox clear all button
      var clearInboxButton = document.createElement("button");
      clearInboxButton.id = "clearInboxButton";
      clearInboxButton.type = "clearInboxButton";
      clearInboxButton.disabled = false;
      clearInboxButton.style.width = "100%";
      clearInboxButton.style.height = "30px";
      clearInboxButton.style.margin = "15px 0px";
      clearInboxButton.innerHTML = "Clear inbox";
      document.getElementById("receivedTable").appendChild(clearInboxButton);
      clearInboxButton.addEventListener("click", function() {
        document.getElementById("clearInboxButton").disabled = true;
        App.clearInbox();
      });
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting messages; see log");
    });
    return;
  },

  clearInbox: function() {
    var self = this;
    var meta;
    this.setStatus("Clearing inbox:(open MetaMask->submit->wait)");
    App.contracts.ChatWei.deployed().then(function(instance) {
      meta = instance;
      return meta.clearInbox({}, {
        from: account,
        gas: 6385876,
        gasPrice: 20000000000
      });
    }).then(function(value) {
      var clearInboxButton = document.getElementById("clearInboxButton");
      clearInboxButton.parentNode.removeChild(clearInboxButton);
      $("#mytable tr").remove();
      document.getElementById("receivedTable").style.display = "none";
      alert("Your inbox was cleared");
      self.setStatus("Inbox cleared");
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error clearing inbox; see log");
    });
  },

  replyToMessage: function() {
    document.getElementById("message").focus();
    document.getElementById("message").select();
    document.getElementById("receiver").value = replyToAddress;
  },

  copyAddressToSend: function() {
    var sel = document.getElementById("registeredUsersAddressMenu");
    var copyText = sel.options[sel.selectedIndex];
    document.getElementById("receiver").value = copyText.innerHTML;
    document.getElementById("message").focus();
    document.getElementById("message").select();
  }
};

$(document).ready(function() {
  App.init();
});
