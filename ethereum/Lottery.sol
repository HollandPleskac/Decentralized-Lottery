pragma solidity 0.6.6;

import "https://github.com/smartcontractkit/chainlink/blob/develop/evm-contracts/src/v0.6/VRFConsumerBase.sol";

contract Lottery is VRFConsumerBase {
    
    address public manager;
    address[] public players;
    
    bytes32 internal keyHash;
    uint256 internal fee;
    uint256 public randomResult;
    uint internal nextId;
    
    string public state;
    
    struct WinnerData {
        address winnerAddress;
        uint numberOfPlayers;
        uint etherAmount;
    }
    
    event PickingWinnerEvent(
        uint indexed id,
        uint indexed timestamp
    );
    
    event WinnerChosenEvent(
        uint indexed id,
        address indexed winnerAddress,
        uint numberOfPlayers,
        uint weiAmount,
        uint indexed timestamp
    );
    
    constructor()
        VRFConsumerBase(
            0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B, // VRF Coordinator
            0x01BE23585060835E02B77ef475b0Cc51aA1e0709  // LINK Token
        ) public
    {
        manager = msg.sender;
        keyHash = 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311;
        fee = 0.1 * 10 ** 18; // 0.1 LINK (Varies by network)
        nextId = 0;
        state = 'Lottery Running';
    }
    
    function emitEvent() public {
        emit WinnerChosenEvent(nextId, address(this), players.length, address(this).balance, now);
        nextId++;
    }
    
    function requestRandomNumber() public returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
        emit PickingWinnerEvent(nextId, now);
        nextId++;
        state = 'Picking Winner';
        return requestRandomness(keyHash, fee);
    }
    
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        // randomResult = randomness.mod(players.length-1); // numbers from 0 to players.length-1
        randomResult = randomness;
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
    
    function pickWinner(uint randomNum) public payable restricted {
        uint index = randomNum % players.length;
        // uint index = random() % players.length;
        emit WinnerChosenEvent(nextId, players[index], players.length, address(this).balance, now);
        nextId++;
        payable(players[index]).transfer(address(this).balance); // this.balance is the amount of money in the contract
        players = new address[](0); // brand new array of addresses - (0) means the array has an inital size of 0
        state = 'Lottery Running';
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


// architecture

/*
onClick pick winner:
  request random number
  start loading

fulfill randomness function
  emit event (pick winner)

listening for events {
  
  onPickWinner {
    return value of winner(index)
    pickWinner(index -> send money to winner)
    end loading
  }

}
*/