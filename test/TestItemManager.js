const ItemManger = artifacts.require("./ItemManager.sol");

// This is the same as describe in chai and mocha
contract("Item Manager", accounts => {

    // Use it to say, it should complete some task
    it("Should be able to add a new item", async() => {
        // get the item manager contract and create a new instance of it
        const itemManagerContract = await ItemManger.deployed();
        const itemName = "Test 1";
        const itemPrice = 500;

        // check that you can add the item and its is from a fresh start
        const result = await itemManagerContract.createItem(itemName, itemPrice, {from: accounts[0]});
        assert.equal(result.logs[0].args._itemIndex, 0, "This is not the first item!");

        // now check that the item has the same name as the one that we added!!
        const item = await itemManagerContract.items(0);
        assert.equal(item._identifier, itemName, "The identifier that was added is different");
    }); 

});