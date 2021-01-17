// SPDX-License-Identifier: UNKNOWN
pragma solidity ^0.7.4;

import "./Ownable.sol";
import "./Item.sol";

/**
 * The ItemManager will handle item creation, as well as what supply chain state it is currently in
*/
contract ItemManager is Ownable{
    
    // the supply chain state tells us for each ordered item, what state it is currenly in
    enum SupplyChainState{Created, Paid, Delivered}
        
    // each item that exists will be assigned an item constructor
    struct S_Item{
        Item _item;
        string _identifier;
        uint _itemPrice;
        ItemManager.SupplyChainState _state;
    }
    
    // each item will be given a unique id, when stored in the contract, this id is the item index, which will be incremented each
    // time an item is added 
    mapping(uint => S_Item) public items;
    uint itemIndex;
    
    // The event that will be emitted when each item moves along our supply chain state!
    event SupplyChainStep(uint _itemIndex, uint _step, address _item);
    
    /**
     * When we create an item we will simply save it within our items mapping! 
     * At the given index :)
    */ 
    function createItem(string memory _identifier, uint _itemPrice) public onlyOwner{
        Item item = new Item(this, _itemPrice, itemIndex);
        items[itemIndex]._item = item;
        items[itemIndex]._identifier = _identifier;
        items[itemIndex]._itemPrice = _itemPrice;
        items[itemIndex]._state = SupplyChainState.Created;
        
        // emit an event that the item was Created
        emit SupplyChainStep(itemIndex, uint(items[itemIndex]._state), address(item));
        
        // increment for the next item
        itemIndex++;
        
    }
    
    function triggerPayment(uint _itemIndex) public payable {
        // make sure that the amount sent is correct!!!
        require(items[_itemIndex]._itemPrice == msg.value, "Only full payments accepted");
        // make sure that the item has not been paid for yet!
        require(items[_itemIndex]._state == SupplyChainState.Created, "Item must not have already been paid for");
        
        // update the items state as paid
        items[_itemIndex]._state = SupplyChainState.Paid;
    
        // emit an event that the item was paid for
        emit SupplyChainStep(_itemIndex, uint(items[_itemIndex]._state), address(items[_itemIndex]._item));
        
    }
    
    function triggerDelivery(uint _itemIndex) public onlyOwner {
        // make sure that the item has been paid for
        require(items[_itemIndex]._state == SupplyChainState.Paid, "Item hsa not been paid for yet!");
        // update the item as delivered
        items[_itemIndex]._state = SupplyChainState.Delivered;
        
        // emit an event that the item was Delivered
        emit SupplyChainStep(_itemIndex, uint(items[_itemIndex]._state), address(items[_itemIndex]._item));
        
    }
}