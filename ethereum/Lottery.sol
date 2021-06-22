pragma solidity ^0.8.4;

contract Lottery {
    
    address public manager;
    address[] public players;
    
    constructor() {
        manager = msg.sender;
    }
    
    function enter() public payable {
        require(msg.value > .01 ether ); // only continue in contract, if true sender's ether is > .01 ether
        for (uint i = 0; i < players.length; i++) {
          require(players[i] != msg.sender);  
        }
        players.push(msg.sender);
    }
    
    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }
    
    function pickWinner() public payable restricted {
        uint index = random() % players.length;
        payable(players[index]).transfer(address(this).balance); // this.balance is the amount of money in the contract
        players = new address[](0); // brand new array of addresses - (0) means the array has an inital size of 0
    }
    
    // modifiers are used to save code
    modifier restricted() {
        require(msg.sender == manager);
        _; // all code in modified fn gets added to _ placeholder
    }

    function getPlayers() public view returns (address[] memory) {
        return players;
    }
    
    
}