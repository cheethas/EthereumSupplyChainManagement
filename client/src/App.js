import React, { Component } from "react";
import ItemManagerContract from "./contracts/ItemManager.json";
import ItemContract from "./contracts/Item.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { loaded: false}

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
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

  runExample = async () => {

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  // handle when a user updates anything in an input box to the state
  handleInputChange = (event) => {
    const target = event.target;
    // if the target is a checkbox then use the checked value, otherwise the value value
    const value = target.value == "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  handleSubmit = async() => {
    const {cost, itemName} = this.state;
    console.log(itemName, cost, this.itemManager);
    // send the transaction from the first loaded accounts !!
    await this.itemManager.methods.createItem(itemName, cost).send({from: this.accounts[0]});
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
