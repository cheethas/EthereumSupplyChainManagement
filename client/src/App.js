import React, { Component } from "react";
import ItemManagerContract from "./contracts/ItemManager.json";
import ItemContract from "./contracts/Item.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { cost: 0, itemName: "exampleItem1", loaded: false}

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await this.web3.eth.net.getId();
      this.itemManagerContract = new this.web3.eth.Contract(
        ItemManagerContract.abi,
        ItemManagerContract.networks[networkId] && ItemManagerContract.networks[networkId].address
      );

      this.itemContract = new this.web3.eth.Contract(
        ItemContract.abi,
        ItemContract.networks[networkId] && ItemContract.networks[networkId].address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ loaded: true});
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };


  // handle when a user updates anything in an input box to the state
  handleInputChange = (event) => {
    const target = event.target;
    // if the target is a checkbox then use the checked value, otherwise the value value
    const value = target.value === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  handleSubmit = async() => {
    const {cost, itemName} = this.state;
    console.log(itemName, cost, this.itemManager);
    // send the transaction from the first loaded accounts !!
    let result = await this.itemManagerContract.methods.createItem(itemName, cost).send({from: this.accounts[0]});

    console.log(result);
    alert("Send " + cost+ "Wei to " + result.events.SupplyChainStep.returnValues._item);
  }

  //0xCc3203B806f83381D5d7daFB179AfC2f99fA7741
  // super important method that listens to any events that get emitted by the smart contract!! 
  // 
  listenToEventPayment = () => {
    // way of passing this into a callback function
    let self = this;

    this.itemManager.events.SupplyChainStep().on("data", async function(evt) {
      console.log(evt);
      // Read the value from the blockchain!!
      let itemObj = await self.itemManager.methods.items(evt.returnValues._itemIndex).call();
      alert("Item" + itemObj._identifier+ "was paid: Deliver it now!");
    })
  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Simple Payment / Supply Chain Example</h1>
        <h2>Items</h2>
        
        <h2>Add Element</h2>
        <div>
          Cost <input 
            type = "text"
            name="cost"
            value={this.state.cost}
            onChange={this.handleInputChange}
          />
          Item Name: <input 
            type="text"
            name="itemName"
            value={this.state.itemName}
            onChange={this.handleInputChange}
          />
          <button type="button" onClick={this.handleSubmit}> Create new Item </button>
        </div>

        
      </div>
    );
  }
}

export default App;
