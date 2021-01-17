// SPDX-License-Identifier: UNKNOWN
pragma solidity ^0.7.4;

import "./ItemManager.sol";

/**
 * A sub contract that will generate a new address for each item that is created on the chain, so that each user can make the 
 * payment to a new block
*/
contract Item{
    // all the info about the item
    uint public priceInWei;
    uint public pricePaid;
    uint public index;
    
    // We need to keep track of the parent contract, such that it can be called!
    ItemManager parentContract;
    
    // set contract attributes
    constructor(ItemManager _parentContract, uint _priceInWei, uint _index) {
        priceInWei = _priceInWei;
        index = _index;
        parentContract = _parentContract;
    }
    
    // the user will just send money to this address to trigger payment, so creating this contract will allow easy payment
    // We must trigget the parent contract to transfer the funds and allow this item to be marked as paid
    receive() external payable {
        // check if the item has been paid for already
        require(pricePaid == 0, "This item has been paid for already");
        require(priceInWei == msg.value, "Only full payments accepted");
        
        // set that the item has been paid for
        pricePaid = msg.value;
        
        // now call the parent contract to process the payment
        (bool success, ) = address(parentContract).call{value: msg.value}(abi.encodeWithSignature("triggerPayment(uint256)", index));
        require(success, "This transaction was not successful, cancelling");
    }
    
    // required for remix to get the payment thing to show up
    fallback() external {}
    
}