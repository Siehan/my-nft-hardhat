require('dotenv').config();
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const { createAlchemyWeb3 } = require('@alch/alchemy-web3');
const web3 = createAlchemyWeb3(API_URL);

//console.log(JSON.stringify(contract.abi));

const contract = require('../artifacts/contracts/MyNFT.sol/MyNFT.json');
const contractAddress = '0xba831b4dea469f59e430f65b09aaf6df9d4b649a';
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

async function mintNFT(tokenURI) {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); //get latest nonce

  //the transaction
  const tx = {
    from: PUBLIC_KEY,
    to: contractAddress,
    nonce: nonce,
    gas: 500000,
    //maxPriorityFeePerGas: 1999999987,
    data: nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI(),
  };

  const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  signPromise
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(signedTx.rawTransaction, function (error, hash) {
        if (!error) {
          console.log(
            '🎉 The hash of your transaction is: ',
            hash,
            "\n Check Alchemy's Mempool to view the status of your transaction!"
          );
        } else {
          console.log('❗Something went wrong while submitting your transaction:', error);
        }
      });
    })
    .catch((error) => {
      console.log(' Promise failed:', error);
    });
}

mintNFT('https://gateway.pinata.cloud/ipfs/QmfMRiCVue2vXAYa63E8HLVWhg8kugsGvk3qqfyE29mFkS');
//mintNFT('https://gateway.pinata.cloud/ipfs/QmPFQC2NdxAjbNrESNRLnzZGE2sWyuUebehwj1z4bUVvMh');

//mintNFT('https://gateway.pinata.cloud/ipfs/QmbfqqNv9W8PSbmaRgYHJxPM8ymAnt5MjxFijMq6tW92Bj');
// Contract deployed to address: 0x2098C6cD90d2Bb10F9B74ABC74cA57656131bA87
// The hash of your transaction is:  0xbae4bacbd115b9a5dc509f098dfcec84f28f52a3c0e4b932281c6a01d1bbf37e

/*
This is the “ERC721 Metadata JSON Schema” referenced above.
{
    "title": "Asset Metadata",
    "type": "object",
    "properties": {
        "name": {
            "type": "string",
            "description": "Identifies the asset to which this NFT represents"
        },
        "description": {
            "type": "string",
            "description": "Describes the asset to which this NFT represents"
        },
        "image": {
            "type": "string",
            "description": "A URI pointing to a resource with mime type image/* representing the asset to which this NFT represents. Consider making any images at a width between 320 and 1080 pixels and aspect ratio between 1.91:1 and 4:5 inclusive."
        }
    }
}
*/
