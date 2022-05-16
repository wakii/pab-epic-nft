// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";
import "base64-sol/base64.sol";

contract PabEpicNFT is ERC721URIStorage, ERC721Royalty, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string baseSvg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";
    string[] firstWords = ["Think", "Play", "Dance", "Listen The Black Skirts music", "Calculate dydx", "Pab The Best", "Do Push up", "Drink Redbull", "Google It", "Create", "Blog", "Go Townhall meeting", "Communicate with your ex", "Talk to your boss", "Say Hello to a stranger", "Be Kind to a stranger", "Work out", "Be cool", "Walk", "Run like Bolt", "Learn", "Code", "Sing", "Read", "Drink water", "Be royal", "Work hard", "Go get some coffee", "TDD", "Call your mom", "Go watch TV", "Give me a BAYC plz ...", "Don't watch Youtube all day", "Wake up early", "Know yourself", "Play Football", "Plant", "Ignore", "Forget", "Remember", "Be thankful", "Zen", "Buy", "Sell", "HODL", "BUIDL" "Run away", "Forgive", "Be happy", "Eat dinner", "Take your time","Whisper", "Poop", "Pee", "Go shopping", "Be fancy", "Go abroad", "Take a rest", "Buy me coffee", "Look around Linkedin", "Dive into the Opensea", "Believe", "Trust", "Go to bed", "Doubt", "Travel", "Do Nothing", "Buy Ethereum", "Mine", "Sell Ethereum", "Netflix and Chill", "Write", "Wait", "Snooze alarms", "Mute the Slack", "Watch '2001:A Space Odyssey'", "Pretend", "Restore", "Crawl", "Spit it out", "White Lie", "Don't Lie", "Cooperate", "Climb","Destroy", "Contribute", "Date", "Go Club", "Save the Children", "Heal the world", "Make a better place", "Hack"];
    string[] SecondWords = ["Earn", "Mint", "Prove"];
    uint256 public maxSupply = firstWords.length;
    uint256 public pabPrice = 5000000000000000000; // 5 token;

    event NewEpicNFTMinted(address sender, uint256 tokenId);

    constructor() ERC721 ("PabToX", "P2X") {
        console.log("This is PabEpicNft. Whoa!");
        _setDefaultRoyalty(msg.sender, 750); // set royalty as 7.5%

        // mint for myself
        _mintEpicNft(msg.sender);
    }

    function _random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }

    function pickRandomWord(uint256 tokenId, string[] memory words) public view returns (string memory) {
        uint256 rand = _random(string(abi.encodePacked(words.length, Strings.toString(tokenId), block.timestamp)));
        rand = rand % words.length;
        return words[rand];
    }

    function mintEpicNft() public payable {
        require(pabPrice <= msg.value, "Token value sent is not enough");
        _mintEpicNft(msg.sender);
    }
 
    function _mintEpicNft(address recipient) internal {
        require(_tokenIds.current() <= maxSupply, "Not enough Token reserved anymore");
        
        uint256 newItemId = _tokenIds.current();
        string memory first = pickRandomWord(newItemId, firstWords);
        string memory second = pickRandomWord(newItemId, SecondWords);
        string memory combinedWord = string(abi.encodePacked(first,"To",second));

        string memory finalSvg = string(abi.encodePacked(baseSvg,first,'\nTo\n',second, "</text></svg>"));

        string memory json = Base64.encode(
            abi.encodePacked(
                '{"name": "',combinedWord,'", "description": "Your Epic Words", "image": "data:image/svg+xml;base64,', Base64.encode(bytes(finalSvg)),'"}'
            )
        );

        string memory finalTokenUri = string(abi.encodePacked("data:application/json;base64,", json));

        
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, finalTokenUri);
        
        _tokenIds.increment();
        console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);
        console.log(
            string(
                abi.encodePacked(
                    "https://nftpreview.0xdev.codes/?code=",
                    finalTokenUri
                )
            )
        );
        emit NewEpicNFTMinted(recipient, newItemId);
        console.log("--------------------\n");
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }  

    function setDefaultRoyalty(address newReceiver, uint96 newfeeNumerator) external onlyOwner {
        _setDefaultRoyalty(newReceiver, newfeeNumerator);
    }


    function withdraw() external onlyOwner nonReentrant {
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "Transfer failed.");
    }

    function _burn(uint256 tokenId) internal override(ERC721URIStorage, ERC721Royalty) {
        super._burn(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Royalty)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}