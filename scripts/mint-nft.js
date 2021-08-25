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
    maxPriorityFeePerGas: 1999999987,
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

mintNFT('https://gateway.pinata.cloud/ipfs/QmPFQC2NdxAjbNrESNRLnzZGE2sWyuUebehwj1z4bUVvMh');
